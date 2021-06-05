// see data in console 
console.log(birthRate1517);
console.log(birthRate1819);

/* JSON structure
{rate: xx, year: xx}
*/

// Use an anon function to return only the birth rates for a specific age range variable
var rates1517 = birthRate1517.map(function(d) { return d.rate;});
var rates1819 = birthRate1819.map(function(d) { return d.rate;});

// Filter JSON to return only the years (could use either variable)
var years = birthRate1517.map(function(d) { return d.year;});

// Inserting data into Plotly chart 
var trace1 = {
  x: years,
  y: rates1819,
  name: 'Ages 18-19',
  type: 'bar',
  marker: {color:'#7f7f7f'}
};
console.log(trace1);

var trace2 = {
  x: years,
  y:rates1517,
  name: 'Ages 15-17',
  type: 'bar',
  marker: {color:'#17becf'}
};


var data = [trace1, trace2];

var layout = {barmode: 'group', title: 'US Teen Birth Rate by Age Group', yaxis: {title: "Birth Rate"}, xaxis: {title:"Years", tickmode :"linear"}};
Plotly.newPlot('plot', data, layout);

