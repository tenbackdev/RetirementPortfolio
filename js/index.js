function initialize() {
    //console.log('Hi')

    //Load Charts
    //Balance Hitory
    createChart('#acctBalHistStackedLine', `${apiURLDomainPort}/acctBalHist`);
    createChart('#incomeStackedBarChart', `${apiURLDomainPort}/acctBalHist`); //NEED TO UPDATE TO FINAL ENDPOINT
    loadBalanceData();
    loadBalanceHistData();
    loadRecentIncomeData();
    loadCurEstIncomeData();
}

document.addEventListener('DOMContentLoaded', initialize);





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

//Serves As The Main Function To Go Get The Contents Of recInc Endpoint
function getRecentIncome() {
    return new Promise((resolve, reject) => {
        fetch(`${apiURLDomainPort}/recInc`)
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
        fetch(`${apiURLDomainPort}/curEstInc`)
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}

function loadBalanceData() {
    getCurrentBalanceData()
    .then(curAcctBalanceData => {

        //Aggregate & Display Total Balance
        const totalBalance = curAcctBalanceData.reduce((sum, record) => sum + record.acct_bal, 0);
        const formattedBalance = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(totalBalance);
        const balanceTotalTextElement = document.getElementById('balanceTotalText');
        balanceTotalTextElement.textContent = formattedBalance;

        //Determine Relevant Snapshost Date & Display Total Balance Info
        const infoDate = curAcctBalanceData.reduce((max, record) => record.snsh_dt > max ? record.snsh_dt : max, '');
        const formattedInfoDate = new Date(infoDate).toISOString().split('T')[0];
        const balanceAsOfElement = document.getElementById('balanceAsOf');
        balanceAsOfElement.textContent = `as of ${formattedInfoDate}`;
        
        //Aggregate Data & Sort By Inst
        const instBalanceGroupData = d3.group(curAcctBalanceData, d => d.inst_nm);
        const instBalanceAggData = Array.from(instBalanceGroupData, ([inst_nm, values]) => ({
            inst_nm
            , inst_bal: d3.sum(values, d => d.acct_bal)
        }))
        instBalanceAggData.sort((a, b) => b.inst_bal - a.inst_bal);

        balanceHoldingsChartContainer = document.getElementById('balanceBreakoutChartContent');
        const donutChartMargin = {top: 20, right: 20, bottom: 20, left: 20}
        const donutChartWidth = balanceHoldingsChartContainer.offsetWidth - donutChartMargin.left - donutChartMargin.right;
        const donutChartContainerHeight = balanceHoldingsChartContainer.offsetHeight - donutChartMargin.top - donutChartMargin.bottom;
        const donutChartHeight = donutChartContainerHeight * 0.9;
        const donutChartRadius = Math.min(donutChartWidth, donutChartHeight) / 2;

        const svgBalanceChart = d3.select('#balanceBreakoutChartContent')
            .append("svg")
            .attr("width", donutChartWidth)
            .attr("height", donutChartContainerHeight)
            .append("g")
            .attr("transform", `translate(${(donutChartWidth / 2)}, ${donutChartContainerHeight / 2})`);

        const pie = d3.pie()
            .value(d => d.inst_bal);

        const arc = d3.arc()
            .innerRadius(donutChartRadius * 0.2)
            .outerRadius(donutChartRadius);

        const arcs = svgBalanceChart.selectAll("arc")
            .data(pie(instBalanceAggData))
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
            .text(d => `${d.data.inst_nm}: ${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(d.data.inst_bal)}`)
            .style("top", d => `${arc.centroid(d)[1]}px`)
            .style("left", d => `${arc.centroid(d)[0]}px`);
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

function loadBalanceHistData() {
    getAccountBalanceHist()
        .then(acctBalHistData => {

            //balanceChartContent
            const balanceHistChartMargin = {top: 25, right: 20, bottom: 30, left: 60}
            createBarChart("#balanceChartContent", acctBalHistData, "snsh_dt", "acct_bal", balanceHistChartMargin
                , ["#577084", "#8EABA2", "#DECCA8", "#E59C6A", "#DC475C"], "inst_nm")
            

        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function loadRecentIncomeData() {
    getRecentIncome()
        .then(recIncData => {
            //Update the Recent Income Total in the Summary
            const totalIncome = recIncData.reduce((sum, record) => sum + record.trans_amt, 0);
            const formattedTotalIncome = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(totalIncome);
            const incomeRecentTextElement = document.getElementById('incomeRecentText');
            incomeRecentTextElement.textContent = formattedTotalIncome;

            //Update the Information for the Summary
            const incomeAsOfDate = recIncData.reduce((max, record) => record.trans_dt > max ? record.trans_dt : max, '')
            const formattedIncomeAsOfDate = new Date(incomeAsOfDate).toISOString().split('T')[0]
            const incomeRecentAsOfElement = document.getElementById('incomeRecentAsOf');
            incomeRecentAsOfElement.textContent = `as of ${formattedIncomeAsOfDate}`;
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
            const incomeEstimateTextElement = document.getElementById('incomeEstimateText');
            incomeEstimateTextElement.textContent = formattedEstimatedTotalIncome;

            //Update the Information for the Summary
            const estimatedIncomeAsOfDate = curEstIncData.reduce((max, record) => record.snsh_dt > max ? record.snsh_dt : max, '')
            const formattedEstimatedIncomeAsOfDate = new Date(estimatedIncomeAsOfDate).toISOString().split('T')[0]
            const incomeEstimateAsOfElement = document.getElementById('incomeEstimateAsOf');
            incomeEstimateAsOfElement.textContent = `as of ${formattedEstimatedIncomeAsOfDate}`;

            //Find The Next Dividend Regardless of How Many Accounts It Spans
            var yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            yesterday.setHours(0, 0, 0, 0);
            const formattedToday = yesterday.toISOString()
            const futurePayDateData = curEstIncData.filter(item => item.pay_dt >= formattedToday)
            const nextPayDate = futurePayDateData.reduce((min, record) => record.pay_dt < min ? record.pay_dt : min, '9999-12-31')
            const nextDividendData = futurePayDateData.filter(item => item.pay_dt === nextPayDate)
            const nextDividendTickerData = d3.group(nextDividendData, d => d.ticker)
            const nextDividendAggData = Array.from(nextDividendTickerData, ([ticker, values]) => ({
                ticker
                , ticker_amt: d3.sum(values, d => d.inc_amt)
            }));
            const currencyFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})
            const nextDividendDetail = nextDividendAggData.map(item => `${item.ticker}: ${currencyFormat.format(item.ticker_amt)}`).join(", ");
            const formattedNextPayDate = new Date(nextPayDate).toISOString().split('T')[0]
            const nextIncomeTextElement = document.getElementById('nextIncomeText');
            nextIncomeTextElement.textContent = nextDividendDetail;
            const nextIncomeAsOfElement = document.getElementById('nextIncomeAsOf');
            nextIncomeAsOfElement.textContent = `on ${formattedNextPayDate}`;

            const incomeChartMargin = {top: 20, right: 20, bottom: 20, left: 40}
            createBarChart("#incomeChartContent", curEstIncData, "pay_yr_mnth_nbr", "inc_amt", incomeChartMargin, ['#4682b4', '#4d90c7'], "inc_status")
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

/*
function init_load() {
    loadBalanceData();
    loadBalanceHistData();
    loadRecentIncomeData();
    loadCurEstIncomeData();
}
 
init_load();
*/
