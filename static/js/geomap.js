
  var teenBirthUrl = "../static/data/teenBirth.json";
  var stateUrl = "../static/data/state.geojson"

  var promises = [];
  
  promises.push(d3.json(teenBirthUrl));
  promises.push(d3.json(stateUrl));
  
  Promise.all(promises).then(function(data) {
    //console.log(data)
    var teenBirth = data[0];
    var stateInfo = data[1];
  
    var stateGeom = {};
    var birthRate = {};
    
    teenBirth.data.forEach(function(birthData) {
      let stateID = birthData[11];
      let birthRateVal = birthData[14]
      birthRate[stateID] = parseFloat(birthRateVal);
    });

    stateInfo.features.forEach(function(stateID){
      let birthRateVal = birthRate[stateID.properties.STATE];
      stateID.properties['birthRateVal'] = birthRateVal;
    });
     
    console.log(stateInfo);
    
    var myMap = L.map("map", {
      center: [39.8283, -98.5795],
      zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    var geojson;

    geojson = L.choropleth(stateInfo, {
      valueProperty: "birthRateVal",
      scale: ["#ffffb2", "#b10026"],
      steps: 10,
      mode:"q",
      style:{
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },
    
      onEachFeature: function(feature, layer) {
        layer.bindPopup("State: " + feature.properties.NAME + "<br>Teen Birth Rate<br>" +
          feature.properties.birthRateVal + "%" +
          "<br>2003-2018<br>");
      }
    }).addTo(myMap);

    var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add the minimum and maximum.
    var legendInfo = "<h1>Teen Birth Rate</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);
 });
  