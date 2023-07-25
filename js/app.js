
const example_dtata = [
    {
      "group": "banana",
      "Nitrogen": 12,
      "normal": 1,
      "stress": 13
    },
    {
      "group": "poacee",
      "Nitrogen": 6,
      "normal": 6,
      "stress": 33
    },
    {
      "group": "sorgho",
      "Nitrogen": 11,
      "normal": 28,
      "stress": 12
    },
    {
      "group": "triticum",
      "Nitrogen": 19,
      "normal": 6,
      "stress": 1
    }
   ]

function createBarChart (divId, chartData, dimKey, plotKeys) {

    chartElement = document.getElementById(divId.replace('#', ''));
    const chartWidth = chartElement.offsetWidth;
    const chartHeight = chartElement.offsetHeight;
    //will look to make this an argument as well
    const chartMargin = {top: 20, right: 20, bottom: 20, left: 20}
    
    var svg = d3.select(divId)
        .append("svg")
            .attr("width", chartWidth + chartMargin.left + chartMargin.right) 
            .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
        .append("g")
            .attr("transform", "translate(" + chartMargin.left + ", " + chartMargin.top + ")");

    //Add the X axis
    var xVals = chartData.map(obj => obj[dimKey]);
    var x = d3.scaleBand()
        .domain(xVals)
        .range([0, chartWidth])
        .padding([0.2])
    svg.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    var y = d3.scaleLinear()
        .domain([0, 60]) //Work to make this dynamic to the data
        .range([chartHeight, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    var color = d3.scaleOrdinal()
        .domain(plotKeys)
        .range(['#e41a1c','#377eb8','#4daf4a'])

    var stackedData = d3.stack()
        .keys(plotKeys)
        (chartData)

    svg.append("g")
        .selectAll("g")
        //Enter in Stack Data = Loop Per key
        .data (stackedData)
        .enter().append("g")
            .attr("fill", function(d) {return color(d.key); })
            .selectAll("rect")
            .data(function(d) {return d; })
            .enter().append("rect")
                .attr("x", function(d) {return x(d.data.group); })
                .attr("y", function(d) {return y(d[1]); })
                .attr("height", function(d) {return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth())

};

createBarChart("#testCentralChart", example_dtata, "group", ["Nitrogen", "normal", "stress"]); 





