# Based off of model from activity 10.3.10
#import sqlite3
#import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, render_template, redirect, jsonify, json, request

#################################################
# Database Setup (examples: https://pythonbasics.org/flask-sqlite/, https://flask.palletsprojects.com/en/1.1.x/patterns/sqlite3/)
# This approach is based off of model from activity 10.3.10.
#################################################
engine = create_engine("sqlite:///static/data/birthdata.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the tables
County = Base.classes.county
National = Base.classes.national

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

# Routes to render templates, using data from SQLite when needed 

@app.route("/aboutdata")
def aboutdata():
    
    return render_template("aboutdata.html")


@app.route("/aboutus")
def aboutus():
    
    return render_template("aboutus.html")


@app.route("/")
def dashboard():
    session = Session(engine)

    # This route will prepare all of the visualizations within the dashboard. 

    #################################################
    # LINE_CHART 
    #################################################
    # Query to return overall US data and state-specifc by year, filter to return 15-19 year data 
    resultsUS = session.query(National.year, National.us_rate).filter(National.age_group == "15-19 years").order_by(National.year.asc()).distinct()
    resultsState = session.query(National.state, National.year, National.state_rate).filter(National.age_group == "15-19 years").order_by(National.year.asc()).all()
    # Use of distinct: https://stackoverflow.com/questions/48102501/remove-duplicates-from-sqlalchemy-query-using-set

    # Store separate lists of dictionaries
    USData = []
    for r in resultsUS: 
        USData.append({"rate": r[1], "year": r[0]})
    stateData = []
    for r in resultsState:
        stateData.append({"rate": r[2], "state": r[0], "year": r[1]})


    #################################################
    # GROUP BAR 
    #################################################
    resultsBirthRate1517 = session.query(National.year, National.us_rate).filter(National.age_group == "15-17 years").order_by(National.year.asc()).distinct()
    resultsBirthRate1819 = session.query(National.year, National.us_rate).filter(National.age_group == "18-19 years").order_by(National.year.asc()).distinct()
    # Use of distinct: https://stackoverflow.com/questions/48102501/remove-duplicates-from-sqlalchemy-query-using-set

    # Store separate lists of dictionaries
    birthRate1517 = []
    for r in resultsBirthRate1517: 
        birthRate1517.append({"rate": r[1], "year": r[0]})
    birthRate1819 = []
    for r in resultsBirthRate1819: 
        birthRate1819.append({"rate": r[1], "year": r[0]})
    

    #################################################
    # STATE_COUNTY_BAR_CHART 
    #################################################
    resultsNationalCSV = session.query(National.us_births, National.state_rate, National.age_group, National.year, National.us_rate, National.state_births, National.state, National.index).all()
    resultsCountyCSV = session.query(County.state_fips_code, County.state, County.index, County.upper_confidence_limit, County.birth_rate, County.county_fips_code, County.county, County.year, County.lower_confidence_limit, County.combined_fips_code).all()

    # Store separate lists of dictionaries
    nationalCSV = []
    for r in resultsNationalCSV: 
        nationalCSV.append({
            'us_births': r[0],
            'state_rate': r[1],
            'age_group': r[2],
            'year': r[3],
            'us_rate': r[4],
            'state_births': r[5],
            'state': r[6],
            'index': r[7]})
    countyCSV = []
    for r in resultsCountyCSV:
        countyCSV.append({
            'state_fips_code': r[0],
            'state': r[1],
            'index': r[2],
            'upper_confidence_limit': r[3],
            'birth_rate': r[4],
            'county_fips_code': r[5],
            'county': r[6],
            'year': r[7],
            'lower_confidence_limit': r[8],
            'combined_fips_code': r[9]})

    session.close()

    return render_template("dashboard.html", USData=USData, stateData=stateData, birthRate1517=birthRate1517, birthRate1819=birthRate1819, countyCSV=countyCSV, nationalCSV=nationalCSV)


@app.route("/line_chart")
def line_chart():
    session = Session(engine)

    # Query to return overall US data and state-specifc by year, filter to return 15-19 year data 
    resultsUS = session.query(National.year, National.us_rate).filter(National.age_group == "15-19 years").order_by(National.year.asc()).distinct()
    resultsState = session.query(National.state, National.year, National.state_rate).filter(National.age_group == "15-19 years").order_by(National.year.asc()).all()
    # Use of distinct: https://stackoverflow.com/questions/48102501/remove-duplicates-from-sqlalchemy-query-using-set

    # Store separate lists of dictionaries
    USData = []
    for r in resultsUS: 
        USData.append({"rate": r[1], "year": r[0]})
    stateData = []
    for r in resultsState:
        stateData.append({"rate": r[2], "state": r[0], "year": r[1]})
    
    session.close()

    return render_template("line_chart.html", USData=USData, stateData=stateData)


@app.route("/group_bar")
def group_bar():
    session = Session(engine)

    # Query for US birth rate and year, filtering for 15-17 and 18-19 year data 
    resultsBirthRate1517 = session.query(National.year, National.us_rate).filter(National.age_group == "15-17 years").order_by(National.year.asc()).distinct()
    resultsBirthRate1819 = session.query(National.year, National.us_rate).filter(National.age_group == "18-19 years").order_by(National.year.asc()).distinct()
    # Use of distinct: https://stackoverflow.com/questions/48102501/remove-duplicates-from-sqlalchemy-query-using-set

    # Store separate lists of dictionaries
    birthRate1517 = []
    for r in resultsBirthRate1517: 
        birthRate1517.append({"rate": r[1], "year": r[0]})
    birthRate1819 = []
    for r in resultsBirthRate1819: 
        birthRate1819.append({"rate": r[1], "year": r[0]})

    session.close()
    return render_template("group_bar.html", birthRate1517=birthRate1517, birthRate1819=birthRate1819)


@app.route("/state_county_bar_chart")
def state_county_bar():
    
    session = Session(engine)

    # Query to return entire datasets 
    resultsNationalCSV = session.query(National.us_births, National.state_rate, National.age_group, National.year, National.us_rate, National.state_births, National.state, National.index).all()
    resultsCountyCSV = session.query(County.state_fips_code, County.state, County.index, County.upper_confidence_limit, County.birth_rate, County.county_fips_code, County.county, County.year, County.lower_confidence_limit, County.combined_fips_code).all()

    # Store separate lists of dictionaries
    nationalCSV = []
    for r in resultsNationalCSV: 
        nationalCSV.append({
            'us_births': r[0],
            'state_rate': r[1],
            'age_group': r[2],
            'year': r[3],
            'us_rate': r[4],
            'state_births': r[5],
            'state': r[6],
            'index': r[7]})
    countyCSV = []
    for r in resultsCountyCSV:
        countyCSV.append({
            'state_fips_code': r[0],
            'state': r[1],
            'index': r[2],
            'upper_confidence_limit': r[3],
            'birth_rate': r[4],
            'county_fips_code': r[5],
            'county': r[6],
            'year': r[7],
            'lower_confidence_limit': r[8],
            'combined_fips_code': r[9]})
           
    session.close()
    return render_template("state_county_bar_chart.html", countyCSV=countyCSV, nationalCSV=nationalCSV)


@app.route("/geomap")
def geomap():
    
    return render_template("geomap.html")


# Comment this out when not in development
if __name__ == '__main__':
   app.run(debug=True)
