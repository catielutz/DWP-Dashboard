var clinic10URL = "../static/data/2010_clinics.json";
var countyURL = "../static/data/counties.geojson"

var promises = [];

promises.push(d3.json(clinic10URL));
promises.push(d3.json(countyURL));

Promise.all(promises).then(function(data) {
    console.log(data)

    var clinic2010 = data[0];
    var countyInfo = data[1];

    var countyGeom = {};
    var clinicAvail = {};

    // Adding FIPS to countyInfo
    countyInfo.features.forEach(function (countyID) {
        countyID.properties['FIPS'] = countyID.properties.STATE+countyID.properties.COUNTY;
    });

    // Creating dictionary of county information based on FIPS
    clinic2010.data.forEach(function (clinicData) {
        let countyID = clinicData["FIPS"];
        let clinicVal = clinicData["Pub_Fund_Clinics"];
        clinicAvail[countyID] = +clinicVal;
    });

    // Using FIPS to grab number of clinics 
    countyInfo.features.forEach(function (countyID) {
        let clinicVal = clinicAvail[countyID.properties.FIPS];
        countyID.properties['Pub_Fund_Clinics'] = clinicVal;
    });

    var myMap = L.map("map", {
        center: [39.8283, -98.5795],
        zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    var geojson;

    console.log(countyInfo); 

    geojson = L.choropleth(countyInfo, {
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
    }).addTo(myMap);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson.options.limits;
        var colors = geojson.options.colors;
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
