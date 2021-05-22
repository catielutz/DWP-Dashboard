// bonus chart.js plugin for datalabels

Chart.plugins.register(ChartDataLabels);

// see data in console 
console.log(USData)
console.log(stateData)

// // Example of how to filter for a specific state 
// var stateSpecifc = stateData.filter((d) => d.state == "Alabama");
// console.log(stateSpecifc)

// // Example of how to filter to return only specific key values, here only returning the rates for US
// var USRates = USData.map(function(d) { return d.rate;});

// background set up
var years = [];

for (var i=2003;i<=2018;i++) {
  years.push(i);
}

var colors = ["#648FFF","#785EF0", "#DC267F", "#FE6100", "#FFB000"]; // to update with colors from actual site
var displays = [[false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false]]


var stateList = [...new Set(stateData.map(d=>d.state))];

stateLineData = {}

stateList.forEach(function(state) {
  var allYears = stateData.filter((d) => d.state == state);
  var sortedYears = allYears.sort(function(a, b) {
    return a.year - b.year;
  });
  var dataArray = sortedYears.map(d=>d.rate);
  stateLineData[state] = dataArray;
});


// function to create a new dataset for the chart
var colorIndex = 0;
var displayIndex = 1;

function makeLine (state) {
  var line = {}
  line.label = state;
  line.backgroundColor = "rgba(0, 0, 0, 0)";
  line.borderColor = colors[colorIndex%5];
  line.pointBackgroundColor = colors[colorIndex%5];
  line.data = stateLineData[state];
  var datalabels = {}
  datalabels.color = colors[colorIndex%5];
  datalabels.borderColor = colors[colorIndex%5];
  datalabels.backgroundColor = "white";
  datalabels.display = displays[displayIndex%3];
  line.datalabels = datalabels;
  colorIndex++;
  displayIndex++;
  return line;
}


// sample data entry to be replaced by api call to flask app
var US = USData.map(d=>d.rate);

// chart set up with just US totals

var datasets = [{
  label: 'US',
  backgroundColor: "rgba(0, 0, 0, 0)",
  borderColor: "#A8A4A4",
  pointBackgroundColor: "#A8A4A4",
  data: US,
  datalabels: {
    color: "#A8A4A4",
    borderColor: "#A8A4A4",
    backgroundColor: "white",
    display: displays[0]
  }
}];

var data = {
   labels: years,
   datasets: datasets
};

// chart config


const configLine = {
  type: 'line',
  data: data,
  options: {   
    title: {
      display: true,
      text: `Teen Birthrate by State vs. US Total, 2003 - 2018`
    },       
    plugins: {
    legend: false,
    datalabels: {
        // color: function(context) {
        //     var colorIndex = context.dataIndex-1;
        //     return dataset.backgroundColor},
        font: {
          weight: 'bold'
        },
        formatter: function(value, context) {
            return [context.dataset.label];
          },
        textAlign: "center",
        // display: function(context) {
        //   var index = context.dataIndex;
        //   if (index == 3) {return true;}
        //   else {return false;}
        // },
        align: "top",
        anchor: "center",
        clip: false,
        borderWidth: 2,
        borderRadius: 4,

      }
},
    animations: {
      y: {
        easing: 'easeInOutElastic',
        from: (ctx) => {
          if (ctx.type === 'data') {
            if (ctx.mode === 'default' && !ctx.dropped) {
              ctx.dropped = true;
              return 0;
              }
            }
          }
        },
      update: {
        duration: 0
        }
      },
    },
  };


// render chart

  var ctx = document.getElementById('myChart');

  var myChart = new Chart(ctx, configLine);



d3.select("#add_state").on("click", function(){
  var selection = d3.select("#state_input").property("value");
  console.log(selection);
  var newLine = makeLine(selection, 2);
  myChart.data.datasets.push(newLine);
  myChart.update();
});


d3.select("#clear").on("click", function() {
  console.log("clicked button");
  myChart.data.datasets = [{
    label: 'US',
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: '#A8A4A4',
    color: '#A8A4A4',
    data: US,
    datalabels: {
      color: "#A8A4A4",
      borderColor: "#A8A4A4",
      backgroundColor: "white",
      display: displays[0]
    }
  }];
  myChart.update();
});


// notes  

// html: chart will fill its space, have to wrap it in something with a set size
// row + column works to contain it and still be responsive

// data input: currently set up with object of arrays for each state with birthrates for 2003-2018

// animation/interactions: adding datasets similar to this example: https://www.chartjs.org/docs/latest/samples/animations/drop.html

// more on chart.js handling clicking, mouseover, etc: https://www.chartjs.org/docs/latest/configuration/interactions.html



