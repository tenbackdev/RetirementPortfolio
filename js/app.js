const colorsArray = ["#FF5733", "#33FF6C", "#3366FF", "#FF33A3", "#33FFB3", "#FF33CC",
            "#33FFFF", "#FF3366", "#66FF33", "#336633", "#33FF33", "#33FFA3", "#FF6633",
            "#66FF66", "#6633FF", "#FF3366", "#33CCFF", "#FFA333", "#FF33A3", "#FF9933",
            "#33CC66", "#FF9933", "#33FF66", "#66FF33", "#FF3366", "#3366FF", "#FF33A3",
            "#33FFB3", "#3366FF", "#FF3366"];

//Function to sum any JSON data given, while grouping by a specified column name
//Function will return JSON data with 2 keys, the column names will match the argument values for groupKey & sumKey
function sumByGroup(sumData, groupKey, sumKey) {
    const sumByGroup = d3.rollup(
        sumData,
        group => d3.sum(group, d => d[sumKey]),
        d => d[groupKey]
    );

    return Array.from(sumByGroup, ([key, sum]) => ({[groupKey]: key, [sumKey]: sum}));
}

//Transform data from Row-Store to Column-Store to prepare
//Initial use case being inputs for the presentation of a stacked bar chart
function transformData(data, dimKey, pivotKey, measKey) {
    // Group data by unique dimKey and pivotKey combination and calculate the sum of inc_amt
    const groupedData = d3.rollup(
        data,
        v => d3.sum(v, d => d[measKey]),
        d => d[dimKey],
        d => d[pivotKey]
    );

    // Convert the grouped data to an array of objects
    const exDataPivot = Array.from(groupedData, ([key, values]) => {
        const obj = { [dimKey]: key };
        values.forEach((value, pivot) => {
        obj[pivot] = value;
        });
        return obj;
    });

    return exDataPivot;
  }


  

function createBarChart (divId, chartData, dimKey, plotKey, chartMargin, colorRange, stackKey) {
    var stackFlag = true;
    if (stackKey === undefined) {
        stackFlag = false;
    }

    //This will handle creating all bar charts, including stacked bar charts
    containerElement = document.getElementById(divId.replace('#', ''));
    const containerStyle = window.getComputedStyle(containerElement);
    var containerWidth = containerElement.getBoundingClientRect().width - parseInt(containerStyle.marginLeft) - parseInt(containerStyle.marginRight);
    var containerHeight = containerElement.offsetHeight - parseInt(containerStyle.marginTop) - parseInt(containerStyle.marginBottom);

    const chartWidth = containerWidth - chartMargin.left - chartMargin.right
    const chartHeight = containerHeight - chartMargin.top - chartMargin.bottom
    
    var svg = d3.select(divId)
        .append("svg")
            .attr("width", chartWidth + chartMargin.left + chartMargin.right - 40) 
            .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
        .append("g")
            .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

    //Add the X axis
    var xVals = Array.from(new Set(chartData.map(obj => obj[dimKey])));
    xVals.sort((a, b) => a - b); //Need to revisit to better handle wider range of sort scenarios.
    var x = d3.scaleBand()
        .domain(xVals)
        .range([0, chartWidth])
        .padding([0.2])
    svg.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    var yMax = 0
    if (stackFlag) {
        //Find the highest a bar will reach, regardess of how many stacks needed
        const dimKeyGroupedData = sumByGroup(chartData, dimKey, plotKey);
        yMax = dimKeyGroupedData.reduce((max, record) => record[plotKey] > max ? record[plotKey] : max, 0);
    } else {
        yMax = chartData.reduce((max, record) => record[plotKey] > max ? record[plotKey] : max, 0);
    }
    
    var y = d3.scaleLinear()
        .domain([0, yMax * 1.03])
        .range([chartHeight, 0]);
    svg.append("g")
        .call(d3.axisLeft(y))
        .attr("transform", `translate(0, 0)`);

    if (stackFlag) {
        var stackVals = Array.from(new Set(chartData.map(obj => obj[stackKey])));
        var color = d3.scaleOrdinal()
            .domain(stackVals)
            .range(colorRange);

        var transformedChartData = transformData(chartData, dimKey, stackKey, plotKey);
        transformedChartData.sort((a, b) => a[dimKey] - b[dimKey]);
        var stackedData = d3.stack()
            .keys(stackVals)
            (transformedChartData)

        svg.append("g")
            .selectAll("g")
            //Enter in Stack Data = Loop Per key
            .data (stackedData)
            .enter().append("g")
                .attr("fill", function(d) {return color(d.key); })
                .selectAll("rect")
                .data(function(d) {return d; })
                .enter().append("rect")
                    .attr("x", function(d) {return x(d.data[dimKey]); })
                    .attr("y", function(d) {return y(d[1]); })
                    .attr("height", function(d) {return y(d[0]) - (y(d[1]) || y(d[0])); }) //Revisit this line to better calculate
                    .attr("width", x.bandwidth())
    } else {
        svg.append("g")
            .selectAll("g")
            .data(chartData)
            .enter()
            .append("rect")
            .attr("x", data => x(data[dimKey]))
            .attr("y", data => y(data[plotKey]))
            .attr("height", data => chartHeight - y(data[plotKey])) //Revisit this line to better calculate
            .attr("width", x.bandwidth())
            .attr("fill", colorRange[0])

    }


    
};

//Example of how to call function:
//createBarChart("#testCentralChart", exData, "pay_mnth_nm_yr_nbr", "inc_amt", exMargin, "inc_status"); 