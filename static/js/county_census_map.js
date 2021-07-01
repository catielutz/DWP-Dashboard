var clinic10URL = "../static/data/2010_clinics.json";
var clinic15URL = "../static/data/2015_clinics.json";
var county10URL = "../static/data/counties.geojson";
var county15URL = "../static/data/counties.geojson";

var promises = [];

promises.push(d3.json(clinic10URL));
promises.push(d3.json(clinic15URL));
promises.push(d3.json(county10URL));
promises.push(d3.json(county15URL));
promises.push(county_populations); // Brought to JavaScript through app

Promise.all(promises).then(function (data) {
    console.log(data)
    
    var clinic2010 = data[0];
    var clinic2015 = data[1];
    var county10Info = data[2];
    var county15Info = data[3];
    //var county_populations = data[4]

    var clinicAvail10 = {};
    var clinicAvail15 = {};

    // Adding per capita info to clinic data: https://stackoverflow.com/questions/31831651/javascript-filter-array-multiple-conditions
    /*clinic2010.data.forEach(function (clinic10Data) {
        
        var popList = county_populations.filter((d) => toString(d.FIPS) == clinic10Data["FIPS"]);
        var population = +popList.population_2010;
        console.log(population);
        clinic10Data.properties['Population'] = +popList.population_2010;

    });*/
    
    // Check to see if information was added 
    console.log(clinic2010);

    // Adding FIPS to countyInfo
    county10Info.features.forEach(function (county10ID) {
        county10ID.properties['FIPS'] = county10ID.properties.STATE + county10ID.properties.COUNTY;
    });

    // Adding FIPS to countyInfo
    county15Info.features.forEach(function (county15ID) {
        county15ID.properties['FIPS'] = county15ID.properties.STATE + county15ID.properties.COUNTY;
    });

    // Creating dictionary of 2010 county information based on FIPS
    clinic2010.data.forEach(function (clinic10Data) {
        let county10ID = clinic10Data["FIPS"];
        let clinic10Val = clinic10Data["Pub_Fund_Clinics"];
        clinicAvail10[county10ID] = +clinic10Val;
    });

    // Using 2010 FIPS to grab number of clinics 
    county10Info.features.forEach(function (county10ID) {
        let clinic10Val = clinicAvail10[county10ID.properties.FIPS];
        county10ID.properties['Pub_Fund_Clinics'] = clinic10Val;
    });

    // Creating dictionary of 2015 county information based on FIPS
    clinic2015.data.forEach(function (clinic15Data) {
        let county15ID = clinic15Data["FIPS"];
        let clinic15Val = clinic15Data["Pub_Fund_Clinics"];
        clinicAvail15[county15ID] = +clinic15Val;
    });

    // Using 2015 FIPS to grab number of clinics 
    county15Info.features.forEach(function (county15ID) {
        let clinic15Val = clinicAvail15[county15ID.properties.FIPS];
        county15ID.properties['Pub_Fund_Clinics'] = +clinic15Val;
    });
    
    var census2010;

    census2010 = L.choropleth(county10Info, {
        valueProperty: "Pub_Fund_Clinics",
        scale: ["#FFEBEE", "#B71C1C"],
        steps: 15,
        mode: "q",
        style: {
        color: "#808080",
        weight: 0.25,
        fillOpacity: 0.8
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup("<b>" + feature.properties.NAME + " County</b></br>" + "Publicly Funded Clinics: " +
                feature.properties.Pub_Fund_Clinics + "<br>Year: 2010<br><a href='/calculator/" + feature.properties.FIPS + "'><button id='calc' type='button' class='btn btn-secondary'>Calculate</button></a>");
        }
    });

    var census2015;

    census2015 = L.choropleth(county15Info, {
        valueProperty: "Pub_Fund_Clinics",
        scale: ["#E8F6F3", "#004638"],
        steps: 15,
        mode: "q",
        style: {
        color: "#808080",
        weight: 0.25,
        fillOpacity: 0.8
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup("<b>" + feature.properties.NAME + " County</b></br>" + "Publicly Funded Clinics: " +
                feature.properties.Pub_Fund_Clinics + "<br>Year: 2015<br><a href='/calculator/" + feature.properties.FIPS + "'><button id='calc' type='button' class='btn btn-secondary'>Calculate</button></a>");
        }
    });

    var myMap = L.map("secondmap", {
        center: [39.8283, -98.5795],
        zoom: 3,
        layers: [
            census2010
        ]
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);


    var baseMaps = {
        "2010 Clinics": census2010,
        "2015 Clinics": census2015
    }

    L.control.layers(baseMaps, null, {
        collapsed: false
    }).addTo(myMap);

    var census2015Legend = L.control({ position: "bottomright" });
    census2015Legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var limits = census2015.options.limits;
        var colors = census2015.options.colors;
        var labels = [];

        // Add the minimum and maximum.
        var legendInfo = "<h1>Publicly Funded Clinics by County (2015)</h1>" +
            "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function (limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    var census2010Legend = L.control({ position: "bottomright" });
    census2010Legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var limits = census2010.options.limits;
        var colors = census2010.options.colors;
        var labels = [];

        // Add the minimum and maximum.
        var legendInfo = "<h1>Publicly Funded Clinics by County (2010)</h1>" +
            "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function (limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding the legend to the map
    census2010Legend.addTo(myMap);

    myMap.on("baselayerchange", function(activeLayer) {
        if(activeLayer.name == "2015 Clinics") {
            census2010Legend.remove();
            census2015Legend.addTo(myMap);
        }
        else {
            census2015Legend.remove();
            census2010Legend.addTo(myMap);
        }
    })
}); 
