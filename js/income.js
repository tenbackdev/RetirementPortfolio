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

    const elementId = '#default_bar_chart'
    const apiURL = `http://localhost:5501/getChartConfig/${elementId.replace('#', '')}`

    fetch(apiURL)
        .then(response => response.json())
        .then(chartConfigData => {
            console.log(chartConfigData)
            console.log(chartConfigData.margin.top)
            console.log(chartConfigData.x.type)
        });

};

/*
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
*/


loadExampleChart();
loadCurEstIncomeData();
loadCurEstIncomeDataTable();
//loadCurEstIncomeAvg();
loadHistEstIncomeAvg();