const dateFormat = new Date().toISOString().split('T')[0]
const currencyFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})

//Serves As The Main Function To Go Get The Contents Of curEstInc Endpoint
function getCurEstIncTickerPayDt() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5501/curEstIncTickerPayDt')
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}

//Serves As The Main Function To Go Get The Contents Of curEstInc Endpoint
function getHistEstIncAvg() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5501/histEstIncAvg')
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}

//Serves As The Main Function To Go Get The Contents Of curEstIncAvg Endpoint
function getCurEstIncAvg() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5501/curEstIncAvg')
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}

//Serves As The Main Function To Go Get The Contents Of curEstInc Endpoint
function getCurEstIncome() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5501/curEstInc')
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}

// Function to filter keys based on specified array
function filterKeys(data, filterArray) {
    return data.map(obj => {
      const filteredObj = {};
      Object.keys(obj).forEach(key => {
        if (filterArray.includes(key)) {
          filteredObj[key] = obj[key];
        }
      });
      return filteredObj;
    });
  }
  
function createHtmlTable(tblData) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    
    //Create the Table Header
    const headers = Object.keys(tblData[0]);
    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    //Create Table Rows
    let isAltRow = 0
    tblData.forEach(item => {
        const row = document.createElement("tr");
        if (isAltRow === 0) {
            row.classList.add("mainRow");
            isAltRow = 1;
        } else {
            row.classList.add("altRow");
            isAltRow = 0;
        }
        headers.forEach(header => {
            const cell = document.createElement("td");
            cell.textContent = item[header];
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function loadCurEstIncomeDataTable() {
    getCurEstIncTickerPayDt()
        .then(curEstIncData => {


            
            //Load Detail Table of All Estimated Income Pay Dates / Tickers
            const keysOfInterest = ["acct_nm", "inst_nm", "ticker", "ticker_nm", "pay_dt", "inc_status", "inc_freq", "inc_qty", "inc_rate", "inc_amt"]
            curEstIncDataFiltered = filterKeys(curEstIncData, keysOfInterest)
            curEstIncDataFiltered.sort((a, b) => new Date(a.pay_dt) - new Date(b.pay_dt));
            const estIncTable = createHtmlTable(curEstIncDataFiltered);
            const estIncTableContainer = document.getElementById("incDtlTblContent")
            estIncTableContainer.appendChild(estIncTable);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function loadCurEstIncomeAvg() {
    getCurEstIncAvg()
        .then(curEstIncAvgData => {
            //Load values into Summary Card for Total / Avg Income Rates
            const annualEstInc = document.getElementById("annualEstInc");
            const monthlyAvgInc = document.getElementById("monthlyAvgInc");
            const dlyAvgInc = document.getElementById("dlyAvgInc");
            annualEstInc.textContent = currencyFormat.format(curEstIncAvgData[0].inc_amt_annual);
            monthlyAvgInc.textContent = currencyFormat.format(curEstIncAvgData[0].inc_amt_mnly);
            dlyAvgInc.textContent = currencyFormat.format(curEstIncAvgData[0].inc_amt_dly);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function loadHistEstIncomeAvg() {
    getHistEstIncAvg()
        .then(histEstIncAvgData => {

            const incomeChartMargin = {top: 20, right: 20, bottom: 25, left: 50};
            createBarChart("#incSnshHistChartContent", histEstIncAvgData, "snsh_dt", "inc_amt_annual", incomeChartMargin, ["#E59C6A"])
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function loadCurEstIncomeData() {
    getCurEstIncome()
        .then(curEstIncData => {

            //Update the Recent Income Total in the Summary
            const estiamtedTotalIncome = curEstIncData.reduce((sum, record) => sum + record.inc_amt, 0);
            const formattedEstimatedTotalIncome = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(estiamtedTotalIncome);
            const incomeEstimateTextElement = document.getElementById('estIncCardText');
            incomeEstimateTextElement.textContent = formattedEstimatedTotalIncome;

            //Update the Information for the Summary
            const estimatedIncomeAsOfDate = curEstIncData.reduce((max, record) => record.snsh_dt > max ? record.snsh_dt : max, '')
            const formattedEstimatedIncomeAsOfDate = new Date(estimatedIncomeAsOfDate).toISOString().split('T')[0]
            const incomeEstimateAsOfElement = document.getElementById('estIncCardAsOf');
            incomeEstimateAsOfElement.textContent = `as of ${formattedEstimatedIncomeAsOfDate}`;

            const incomeChartMargin = {top: 20, right: 20, bottom: 20, left: 40}
            createBarChart("#estIncBarChartContent", curEstIncData, "pay_yr_mnth_nbr", "inc_amt", incomeChartMargin, ['#4682b4', '#4d90c7'], "inc_status")

            const curEstIncTickerData = d3.group(curEstIncData, d => d.ticker)
            const curEstIncTickerAggData = Array.from(curEstIncTickerData, ([ticker, values]) => ({
                ticker
                , ticker_inc_ttl: d3.sum(values, d => d.inc_amt)
            }))
            curEstIncTickerAggData.sort((a, b) => b.ticker_inc_ttl - a.ticker_inc_ttl);

            balanceHoldingsChartContainer = document.getElementById('estIncBreakoutChartContent');
            const donutChartMargin = {top: 20, right: 20, bottom: 20, left: 20}
            const donutChartWidth = balanceHoldingsChartContainer.offsetWidth - donutChartMargin.left - donutChartMargin.right;
            const donutChartContainerHeight = balanceHoldingsChartContainer.offsetHeight - donutChartMargin.top - donutChartMargin.bottom;
            const donutChartHeight = donutChartContainerHeight * 0.9;
            const donutChartRadius = Math.min(donutChartWidth, donutChartHeight) / 2;
    
            const svgBalanceChart = d3.select('#estIncBreakoutChartContent')
                .append("svg")
                .attr("width", donutChartWidth)
                .attr("height", donutChartContainerHeight)
                .append("g")
                .attr("transform", `translate(${(donutChartWidth / 2)}, ${donutChartContainerHeight / 2})`);
    
            const pie = d3.pie()
                .value(d => d.ticker_inc_ttl);
    
            const arc = d3.arc()
                .innerRadius(donutChartRadius * 0.2)
                .outerRadius(donutChartRadius);
    
            const arcs = svgBalanceChart.selectAll("arc")
                .data(pie(curEstIncTickerAggData))
                .enter()
                .append("g")
                .attr("class", "arc");
    
            arcs.append("path")
                .attr("d", arc)
                .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);
    
            arcs.append("text")
                .attr("transform", d => `translate(${arc.centroid(d)})`)
                .attr("text-anchor", "middle")
                .attr("class", "balanceDonutLabel")
                .text(d => `${d.data.ticker}: ${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(d.data.ticker_inc_ttl)}`)
                .style("top", d => `${arc.centroid(d)[1]}px`)
                .style("left", d => `${arc.centroid(d)[0]}px`);
        
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function loadExampleChart() {

    const elementId = '#incSnshHistChartContent'
    const dataSourceURL = "http://localhost:5501/histEstIncAvg"
    const apiURL = `http://localhost:5501/getChartConfig/${elementId.replace('#', '')}`

    fetch(apiURL)
        .then(response => response.json())
        .then(chartConfigJSON => {
            console.log(chartConfigJSON)

            containerElement = document.getElementById(elementId.replace('#', ''));
            var svgWidth = containerElement.getBoundingClientRect().width;
            var svgHeight = containerElement.getBoundingClientRect().height;
            var chartWidth = svgWidth - chartConfigJSON.margin.left - chartConfigJSON.margin.right;
            var chartHeight = svgHeight - chartConfigJSON.margin.top - chartConfigJSON.margin.bottom;

            console.log(`SW: ${svgWidth}, GW: ${chartWidth}, SH: ${svgHeight}, GH: ${chartHeight}, BM: ${chartConfigJSON.margin.bottom}`);

            

            //Create SVG Container
            const svg = d3.select(elementId).append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform", `translate(${chartConfigJSON.margin.left}, ${chartConfigJSON.margin.top})`)

            const tooltip = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                .attr('id', 'tooltip');

            //Add Chart Title
            svg.append("text")
                .attr("x", chartConfigJSON.margin.left + chartConfigJSON.title.margin.left)
                .attr("y", chartConfigJSON.margin.top + chartConfigJSON.title.margin.top)
                .attr("class", `${chartConfigJSON.title.class}`)
                .text(chartConfigJSON.title.text)


            

            //Load & Process Data
            fetch(dataSourceURL)
                .then(dataResponse => dataResponse.json())
                .then(chartData => {

                    //console.log(chartData);
                    //console.log(d3.min(chartData, chartData => chartData.snsh_dt))

                    //Note: Move this to API, to allow for all consumption points to utilize
                    const chartDataFormatted = chartData.map(record => ({
                        ...record
                        , snsh_dt: new Date(record.snsh_dt.toLocaleString('en-US', { timeZone: "America/New_York" }))
                    }));

                    //Make this handling both ascending / descending via if / else.
                    //Sort Data
                    chartDataFormatted.sort((a, b) => d3.ascending(a.snsh_dt, b.snsh_dt));


                    //Add xAxis
                    var xMin = new Date(d3.min(chartDataFormatted, d => d.snsh_dt))
                    var xMax = new Date(d3.max(chartDataFormatted, d => d.snsh_dt))
                    const xWidth = chartWidth - chartConfigJSON.margin.left - chartConfigJSON.margin.right

                    console.log(xWidth)
                    //Will need to set a config param to undestand how much the x with domain should be padded by
                    //Figure out a way to force the ticks on axis 
                    const x = d3.scaleTime()
                        .range([0, xWidth])
                        .domain([xMin.setDate(xMin.getDate() - 3), xMax.setDate(xMax.getDate() + 2)]);
                        //.padding(0.1);

                    const xAxis = d3.axisBottom(x)
                        .ticks(5)
                        .tickSize(1);



                    //Add yAxis
                    const y = d3.scaleLinear()
                        .range([chartHeight, 0])
                        .domain([0, 1.1 * d3.max(chartDataFormatted, d => d.inc_amt_annual)]);

                    const yAxis = d3.axisLeft(y)
                        .ticks(5)
                        .tickSize(1);



                    /*
                    //Example of adding secondary axis when needed

                    //Add yAxis
                    const yl = d3.scaleLinear()
                    .range([chartHeight, 0])
                    .domain([0, d3.max(chartDataFormatted, d => d.inc_amt_annual)]);

                    const ylAxis = d3.axisRight(yl)
                        .ticks(5)
                        .tickSize(1);
                        
                    */

                    const barWidth = 50 //x(chartDataFormatted[1].snsh_dt) - x(chartDataFormatted[0].snsh_dt)

                    //Add Horizontal Gridlines
                    svg.selectAll('line.horizontalGrid')
                        .data(y.ticks(5))
                        .enter()
                        .append('line')
                        .attr("class", "horizontalGrid")
                        .attr("x1", chartConfigJSON.margin.left)
                        .attr("y1", d => y(d))
                        .attr("x2", xWidth)
                        .attr("y2", d => y(d))
                        .style("stroke", "gray")
                        .style("stroke-width", 1)
                        .style("stroke-dasharray", '3, 3');

                    /*
                    //Add Vertical Gridlines
                    svg.selectAll('line.verticalGrid')
                        .data(x.ticks(5))
                        .enter()
                        .append('line')
                        .attr("class", "verticalGrid")
                        .attr("x1", d => x(d) + chartConfigJSON.margin.left)
                        .attr("y1", 0)
                        .attr("x2",  d => x(d) + chartConfigJSON.margin.left)
                        .attr("y2", chartHeight)
                        .style("stroke", "gray")
                        .style("stroke-width", 1)
                        .style("stroke-dasharray", '3, 3');
                    */

                    //Create Bars
                    svg.selectAll(".bar")
                        .data(chartDataFormatted)
                        .enter()
                        .append("rect")
                        .attr("class", "bar")
                        .attr("x", data => x(data.snsh_dt) - (barWidth / 2))
                        .attr("y", data => y(data.inc_amt_annual))
                        .attr("width", barWidth)
                        .attr("height", data => chartHeight - y(data.inc_amt_annual))
                        .style("margin", "5px")
                        .attr('fill', 'steelblue');

                    const line = d3.line()
                        .x(d => x(d.snsh_dt))
                        .y(d => y(d.inc_amt_annual));

                    svg.selectAll('.label')
                        .data(chartDataFormatted)
                        .enter()
                        .append("text")
                        .text(d => currencyFormat.format(d.inc_amt_annual))
                        .attr('x', d => x(d.snsh_dt) - (barWidth / 2))
                        .attr('y', d => y(d.inc_amt_annual) - 5)

                    const listeningRect = svg.append('rect')
                        .attr('width', svgWidth)
                        .attr('height', svgHeight)
                        .attr('opacity', '0');

                    //Add TrendLine
                    const path = svg.append("path")
                        .datum(chartDataFormatted)
                        .attr("fill", "none")
                        .attr("stroke", "red")
                        .attr("stroke-width", 1)
                        .attr("d", line);

                    //Add Axes On Top
                    svg.append("g")
                        .attr("class", "yAxis")
                        .attr("transform", `translate(${chartConfigJSON.margin.left}, 0)`)
                        .attr("stroke", "black")
                        .call(yAxis);

                    svg.append("g")
                        .attr("class", "xAxis")
                        .attr("transform", `translate(${chartConfigJSON.margin.left}, ${chartHeight})`)
                        .attr("stroke", "black")
                        .call(xAxis);

                    /*
                    svg.append("g")
                        .attr("class", "ylAxis")
                        .attr("transform", `translate(${chartWidth}, 0)`)
                        .attr("stroke", "black")
                        .call(ylAxis);
                    */


                    listeningRect.on("mousemove", function(event) {
                        const [xCoord] = d3.pointer(event, this);
                        const bisectX = d3.bisector(d => d.snsh_dt).left;
                        const x0 = x.invert(xCoord);
                        const i = bisectX(chartDataFormatted, x0, 1);
                        const d0 = chartDataFormatted[i - 1];
                        const d1 = chartDataFormatted[i];
                        const d = x0 - d0.snsh_dt > d1.snsh_dt - x0 ? d1 : d0;
                        const xPos = x(d.snsh_dt);
                        const yPos = y(d.inc_amt_annual);
    
                        //need to figure out how to get the tool tip to show in the 
                        //respective container without hardcoding a # of px to bring it
                        //down to within view.
                        tooltip
                            .style('display', 'block')
                            .style('left', `${xPos}px`)
                            .style('top', `${1300 + yPos}px`)
                            .html(`<p>Test this ${xPos}</p>`)
                    });

                   
                });



        });

        
        
        
        
        //Add Vertical Gridlines
        //Add Labels At End of Bar
        //Add Total Label
        
        //Add Data Source

};

/*
//Serves As The Main Function To Go Get The Contents Of curEstInc Endpoint
function getHistEstIncAvg() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5501/histEstIncAvg')
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}
*/


loadExampleChart();
loadCurEstIncomeData();
loadCurEstIncomeDataTable();
//loadCurEstIncomeAvg();
//loadHistEstIncomeAvg();