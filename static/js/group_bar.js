// see data in console 
console.log(birthRate1517);
console.log(birthRate1819);

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


// var USBirthRate15171 = USBirthRate1517.map(function(d) { return d.rate;});
// var USBirthRate18191 = USBirthRate1819.map(function(d) { return d.rate;});

// Filter JSON to return only the years (could use either variable)
// var years1 = USBirthRate15171.map(function(d) { return d.year;});

// Inserting data into Plotly chart 
// var trace1 = {
//   x: years1,
//   y: USBirthRate18191,
//   name: 'Ages 18-19',
//   type: 'bar',
//   marker: {color:'#7f7f7f'}
// };
// console.log(trace1);

// var trace2 = {
//   x: years1,
//   y:USBirthRate15171,
//   name: 'Ages 15-17',
//   type: 'bar',
//   marker: {color:'#17becf'}
// };


// var data = [trace1, trace2];

// var layout = {barmode: 'group', title: 'US Teen Birth Rate by Age Group', yaxis: {title: "Birth Rate"}, xaxis: {title:"Years", tickmode :"linear"}};
// Plotly.newPlot('plot1', data, layout);

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
  var rates1517 = birthRate1517.filter((d) => d.state == state);
  var rates1819 = birthRate1819.filter((d) => d.state == state);

  console.log(rates1517)
  console.log(rates1819)

  
  var staterates1517 = rates1517.map(function(d) { return d.rate;});
  var staterates1819 = rates1819.map(function(d) { return d.rate;});
  var years = rates1517.map(function(d) { return d.year;});
 


  var trace1 = {
    x: years,
    y: staterates1819,
    name: 'Ages 18-19',
    type: 'bar',
    marker: {color:'#7f7f7f'}
  };


  var trace2 = {
    x: years,
    y:staterates1517,
    name: 'Ages 15-17',
    type: 'bar',
    marker: {color:'#17becf'}
  };


  var data = [trace1, trace2];

  var layout = {barmode: 'group', title: ' Teen Birth Rate Age Group By State', yaxis: {title: "Birth Rate"}, xaxis: {title:"Years", tickmode :"linear"}};
  Plotly.newPlot('plot', data, layout);

}
d3.select("#submit").on("click", handleSubmit);