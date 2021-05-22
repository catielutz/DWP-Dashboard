// see data in console 
console.log(countyCSV)
console.log(nationalCSV)

// bonus chart.js plugin for datalabels

Chart.plugins.register(ChartDataLabels);


    var states = nationalCSV;

    states = states.filter(d=>d["age_group"] == "15-19 years");

    // organizing data for states graph: creating an array of objects, one object per state plus the total US. 
    // objects have name, change, bar color. 
    // data note: using name instead of state/county allows the code to borrow illinois from this array for the counties array below

    var stateStarts = states.filter(d =>d.year == 2003);
    var stateStops = states.filter(d=>d.year == 2018);

    //https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates

    stateList = [...new Set(states.map(d=>d.state))];

    stateChanges = [];

    stateList.forEach(function(state) {
        var start = stateStarts.filter(d=>d.state == state)[0]["state_rate"];
        var stop = stateStops.filter(d=>d.state == state)[0]["state_rate"];
        var change = stop-start;
        var newObject = {
            name: state,
            change: change,
            color: "#66d166",

        };
        stateChanges.push(newObject);
    });

    // sorting the array from highest to lowest -- https://stackoverflow.com/questions/52785769/how-can-i-sort-data-from-highest-to-lowest-in-chart-js

    sortedStateChanges = stateChanges.sort(function(a, b) {
        return b.change - a.change;
      });

    // choosing top and bottom three states and the US total

    var selection = [sortedStateChanges[0], sortedStateChanges[1],sortedStateChanges[2],sortedStateChanges.filter(d=>d.name == "Total U.S.")[0],sortedStateChanges[49],sortedStateChanges[50],sortedStateChanges[51]];

    // set up

    var stateChartData = {
        labels: selection.map(d=>d.name),
        datasets: [
          {
            label: "birth rate",
            data: selection.map(d=>d.change),
            borderColor: "#52a7a7",
            backgroundColor: "#52a7a7",
            datalabels: {
              align: 'start',
                anchor: 'start'
              }
          }
        ]
      };

      var originalStateChartData = stateChartData;
      // config

      var configStates = {
        type: 'bar',
        data: stateChartData,
        options: {
          tooltips: false,
          borderColor: "#52a7a7",
          backgroundColor: "#52a7a7",
          responsive: true,
          plugins: {
            legend: false,
            datalabels: {
                color: "black",
                font: {
                  weight: 'bold'
                },
                formatter: function(value, context) {
                    return [context.chart.data.labels[context.dataIndex] + ': ',Math.round(value) + '%'];
                  },
                textAlign: "center"
              }
        },
        title: {
            display: true,
            text: 'States with the highest and lowest change in teen birthrate vs. the US, 2003 - 2018'
          },
          scales: {
            xAxes: [{
                display: false,
                type: "category",
                position: {y: 5},
                grid: {
                    color: "rgba(0, 0, 0, 0)"
                }
            }]
        }
        },
      };

    //render chart

    var ctx = document.getElementById('stateChart');

    var stateChart = new Chart(ctx, configStates);


    //////////// now doing it for IL Counties

    var counties = countyCSV;

    var input = "Illinois"

    function makeCountyChart(input) {
    var inputCounties = counties.filter(d => d.state == input);

    var countyStarts = inputCounties.filter(d =>d.year == 2003);
    var countyStops = inputCounties.filter(d=>d.year == 2018);


    countyList = [...new Set(inputCounties.map(d=>d.county))];

    countyChanges = [];

    // creating the array of objects for our county data

    countyList.forEach(function(county) {
        var start = countyStarts.filter(d=>d.county == county)[0]["birth_rate"];
        var stop = countyStops.filter(d=>d.county == county)[0]["birth_rate"];
        var change = stop-start;
        var newObject = {
            name: county,
            change: change,
            color: "#52a7a7"
        };
        countyChanges.push(newObject);
    });

    // sorting

    sortedCountyChanges = countyChanges.sort(function(a, b) {
        return b.change - a.change;
      });

    // grabbing Illinois from the state data and selecting high and low counties

    var stateBar = sortedStateChanges.filter(d=>d.name == input)[0]
    stateBar.color = "#A8A4A4";

    var selection = [sortedCountyChanges[0], sortedCountyChanges[1],sortedCountyChanges[2],stateBar,sortedCountyChanges[sortedCountyChanges.length - 3],sortedCountyChanges[sortedCountyChanges.length - 2],sortedCountyChanges[sortedCountyChanges.length - 1]];

    //set up

    var countyChartData = {
        labels: selection.map(d=>d.name),
        datasets: [
          {
            label: "birth rate",
            data: selection.map(d=>d.change),
            borderColor: selection.map(d=>d.color),
            backgroundColor: selection.map(d=>d.color),
            datalabels: {
                align: function(context) {
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    if (value > -10) {return "start"}
                    else {return "end"}},
                anchor: 'start'
              }
          },

        ]
      };

      return countyChartData
    }

    
    // config
      var configCounties = {
        type: 'bar',
        data: makeCountyChart("Illinois"),
        options: {
            responsive: true,
            tooltips: false,
            plugins: {
                legend: false,
                datalabels: {
                    color: function(context) {
                        var index = context.dataIndex;
                        var value = context.dataset.data[index];
                        if (value > -10) {return "black"}
                        else {return "white"}},
                    font: {
                      weight: 'bold'
                    },
                    formatter: function(value, context) {
                        return [context.chart.data.labels[context.dataIndex] + ': ',Math.round(value) + '%'];
                      },
                    textAlign: "center"
                  }
            },
            title: {
              display: true,
              text: `Counties with the highest and lowest change in teen birthrates, 2003 - 2018`
            },
            scales: {
                xAxes: [{
                    display: false,
                    type: "category",
                    position: {y: 5},
                    grid: {
                        color: "rgba(0, 0, 0, 0)"
                    }
                }]
            }
                
                
          }
        };

        //render chart

        var ctx = document.getElementById('countyChart');

        var countyChart = new Chart(ctx, configCounties);

        var addedStates = [];

        d3.select("#add_state_bars").on("click", function(){
          var input = d3.select("#state_input_bars").property("value");
          console.log(input);
          chosenState = sortedStateChanges.filter(d => d.name == input);

          stateIndex = sortedStateChanges.map(d=>d.name).indexOf(input);
          var insertIndex = 0
          stateChart.data.labels.forEach(function(label){
            if (sortedStateChanges.map(d=>d.name).indexOf(label) < stateIndex) {
              insertIndex = stateChart.data.labels.indexOf(label);
            } 
          });
          insertIndex = insertIndex + 1

          stateChart.data.labels.splice(insertIndex, 0, chosenState[0].name);
          stateChart.data.datasets[0].data.splice(insertIndex, 0, chosenState[0].change);
          
          stateChart.update();

          addedStates.push(insertIndex);

          countyChart.data = makeCountyChart(input);
          countyChart.update();

        });

        d3.select("#clear_bars").on("click", function() {
          originalData = [sortedStateChanges[0], sortedStateChanges[1],sortedStateChanges[2],sortedStateChanges.filter(d=>d.name == "Total U.S.")[0],sortedStateChanges[49],sortedStateChanges[50],sortedStateChanges[51]];
          stateChart.data.labels = originalData.map(d=>d.name)
          stateChart.data.datasets = [
            {
              label: "birth rate",
              data: originalData.map(d=>d.change),
              borderColor: "#52a7a7",
              backgroundColor: "#52a7a7",
              datalabels: {
                  align: 'start',
                  anchor: 'start'
                }
            },
          ];
          stateChart.update();
        });
