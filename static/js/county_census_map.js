var clinic10URL = "../static/data/2010_clinics.json";
var countyURL = "../static/data/counties.geojson"

var promises = [];

promises.push(d3.json(clinic10URL));
promises.push(d3.json(countyURL));

Promise.all(promises).then(function (data) {
    console.log(data)

    var clinic2010 = data[0];
    var countyInfo = data[1];

    var countyGeom = {};
    var clinicAvail = {};

    clinic2010.data.forEach(function (clinicData) {
        let countyID = clinicData[1];
        let clinicVal = clinicData[2];
        clinicAvail[countyID] = +clinicVal;
    });

    countyInfo.features.forEach(function (countyID) {
        let clinicVal = clinicAvail[countyID.properties.COUNTY];
        countyID.properties['Pub_Fund_Clinics'] = clinicVal;
    });

    console.log(countyInfo);

    var myMap = L.map("map", {
        center: [39.8283, -98.5795],
        zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    var geojson;

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
            layer.bindPopup("County: " + feature.properties.NAME + "<br>Total Publicly Funded Clinics: <br>" +
                feature.properties.clinicVal +
                "<br>2010<br>");
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
