
  var teenBirthUrl = "../static/data/teenBirth.json";
  var stateUrl = "../static/data/state.geojson";
  var countyUrl = "../static/data/counties.geojson";

  var promises = [];
  
  promises.push(d3.json(teenBirthUrl));
  promises.push(d3.json(stateUrl));
  promises.push(d3.json(countyUrl));
  
  Promise.all(promises).then(function(data) {
    //console.log(data)
    var teenBirth = data[0];
    var stateInfo = data[1];
    var countyInfo = data[2];

  // Adding FIPS to countyInfo 
  countyInfo.features.forEach(function (countyInfo) {
    countyInfo.properties['FIPS'] = countyInfo.properties.STATE + countyInfo.properties.COUNTY;
  });
  
    // Create birthRate dictionary to store birthRateVal from teenBirth
  // Use dictionary to update geojson data
    var birthRate = {};

    teenBirth.data.forEach(function(birthData) {
      let stateID = birthData[11];
      let FIPS = birthData[11] + birthData[12];
      let birthRateVal = birthData[14];
      
      birthRate[stateID] = parseFloat(birthRateVal);
      birthRate[FIPS] = parseFloat(birthRateVal);
    });

    stateInfo.features.forEach(function(stateID){
      let birthRateVal = birthRate[stateID.properties.STATE];
      stateID.properties['birthRateVal'] = birthRateVal;
    });

    countyInfo.features.forEach(function(county){
      let FIPS = county.properties.STATE + county.properties.COUNTY;
      let birthRateVal = birthRate[FIPS];
      county.properties['birthRateVal'] = birthRateVal;
    });
     
    console.log(stateInfo);
    console.log(countyInfo);

    var STATE;

    STATE = L.choropleth(stateInfo, {
      valueProperty: "birthRateVal",
      scale: ["#AAEFCF", "#8AE7CD", "#6ADFD4", "#4BC8D5", "#2D9FCB", "#106EC0", "#0C41B1", "#0819A2"],
      steps: 10,
      mode:"q",
      style:{
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },
    
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<b>" + feature.properties.NAME + "</br></b>Teen Birth Rate<br>" +
          feature.properties.birthRateVal + " per 1,000 " +
          "<br>Years: 2003-2018<br>");
      }
    });

    var COUNTY;

    COUNTY = L.choropleth(countyInfo, {
      valueProperty: "birthRateVal",
      scale: ["#D9E2F2", "#CAD0EC", "#BBBBE6", "#B6ADE0", "#B49FD9", "#B591D2", "#B183C0", "#AC74AD", "#9A6690", "#875974"],
      steps: 10,
      mode:"q",
      style:{
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },

      onEachFeature: function(feature, layer) {
        layer.bindPopup("<b>" + feature.properties.NAME + " County</b></br>" +"Teen Birth Rate<br>" +
          feature.properties.birthRateVal + " per 1,000 " +
          "<br>2003-2018<br><br><a href='/calculator/" + feature.properties.FIPS + "'><button>Calculate</button></a>");
      }
    });

    var myMap = L.map("map", {
      center: [39.8283, -98.5795],
      zoom: 5,
      layers: [
        STATE,
      ]
    });
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    var baseMaps = {
      "STATE": STATE,
      "COUNTY": COUNTY
    };

    L.control.layers(baseMaps, null).addTo(myMap);

    var stateBirthRateLegend = L.control({ position: "bottomright" });
    stateBirthRateLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = STATE.options.limits;
    var colors = STATE.options.colors;
    var labels = [];

    // Add the minimum and maximum.
    var legendInfo = "<h1>State Teen Birth Rate</h1>" +
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

  var countyBirthRateLegend = L.control({ position: "bottomright" });
  countyBirthRateLegend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = COUNTY.options.limits;
  var colors = COUNTY.options.colors;
  var labels = [];

  // Add the minimum and maximum.
  var legendInfo = "<h1>County Teen Birth Rate</h1>" +
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
  stateBirthRateLegend.addTo(myMap);

  myMap.on("baselayerchange", function(activeLayer) {
    if(activeLayer.name == 'COUNTY') {
      stateBirthRateLegend.remove();
      countyBirthRateLegend.addTo(myMap);
    }
    else {
      countyBirthRateLegend.remove();
      stateBirthRateLegend.addTo(myMap);
    }
  });
 });
  