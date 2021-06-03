var clinic10URL = "../static/data/2010_clinics.json";
var clinic15URL = "../static/data/2015_clinics.json";
var county10URL = "../static/data/counties.geojson";
var county15URL = "../static/data/counties.geojson";

var promises = [];

promises.push(d3.json(clinic10URL));
promises.push(d3.json(clinic15URL));
promises.push(d3.json(county10URL));
promises.push(d3.json(county15URL));

Promise.all(promises).then(function (data) {
    console.log(data)

    var clinic2010 = data[0];
    var clinic2015 = data[1];
    var county10Info = data[2];
    var county15Info = data[3];

    var clinicAvail10 = {};
    var clinicAvail15 = {};

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
        scale: ["#ffffb2", "#b10026"],
        steps: 10,
        mode: "q",
        style: {
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup("<b>" + feature.properties.NAME + " County</b></br>" + "Publicly Funded Clinics: " +
                feature.properties.Pub_Fund_Clinics + "<br>Year: 2010<br>");
        }
    });

    var census2015;

    census2015 = L.choropleth(county15Info, {
        valueProperty: "Pub_Fund_Clinics",
        scale: ["#ffffb2", "#b10026"],
        steps: 10,
        mode: "q",
        style: {
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup("<b>" + feature.properties.NAME + " County</b></br>" + "Publicly Funded Clinics: " +
                feature.properties.Pub_Fund_Clinics + "<br>Year: 2015<br>");
        }
    });

    var myMap = L.map("map", {
        center: [39.8283, -98.5795],
        zoom: 5,
        layers: [
            census2010,
            census2015
        ]
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    var baseMaps = {
        "2010 Clinics": census2010,
        "2015 Clinics": census2015
      };

    L.control.layers(baseMaps, null).addTo(myMap);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var limits = census2015.options.limits;
        var colors = census2015.options.colors;
        var labels = [];

        // Add the minimum and maximum.
        var legendInfo = "<h1>Total Publicly Funded Clinics</h1>" +
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
    legend.addTo(myMap);
});
