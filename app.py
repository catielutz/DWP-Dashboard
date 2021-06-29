# Based off of model from activity 10.3.10
#import sqlite3
#import sqlalchemy
import numpy as np 
import pandas as pd

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, render_template, redirect, jsonify, json, request

# NOTE: Add to criteria for Heroku Deployment
import pickle 

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
Outcomes = Base.classes.outcomes

County2015 = Base.classes.clinic2015_county
County2010 = Base.classes.clinic2010_county

State2015 = Base.classes.clinic2015_state
State2010 = Base.classes.clinic2010_state

Countypop = Base.classes.county_pop
CountySVI = Base.classes.county_svi

#################################################
# Machine Learning Model Setup
#https://towardsdatascience.com/how-to-easily-deploy-machine-learning-models-using-flask-b95af8fe34d4
#https://www.geeksforgeeks.org/deploy-machine-learning-model-using-flask/
#################################################
model = pickle.load(open('model.pkl', 'rb'))

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

# Routes to render templates, using data from SQLite when needed 

@app.route("/")
def home():
    return redirect ("/dashboard")


@app.route("/aboutdata")
def aboutdata():
    
    return render_template("aboutdata.html")


@app.route("/aboutus")
def aboutus():
    
    return render_template("aboutus.html")


@app.route("/dashboard")
def dashboard():
    session = Session(engine)

    # This route will prepare most of the visualizations within the dashboard. 
    results = session.query(National.year, National.age_group, National.us_rate, 
                        National.state, National.state_rate).order_by(National.year.asc()).all()
    df = pd.DataFrame(results, columns=['year', 'age', 'usrate', 'state', 'staterate'])
    
    #################################################
    # LINE_CHART 
    #################################################
    # Organize df to return overall US data and state-specifc by year, filter to return 15-19 year data 
    linedf = df.loc[df["age"] == '15-19 years']

    # Store separate json dictionaries of data (US overall)
    USdatadf = linedf[['usrate', 'year']].drop_duplicates()
    USdatadf.reset_index(drop=True, inplace=True)
    USdatadf.rename(columns={"usrate": "rate"}, inplace=True)
    USData = USdatadf.to_json(orient="records")
    USData = json.loads(USData)
    
    # Store separate json dictionaries of data (by state)
    stateDatadf = linedf[['staterate', 'state', 'year']].drop_duplicates()
    stateDatadf.reset_index(drop=True, inplace=True)
    stateDatadf.rename(columns={'staterate': 'rate'}, inplace=True)
    stateData = stateDatadf.to_json(orient="records")
    stateData = json.loads(stateData)

    #################################################
    # GROUP BAR 
    #################################################
    # Query for US birth rate and year, filtering for 15-17 and 18-19 year data 
    df1517 = df.loc[df["age"] == '15-17 years', ['staterate', 'year', 'state']].drop_duplicates()
    df1819 = df.loc[df["age"] == '18-19 years', ['staterate', 'year', 'state']].drop_duplicates()
    df1517us = df.loc[df["age"] == '15-17 years', ['usrate', 'year']].drop_duplicates()
    df1819us = df.loc[df["age"] == '18-19 years', ['usrate', 'year']].drop_duplicates()

    # Store separate json dictionaries of data (by state)
    df1517.reset_index(drop=True, inplace=True)
    df1517.rename(columns={'staterate': 'rate'}, inplace=True)
    birthRate1517 = df1517.to_json(orient="records")
    birthRate1517 = json.loads(birthRate1517)

    df1819.reset_index(drop=True, inplace=True)
    df1819.rename(columns={'staterate': 'rate'}, inplace=True)
    birthRate1819 = df1819.to_json(orient="records")
    birthRate1819 = json.loads(birthRate1819)
    
    # Store separate json dictionaries of data (US overall)
    df1517us.reset_index(drop=True, inplace=True)
    df1517us.rename(columns={'usrate': 'rate'}, inplace=True)
    USBirthRate1517 = df1517us.to_json(orient="records")
    USBirthRate1517 = json.loads(USBirthRate1517)

    df1819us.reset_index(drop=True, inplace=True)
    df1819us.rename(columns={'usrate': 'rate'}, inplace=True)
    USBirthRate1819 = df1819us.to_json(orient="records")
    USBirthRate1819 = json.loads(USBirthRate1819)
    
    #################################################
    # STATE_COUNTY_BAR_CHART 
    #################################################

    # Using prior query to isolate information for bar chart, looking at state level
    states = df.loc[df["age"] == '15-19 years', ['staterate', 'year', 'state']].drop_duplicates()
    states.reset_index(drop=True, inplace=True)
    states.rename(columns={'staterate': 'state_rate'}, inplace=True)
    states = states.to_json(orient="records")
    states = json.loads(states)

    # Grabbing county rates
    resultsCounty = session.query(County.state, County.birth_rate, County.county, County.year).all()
    countydf = pd.DataFrame(resultsCounty, columns=['state', 'birth_rate', 'county', 'year'])
    counties = countydf.to_json(orient="records")
    counties = json.loads(counties)

    #################################################
    # COUNTY_CENSUS_MAP
    #################################################

    # Read in county population data for per capita calculations 
    county_populationsdf = pd.read_sql_query('SELECT * FROM county_pop', con=engine)
    county_populationsdf.set_index('index', inplace=True)
    county_populations = county_populationsdf.to_json(orient="records")
    county_populations = json.loads(county_populations)

    session.close()

    return render_template("dashboard.html", USData=USData, stateData=stateData, birthRate1517=birthRate1517, birthRate1819=birthRate1819, counties=counties, states=states, USBirthRate1517=USBirthRate1517, USBirthRate1819=USBirthRate1819, county_populations=county_populations)


@app.route("/calculator/<county>", methods=["GET"])
def calc(county):
    session = Session(engine)
    county_fips = county 

    # Run our SQLAlchemy to get the specific data for that county 
    join_query = session.query(County2015.fips, County2015.total_clinics, County2015.total_titleten, County2015.pp,\
                           County2015.dept_clinic, County2015.hospital, County2015.total_client_tt,\
                           County2015.pp_client, County2015.dept_clinic_tt, County2015.pp_tt,\
                           County2015.total_client, County2015.hospital_client, County.birth_rate,\
                           County.year, County.state, County.county)\
                    .join(County, County.combined_fips_code == County2015.fips)\
                    .filter(County.year=="2016")

    county_df = pd.DataFrame(join_query, columns=["FIPS", "total_clinics", "total_title10", "total_pp", "health_dept_clinics", 
                                              "hospitals","title_10_clients","pp_clients", "dept_clinic_title10","pp_tt",
                                              "total_clients","hospital_client","birth_rate", "year", "state", "county"])
    
    # Read in county population data for per capita calculations 
    county_populations = pd.read_sql_query('SELECT * FROM county_pop', con=engine)
    county_populations.set_index('index', inplace=True)

    # Merging this population data with the prior df 
    county_df = county_df.merge(county_populations, how='left', on=["state","county"])

    # Use Pandas read sql to grab the entire table into a df 
    county_SVI = pd.read_sql_query('SELECT * FROM county_svi', con=engine)
    county_SVI.set_index('index', inplace=True)
    county_SVI=county_SVI.drop(columns=["state","county"])

    # Merging this SVI data with the first df 
    county_df=county_df.merge(county_SVI, how='left', on="FIPS")

    # Transforming data to a per capita basis
    county_df["clinics_per_capita"] = county_df["total_clinics"]/county_df["population_2015"]
    county_df["title10_clinics_per_capita"] = county_df["total_title10"]/county_df["population_2015"]
    county_df["pp_per_capita"] = county_df["total_pp"]/county_df["population_2015"]
    county_df["health_dept_per_capita"] = county_df['health_dept_clinics']/county_df["population_2015"]
    county_df["hospitals_per_capita"] = county_df['hospitals']/county_df["population_2015"]
    county_df["title_10_clients_per_capita"] = county_df["title_10_clients"]/county_df["population_2015"]
    county_df["pp_clients_per_capita"] = county_df['pp_clients']/county_df["population_2015"]
    county_df["dept_clinic_title10_per_capita"] = county_df['dept_clinic_title10']/county_df["population_2015"]
    
    # Grabbing all the data for that county to populate the calculator
    calculator_prefill = county_df.loc[county_df["FIPS"] == int(county_fips), ['FIPS','birth_rate','clinics_per_capita','title10_clinics_per_capita', 'pp_per_capita', 
        'health_dept_per_capita', 'hospitals_per_capita', 'title_10_clients_per_capita','pp_clients_per_capita', 
        'dept_clinic_title10_per_capita','percent_uninsured','SVI_sum_of_indicators']]
    calculator_prefill = calculator_prefill.round(decimals=7)
    
    # Make into an array for our Jinja 
    prefill_values=calculator_prefill.values
    values=prefill_values[0]
    
    return render_template('machinelearning.html', values=values)
 

@app.route("/predict",methods=['POST']) # Post sends data to the server and returns it
def predict():

    float_features = [float(x) for x in request.form.values()]
    final_features = [np.array(float_features)]
    prediction_raw = model.predict(final_features)
    prediction = prediction_raw[0]
    prediction = round(prediction, 0)
    
    return render_template('machinelearning.html', values=final_features, prediction_text="  The teen birth rate would be {} per 1,000.".format(prediction))


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
    resultsBirthRate1517 = session.query(National.year, National.state_rate, National.state).filter(National.age_group == "15-17 years").order_by(National.year.asc()).distinct()
    resultsBirthRate1819 = session.query(National.year, National.state_rate, National.state).filter(National.age_group == "18-19 years").order_by(National.year.asc()).distinct()
    resultsUSBirthRate1517 = session.query(National.year, National.us_rate).filter(National.age_group == "15-17 years").order_by(National.year.asc()).distinct()
    resultsUSBirthRate1819 = session.query(National.year, National.us_rate).filter(National.age_group == "18-19 years").order_by(National.year.asc()).distinct()
    # Use of distinct: https://stackoverflow.com/questions/48102501/remove-duplicates-from-sqlalchemy-query-using-set

    # Store separate lists of dictionaries
    birthRate1517 = []
    for r in resultsBirthRate1517: 
        birthRate1517.append({"rate": r[1], "year": r[0], "state":r[2]})
    birthRate1819 = []
    for r in resultsBirthRate1819: 
        birthRate1819.append({"rate": r[1], "year": r[0], "state":r[2]})
    
    # Overal US dictionary 
    USBirthRate1517  = []
    for r in resultsUSBirthRate1517: 
        USBirthRate1517.append({"rate": r[1], "year": r[0]})
    USBirthRate1819  = []
    for r in resultsUSBirthRate1819: 
        USBirthRate1819.append({"rate": r[1], "year": r[0]})
    
    session.close()
    return render_template("group_bar.html", birthRate1517=birthRate1517, birthRate1819=birthRate1819, USBirthRate1517=USBirthRate1517, USBirthRate1819=USBirthRate1819)


@app.route("/state_county_bar_chart")
def state_county_bar():
    
    session = Session(engine)

    # Query for state-level birth rate information 
    results = session.query(National.year, National.age_group, National.state, National.state_rate).order_by(National.year.asc()).all()
    df = pd.DataFrame(results, columns=['year', 'age', 'state', 'state_rate'])
    
    states = df.loc[df["age"] == '15-19 years', ['state_rate', 'year', 'state']].drop_duplicates()
    states.reset_index(drop=True, inplace=True)
    states = states.to_json(orient="records")
    states = json.loads(states)

    # Grabbing county rates
    resultsCounty = session.query(County.state, County.birth_rate, County.county, County.year).all()
    countydf = pd.DataFrame(resultsCounty, columns=['state', 'birth_rate', 'county', 'year'])
    counties = countydf.to_json(orient="records")
    counties = json.loads(counties)
           
    session.close()
    return render_template("state_county_bar_chart.html", counties=counties, states=states)


@app.route("/geomap")
def geomap():
    
    return render_template("geomap.html")


@app.route("/county_census_map")
def countymap():

    # Read in county population data for per capita calculations 
    county_populationsdf = pd.read_sql_query('SELECT * FROM county_pop', con=engine)
    county_populationsdf.set_index('index', inplace=True)
    county_populations = county_populationsdf.to_json(orient="records")
    county_populations = json.loads(county_populations)
    
    return render_template("county_census_map.html", county_populations=county_populations)

# Comment this out when not in development
#if __name__ == '__main__':
    #app.run(debug=True)
