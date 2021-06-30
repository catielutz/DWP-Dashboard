// see data in console 
//console.log(birthRate1517);
//console.log(birthRate1819);
//console.log(USBirthRate1517);
//console.log(USBirthRate1819);

/* JSON structure
{rate: xx, year: xx}
*/

// Use an anon function to return only the birth rates for a specific age range variable

// Filter JSON to return only the years (could use either variable)

// function unpack(rows, index) {
//   return rows.map(function(row) {
//     return row[index];
//   });
// }

window.onload = function() {
  var state = 'United States';
  buildPlot(state);
};

// Submit Button handler
function handleSubmit() {
   // Prevent the page from refreshing
   d3.event.preventDefault();

  // Select the input value from the form
  var state = d3.select("#stateInput").node().value;
 
  // clear the input value
  d3.select("#stateInput").node().value = "";

  // Build the plot with the new stock
  buildPlot(state);
}

// Inserting data into Plotly chart 
function buildPlot(state) {

  if (state == 'United States') {

    var finalrates1517 = USBirthRate1517.map(function(d) { return d.rate;});
    var finalrates1819 = USBirthRate1819.map(function(d) { return d.rate;});
    var years = USBirthRate1517.map(function(d) { return d.year;});

    console.log(state)

  } else {

    var rates1517 = birthRate1517.filter((d) => d.state == state);
    var rates1819 = birthRate1819.filter((d) => d.state == state);
  
    var finalrates1517 = rates1517.map(function(d) { return d.rate;});
    var finalrates1819 = rates1819.map(function(d) { return d.rate;});
    var years = rates1517.map(function(d) { return d.year;});

    console.log(state)
  };

  var trace1 = {
    x: years,
    y: finalrates1819,
    name: 'Ages 18-19',
    type: 'bar',
    marker: {color:'#7f7f7f'}
  };

  var trace2 = {
    x: years,
    y: finalrates1517,
    name: 'Ages 15-17',
    type: 'bar',
    marker: {color:'#17becf'}
  };

  var data = [trace1, trace2];

  var config = {responsive: true}

  var layout = {barmode: 'group', title: {text:'Teen Birth Rate by Age Range (2003-2018)', font: {family: 'Arial, monospace', size: 15}}, yaxis: {title: "Birth Rate per 1,000"}, xaxis: {title:"", tickmode :"linear"}};
  Plotly.newPlot('plot', data, layout, config);
}
d3.select("#submit").on("click", handleSubmit);
