const apiURLDomainPort = 'http://localhost:5501' //'http://192.168.1.33:5501'

const scaleFunctions = {
    linear: d3.scaleLinear,
    time: d3.scaleTime
}

const domainMethods = {
    date: dateString => new Date(dateString),
    currency: decimal => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(decimal)
}

const tickMethods = {
    date_yyyy_mm_dd: d3.timeFormat('%Y-%m-%d'),
    date_mm_dd: d3.timeFormat('%m/%d'),
    saturday: d3.timeSaturday,
    dollar_thousand: d => `$${d / 1000}K`
}

function errorHandler(error) {
    console.error('Error: ', error);
}

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

function addChartTitle(svg, marginConfig, titleConfig) {
    try {

        svg.append('text')
            .attr('x', marginConfig.left + titleConfig.margin.left)
            .attr('y', marginConfig.top + titleConfig.margin.top)
            .attr('class', `${titleConfig.class}`)
            .text(titleConfig.text);

    } catch {
        errorHandler(error);
    }
}

async function createChart(elementId, dataSourceURL) {

    const apiURL = `${apiURLDomainPort}/getChartConfig/${elementId.replace('#', '')}`

    const chartConfigResponse = await fetch(apiURL);
    const chartConfig = await chartConfigResponse.json();

    console.log(chartConfig);

    const dataResponse = await fetch(dataSourceURL);
    const data = await dataResponse.json(); 
    const aggData = sumByGroup(data, chartConfig.x.key, chartConfig.y.key)

    //Get the position and dims of the containing element
    var element = document.getElementById(elementId.replace('#', ''));
    const elementRect = element.getBoundingClientRect();
    const svgWidth = elementRect.width;
    const svgHeight = elementRect.height;
    const chartWidth = svgWidth - chartConfig.margin.left - chartConfig.margin.right;
    const chartHeight = svgHeight - chartConfig.margin.top - chartConfig.margin.bottom;

    const svg = d3.select(elementId)
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    if (chartConfig.title) {
        addChartTitle(svg, chartConfig.margin, chartConfig.title)
    }
     
    var xMin = domainMethods[chartConfig.x.domainType](d3.min(data, d => d[chartConfig.x.key]));
    var xMax = domainMethods[chartConfig.x.domainType](d3.max(data, d => d[chartConfig.x.key]));
    xScale = scaleFunctions[chartConfig.x.scale]()
        .domain([xMin, xMax])
        .range([chartConfig.margin.left, chartWidth + chartConfig.margin.left - chartConfig.margin.right]);

    xAxis = d3.axisBottom(xScale)
        .ticks(tickMethods[chartConfig.x.tick])
        .tickFormat(tickMethods[chartConfig.x.tickFormat])
        .tickSize(chartConfig.x.tickSize);

    svg.append('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(0, ${chartHeight + chartConfig.margin.top})`)
        .call(xAxis)
        .selectAll('text')
        //.style('text-anchor', 'end')
        //.attr('dx', '-.6em')
        //.attr('dy', '0.4em')
        //.attr('transform', 'rotate(-45)');

    tickConfig = {'transform': 'rotate(-45)', 'dx': '-.6em', 'dy': '0.4em', 'text-anchor': 'end'}

    //Need to add a way to get down to the selectors desired.
    Object.keys(tickConfig).forEach(
        key => {
            console.log(`Key:${key}, Value: ${tickConfig[key]}`);
            svg.select('g').selectAll('text').attr(key, tickConfig[key]);
        }
    )

    var yMin = d3.min(aggData, d => d[chartConfig.y.key]);
    var yMax = d3.max(aggData, d => d[chartConfig.y.key]) * 1.01; /*COME BACK AND MAKE THIS A CONFIG KEY / VALUE*/
    yScale = scaleFunctions[chartConfig.y.scale]()
        .domain([yMin, yMax])
        .range([chartHeight, chartConfig.margin.top]);

    yAxis = d3.axisLeft(yScale)
        .ticks(tickMethods[chartConfig.y.tick])
        .tickFormat(tickMethods[chartConfig.y.tickFormat])
        .tickSize(chartConfig.y.tickSize);

    svg.append('g')
        .attr('class', 'yAxis')
        .attr('transform', `translate(${chartConfig.margin.left}, ${chartConfig.margin.top})`)
        .call(yAxis);

    const line = d3.line()
        .x(d => xScale(domainMethods[chartConfig.x.domainType](d[chartConfig.x.key])))
        .y(d => yScale(d[chartConfig.y.key]))

    console.log(aggData)

    console.log(yScale.ticks())

    //Add attributes conditionally
    //https://stackoverflow.com/questions/18205034/d3-adding-data-attribute-conditionally
    svg.selectAll('line.horizontalGrid')
        .data(yScale.ticks())
        .enter()
        .append('line')
        .attr('class', 'horizontalGrid')
        .attr('x1', chartConfig.margin.left)
        .attr('y1', d => yScale(d) + chartConfig.margin.top)
        .attr('x2', chartWidth + chartConfig.margin.left - chartConfig.margin.right)
        .attr('y2', d => yScale(d) + chartConfig.margin.top)
        .style('stroke', 'gray')
        .style('stroke-width', 0.3)
        .style('stroke-dasharray', '6, 8');

    console.log(chartConfig.line);
    console.log(Object.keys(chartConfig.line));
    //console.log(d3.keys(chartConfig.line));
    //Object.keys(chartConfig.line).forEach(
    //    key => {
    //        console.log(`Key:${key}, Value: ${chartConfig.line[key]}`);
    //    }
    //)

    const path = svg.append('path')
        .attr('transform', `translate(0, ${chartConfig.margin.top})`)
        .datum(aggData)
        //.attr('fill', chartConfig.line.fill)
        //.attr(chartConfig.line)
        //.attr(['stroke', 'strokeWidth'].reduce((result, attr) => {
        //    result[attr] = d => {return attr in d ? d[attr] : null;}
        //    return result;
        //}))
        //.attr('stroke', chartConfig.line.stroke)
        //.attr('stroke-width', chartConfig.line.strokeWidth)
        .attr('d', line);

    //Wonder if there is way to add this in line with the const path def above.
    Object.keys(chartConfig.line).forEach(
            key => {
                console.log(`Key:${key}, Value: ${chartConfig.line[key]}`);
                path.attr(key, chartConfig.line[key]);
            }
        )

};


//Serves As The Main Function To Go Get The Contents Of curAcctBal Endpoint
function getAccounts() {
    return new Promise((resolve, reject) => {
        fetch(`${apiURLDomainPort}/acct`)
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}

//Serves As The Main Function To Go Get The Contents Of curAcctBal Endpoint
function getTickers() {
    return new Promise((resolve, reject) => {
        fetch(`${apiURLDomainPort}/tickers`)
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}

//Serves As The Main Function To Go Get The Contents Of curAcctBal Endpoint
function getTransTypes() {
    return new Promise((resolve, reject) => {
        fetch(`${apiURLDomainPort}/transTypes`)
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}

/*




EVERYTHING BELOW HERE WILL EVENTUALLY GO AWAY







*/






















const colorsArray = ["#FF5733", "#33FF6C", "#3366FF", "#FF33A3", "#33FFB3", "#FF33CC",
            "#33FFFF", "#FF3366", "#66FF33", "#336633", "#33FF33", "#33FFA3", "#FF6633",
            "#66FF66", "#6633FF", "#FF3366", "#33CCFF", "#FFA333", "#FF33A3", "#FF9933",
            "#33CC66", "#FF9933", "#33FF66", "#66FF33", "#FF3366", "#3366FF", "#FF33A3",
            "#33FFB3", "#3366FF", "#FF3366"];



//Serves As The Main Function To Go Get The Contents Of curAcctBal Endpoint
function getAccountBalanceHist() {
    return new Promise((resolve, reject) => {
        fetch(`${apiURLDomainPort}/acctBalHist`)
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
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

async function createChartLegacy(elementId, dataSourceURL) {

    const apiURL = `${apiURLDomainPort}/getChartConfig/${elementId.replace('#', '')}`

    const chartConfigResponse = await fetch(apiURL);
    const chartConfig = await chartConfigResponse.json();

    const dataResponse = await fetch(dataSourceURL);
    const data = await dataResponse.json(); 

    //Get the position and dims of the containing element
    var element = document.getElementById(elementId.replace('#', ''));
    const elementRect = element.getBoundingClientRect();
    //console.log(elementRect.top, elementRect.right, elementRect.bottom, elementRect.left)
    //console.log(elementRect.width,elementRect.height);
    const svgWidth = elementRect.width;
    const svgHeight = elementRect.height;
    const chartWidth = svgWidth - chartConfig.margin.left - chartConfig.margin.right;
    const chartHeight = svgHeight - chartConfig.margin.top - chartConfig.margin.bottom;

    const svg = d3.select(elementId)
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    if (chartConfig.title) {
        addChartTitle(svg, chartConfig.margin, chartConfig.title)
    }
        
    data.sort((a, b) => d3.ascending(a, b.snsh_dt))
    aggData = sumByGroup(data, 'snsh_dt', 'acct_bal')
    console.log(data);
    console.log(aggData);

    bottomMinMax = d3.extent(aggData, d => new Date(d.snsh_dt))
    bottomMinMax[0] = new Date(bottomMinMax[0].setDate(bottomMinMax[0].getDate() - 4))
    bottomMinMax[1] = new Date(bottomMinMax[1].setDate(bottomMinMax[1].getDate() + 4))

    bottomScale = d3.scaleTime()
        .domain(bottomMinMax)
        .range([chartConfig.margin.left, chartWidth]);

    leftScale = d3.scaleLinear()
        //.domain([0, 400000])
        .domain(d3.extent(aggData, d => d.acct_bal)).nice()
        .range([chartHeight, 0]);

    const line = d3.line()
        .x(d => bottomScale(new Date(d.snsh_dt)))
        .y(d => leftScale(d.acct_bal));

    const path = svg.append('path')
        .attr('transform', `translate(0, ${chartConfig.margin.top})`)
        .datum(aggData)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('d', line);

    bottomAxis = d3.axisBottom(bottomScale)
        .ticks(d3.timeSaturday)
        .tickFormat(d3.timeFormat('%Y-%m-%d'))
        .tickSize(5);

    svg.append('g')
        .attr('class', 'bottomAxis')
        .attr('transform', `translate(0, ${chartHeight + chartConfig.margin.top})`)
        .call(bottomAxis)
        //.attr('stroke', 'black');

    leftAxis = d3.axisLeft(leftScale)
        .ticks(5)
        .tickFormat(d => `$${d / 1000}K`)
        .tickSize(5);

    svg.append('g')
        .attr('class', 'leftAxis')
        .attr('transform', `translate(${chartConfig.margin.left}, ${chartConfig.margin.top})`)
        .call(leftAxis);

    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip');

    const circle = svg.append('circle')
        .attr('r', 0)
        .attr('fill', 'steelblue')
        .style('stroke', 'white')
        .attr('opacity', .70)
        .style('pointer-events', 'none');

    const listRect = svg.append('rect')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        //.attr('transform', `translate(${chartConfig.margin.left}, ${chartConfig.margin.top})`)
        .attr('opacity', 0);

    listRect.on('pointermove', function (event) {
        const [xCoord] = d3.pointer(event, this);
        const bisectDate = d3.bisector(d => new Date(d.snsh_dt)).left;
        const x0 = bottomScale.invert(xCoord);
        const i = bisectDate(aggData, x0, 1);
        const d0 = aggData[i-1];
        const d1 = aggData[i];
        const d = x0 - new Date(d0.snsh_dt) > new Date(d1.snsh_dt) - x0 ? d1 : d0;
        const xPos = bottomScale(new Date(d.snsh_dt));
        const yPos = leftScale(d.acct_bal) + chartConfig.margin.top;

        circle.attr('cx', xPos)
            .attr('cy', yPos);

        circle.transition()
            .duration(50)
            .attr('r', 5);

        const tooltipHTML = `<div class="tooltip">
                                <h3 id="tooltipHeader">${new Date(d.snsh_dt).toISOString().split('T')[0]}</h3>
                                <div id="tooltipHeaderLine"></div>
                                <div class="tooltipDetail"> 
                                    <h4 class="infoLabel">Balance:</h4>
                                    <p class="infoDetail">$${d.acct_bal.toFixed(2).toLocaleString('en-US', {maximumFractionDigits:2})}</p>
                                </div>
                            </div>`

        tooltip.style('display', 'flex')
            .style('left', `${elementRect.left + xPos + 50}px`)
            .style('top', `${elementRect.top + yPos + 25}px`)
            .html(tooltipHTML)
    
    });

    listRect.on('pointerleave', function() {
        circle.transition()
            .duration(50)
            .attr('r', 0);

        tooltip.style('display', 'none');
    })

}





//Example of how to call function:
//createBarChart("#testCentralChart", exData, "pay_mnth_nm_yr_nbr", "inc_amt", exMargin, "inc_status"); 