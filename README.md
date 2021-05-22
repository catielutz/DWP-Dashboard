# Final Project
Team members: Tori Arriola, Yifei Cao, Kylee Grant, Leah Handel, Sana Jessani, Catie Lutz, and Rana Saber

# Project Requirements
1. Machine Learning (Scikit-Learn)
2. At least two of the following: 
     
     - Python Pandas 
     - Python Matplotlib
     - HTML/CSS/Bootstrap
     - JavaScript Plotly 
     - JavaScript D3
     - JavaScript Leaflet
     - SQL Database
     - MongoDB Database
     - Google Cloud SQL
     - Amazon AWS
     - Tableau

# Inspiration and Guiding Questions


# Dataset Overview



## [Teen Birth Rates for Age Group 15-19 in the United States by County (CSV):](https://catalog.data.gov/dataset/nchs-teen-birth-rates-for-age-group-15-19-in-the-united-states-by-county)
This dataset details estimated birth rates, expressed per 1,000 females aged 15–19, for 3,137 U.S. counties. This data spans 2003 to 2018 and largely is sourced from the National Vital Statistics System birth data files. For further information, please see the documentation at the link above. 

### Metadata: 
     {
     @type: "dcat:Dataset",
     accessLevel: "public",
     bureauCode: [
     "009:00"
     ],
     contactPoint: {
     @type: "vcard:Contact",
     fn: "National Center for Health Statistics",
     hasEmail: "mailto:cdcinfo@cdc.gov"
     },
     description: "This data set contains estimated teen birth rates for age group 15–19 (expressed per 1,000 females aged 15–19) by county and year. DEFINITIONS Estimated teen birth rate: Model-based estimates of teen birth rates for age group 15–19 (expressed per 1,000 females aged 15–19) for a specific county and year. Estimated county teen birth rates were obtained using the methods described elsewhere (1,2,3,4). These annual county-level teen birth estimates “borrow strength” across counties and years to generate accurate estimates where data are sparse due to small population size (1,2,3,4). The inferential method uses information—including the estimated teen birth rates from neighboring counties across years and the associated explanatory variables—to provide a stable estimate of the county teen birth rate. Median teen birth rate: The middle value of the estimated teen birth rates for the age group 15–19 for counties in a state. Bayesian credible intervals: A range of values within which there is a 95% probability that the actual teen birth rate will fall, based on the observed teen births data and the model. NOTES Data on the number of live births for women aged 15–19 years were extracted from the National Center for Health Statistics’ (NCHS) National Vital Statistics System birth data files for 2003–2015 (5). Population estimates were extracted from the files containing intercensal and postcensal bridged-race population estimates provided by NCHS. For each year, the July population estimates were used, with the exception of the year of the decennial census, 2010, for which the April estimates were used. Hierarchical Bayesian space–time models were used to generate hierarchical Bayesian estimates of county teen birth rates for each year during 2003–2015 (1,2,3,4). The Bayesian analogue of the frequentist confidence interval is defined as the Bayesian credible interval. A 100*(1-α)% Bayesian credible interval for an unknown parameter vector θ and observed data vector y is a subset C of parameter space Ф such that 1-α≤P({C│y})=∫p{θ │y}dθ, where integration is performed over the set and is replaced by summation for discrete components of θ. The probability that θ lies in C given the observed data y is at least (1- α) (6). County borders in Alaska changed, and new counties were formed and others were merged, during 2003–2015. These changes were reflected in the population files but not in the natality files. For this reason, two counties in Alaska were collapsed so that the birth and population counts were comparable. Additionally, Kalawao County, a remote island county in Hawaii, recorded no births, and census estimates indicated a denominator of 0 (i.e., no females between the ages of 15 and 19 years residing in the county from 2003 through 2015). For this reason, Kalawao County was removed from the analysis. Also , Bedford City, Virginia, was added to Bedford County in 2015 and no longer appears in the mortality file in 2015. For consistency, Bedford City was merged with Bedford County, Virginia, for the entire 2003–2015 period. Final analysis was conducted on 3,137 counties for each year from 2003 through 2015. County boundaries are consistent with the vintage 2005–2007 bridged-race population file geographies (7). SOURCES National Center for Health Statistics. Vital statistics data available online, Natality all-county files. Hyattsville, MD. Published annually. For details about file release and access policy, see NCHS data release and access policy for micro-data and compressed vital statistics files, available from: http://www.cdc.gov/nchs/nvss/dvs_data_release.htm. For natality public-use files, see vital statistics data available online, available from: https://www.cdc.gov/nchs/data_access/vitalstatsonline.htm. National Center for Health Statistics. U.S. Census populations with bridged race categories. Estimated population data available. Postcensal and intercensal files. Hyattsville, MD",
     distribution: [
     {
     @type: "dcat:Distribution",
     downloadURL: "https://data.cdc.gov/api/views/3h58-x6cd/rows.csv?accessType=DOWNLOAD",
     mediaType: "text/csv"
     },
     {
     @type: "dcat:Distribution",
     downloadURL: "https://data.cdc.gov/api/views/3h58-x6cd/rows.rdf?accessType=DOWNLOAD",
     mediaType: "application/rdf+xml"
     },
     {
     @type: "dcat:Distribution",
     downloadURL: "https://data.cdc.gov/api/views/3h58-x6cd/rows.json?accessType=DOWNLOAD",
     mediaType: "application/json"
     },
     {
     @type: "dcat:Distribution",
     downloadURL: "https://data.cdc.gov/api/views/3h58-x6cd/rows.xml?accessType=DOWNLOAD",
     mediaType: "application/xml"
     }
     ],
     identifier: "https://data.cdc.gov/api/views/3h58-x6cd",
     issued: "2020-01-27",
     keyword: [
     "county teen birth trends",
     "county trends on teen births",
     "nchs",
     "teen births",
     "united states",
     "u.s. teen birth rate"
     ],
     landingPage: "https://data.cdc.gov/d/3h58-x6cd",
     license: "https://www.usa.gov/government-works",
     modified: "2020-06-05",
     programCode: [
     "009:020"
     ],
     publisher: {
     @type: "org:Organization",
     name: "Centers for Disease Control and Prevention"
     },
     theme: [
     "NCHS"
     ],
     title: "NCHS - Teen Birth Rates for Age Group 15-19 in the United States by County"
     }

## [U.S. and State Trends on Teen Births (CSV, JSON):](https://catalog.data.gov/dataset/nchs-u-s-and-state-trends-on-teen-births)
This dataset assembles all final birth data for females aged 15–19, 15–17, and 18–19 for the United States and each of the 50 states, expressed per 1,000 females in each age range. This data spans 1990–2018 and is based on 100% of birth certificates filed in 50 states. 

### Metadata: 
     {
     @type: "dcat:Dataset",
     accessLevel: "public",
     bureauCode: [
     "009:00"
     ],
     contactPoint: {
     @type: "vcard:Contact",
     fn: "National Center for Health Statistics",
     hasEmail: "mailto:cdcinfo@cdc.gov"
     },
     description: "This dataset assembles all final birth data for females aged 15–19, 15–17, and 18–19 for the United States and each of the 50 states. Data are based on 100% of birth certificates filed in all 50 states. All the teen birth rates in this dashboard reflect the latest revisions to Census populations (i.e., the intercensal populations) and thus provide a consistent series of accurate rates for the past 25 years. The denominators of the teen birth rates for 1991–1999 have been revised to incorporate the results of the 2000 Census. The denominators of the teen birth rates for 2001–2009 have revised to incorporate the results of the 2010 Census.",
     distribution: [
     {
     @type: "dcat:Distribution",
     downloadURL: "https://data.cdc.gov/api/views/y268-sna3/rows.csv?accessType=DOWNLOAD",
     mediaType: "text/csv"
     },
     {
     @type: "dcat:Distribution",
     downloadURL: "https://data.cdc.gov/api/views/y268-sna3/rows.rdf?accessType=DOWNLOAD",
     mediaType: "application/rdf+xml"
     },
     {
     @type: "dcat:Distribution",
     downloadURL: "https://data.cdc.gov/api/views/y268-sna3/rows.json?accessType=DOWNLOAD",
     mediaType: "application/json"
     },
     {
     @type: "dcat:Distribution",
     downloadURL: "https://data.cdc.gov/api/views/y268-sna3/rows.xml?accessType=DOWNLOAD",
     mediaType: "application/xml"
     }
     ],
     identifier: "https://data.cdc.gov/api/views/y268-sna3",
     issued: "2018-07-09",
     keyword: [
     "nchs",
     "state teen birth trends",
     "teen births",
     "united states",
     "u.s. and state trends on teen births",
     "u.s. teen birth rate"
     ],
     landingPage: "https://data.cdc.gov/d/y268-sna3",
     license: "http://opendefinition.org/licenses/odc-odbl/",
     modified: "2020-06-05",
     programCode: [
     "009:020"
     ],
     publisher: {
     @type: "org:Organization",
     name: "Centers for Disease Control and Prevention"
     },
     theme: [
     "NCHS"
     ],
     title: "NCHS - U.S. and State Trends on Teen Births"
     }

## [US Census: Cartographic Boundary Files (GeoJSON):](https://eric.clst.org/tech/usgeojson/)
For this project, we referenced the work of Eric Celeste, who has taken the United States Census Cartographic Boundary Files and converted them to GeoJSON using the MyGeoData vector converter. 


# Data Cleaning and Storage


# Software, Languages, and Libraries

- Chart.js 
- CSS
- D3.js 
- DB Browser for SQLite
- Heroku 
- HTML
- Leaflet.js
- Pandas 
- Plotly
- SQLAlchemy
- SQLite


# Dashboard 

### [DWP's Dashboard](https://project-2-dwp.herokuapp.com/)

## Deployment


# Final Visualizations 


# Further Questions and Research 
If time allowed, our team would have liked to address the following questions: 
