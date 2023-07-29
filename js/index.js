//Serves As The Main Function To Go Get The Contents Of curAcctBal Endpoint
function getCurrentBalanceData() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5501/curAcctBal')
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
function getAccountBalanceHist() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5501/acctBalHist')
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
        fetch('http://localhost:5501/recInc')
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
        
        /*
        //Aggregate Data & Sort By Inst
        const instBalanceGroupData = d3.group(curAcctBalanceData, d => d.inst_nm);
        const instBalanceAggData = Array.from(instBalanceGroupData, ([inst_nm, values]) => ({
            inst_nm
            , inst_bal: d3.sum(values, d => d.acct_bal)
        }))
        instBalanceAggData.sort((a, b) => b.inst_bal - a.inst_bal);

        balanceHoldingsChartContainer = document.getElementById('balanceHoldingsChartContainer');
        const donutChartWidth = balanceHoldingsChartContainer.offsetWidth;
        const donutChartContainerHeight = balanceHoldingsChartContainer.offsetHeight;
        const donutChartHeight = donutChartContainerHeight * 0.9;
        const donutChartRadius = Math.min(donutChartWidth, donutChartHeight) / 2;

        const svgBalanceChart = d3.select('#balanceHoldingsChartContainer')
            .append("svg")
            .attr("width", donutChartWidth)
            .attr("height", donutChartContainerHeight)
            .append("g")
            .attr("transform", `translate(${donutChartWidth / 2}, ${donutChartContainerHeight / 2})`);

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
            */
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

function loadBalanceHistData() {
    getAccountBalanceHist()
        .then(acctBalHistData => {

            //get the data by snapshot and prepare for individual bars
            const snshBalHistData = d3.group(acctBalHistData, d => d.snsh_dt)
            const snshBalHistTotals = Array.from(snshBalHistData, ([snsh_dt, values]) => ({
                snsh_dt,
                snsh_bal: d3.sum(values, d => d.acct_bal)
            }))
            snshBalHistTotals.sort((a, b) => a.snsh_dt - b.snsh_dt);

            balanceTimeChartContainer = document.getElementById('balanceTimeChartContainer');
            const balanceChartWidth = balanceTimeChartContainer.offsetWidth;
            const balanceChartHeight = balanceTimeChartContainer.offsetHeight * 0.80;
            const balanceChartMargin = {top: 20, right: 20, bottom: 20, left: 20}

            const xScale = d3.scaleBand()
                .domain(snshBalHistTotals.map(data => new Date(data.snsh_dt).toISOString().split('T')[0]))
                .range([balanceChartMargin.left, balanceChartWidth - balanceChartMargin.right])
                .padding(0.1);

            const yScale = d3.scaleLinear()
                .domain([d3.min(snshBalHistTotals, data => data.snsh_bal) * 0.9, d3.max(snshBalHistTotals, data => data.snsh_bal)])
                .range([balanceChartHeight - balanceChartMargin.bottom, balanceChartMargin.top])

            const svg = d3.select('#balanceTimeChartContainer')
                .append("svg")
                .attr("width", balanceChartWidth)
                .attr("heigh", balanceChartHeight)

            svg.selectAll("rect")
                .data(snshBalHistTotals)
                .enter()
                .append("rect")
                .attr("x", data => xScale(new Date(data.snsh_dt).toISOString().split('T')[0]))
                .attr("y", data => yScale(data.snsh_bal))
                .attr("width", xScale.bandwidth())
                .attr("height", data => balanceChartHeight - balanceChartMargin.bottom - yScale(data.snsh_bal))
                .attr("fill", "steelblue");

            //Add Labels on top of each bar
            svg.selectAll("text")
                .data(snshBalHistTotals)
                .enter()
                .append("text")
                .text(data => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.snsh_bal))
                .attr("x", data => xScale(new Date(data.snsh_dt).toISOString().split('T')[0]) + xScale.bandwidth() / 2)
                .attr("y", data => yScale(data.snsh_bal) - 5)
                .attr("text-anchor", "middle")
                .attr("fill", "#fff");
            
            const xAxis = d3.axisBottom(xScale)

            const xAxisGroup = svg.append('g')
                .attr("transform", `translate(0, ${balanceChartHeight})`)
                //.attr("opacity", "0.5");
                
            xAxisGroup.call(xAxis);

            xAxisGroup.selectAll("text")
                .style("text-anchor", "end")
                //.text(data => data.snsh_dt)
                .attr("transform", "rotate(-45)")
                .attr("fill", "#fff")
                .attr("dx", "-0.8em")
                .attr("dy", "0.15em");

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

            console.log('Test')

            //Find The Next Dividend Regardless of How Many Accounts It Spans
            const today = new Date()
            today.setHours(0, 0, 0, 0);
            const formattedToday = today.toISOString()
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

            /*
            //Create the Bar Chart Broken Out By Month
            curEstIncData.sort((a, b) => a.pay_yr_mnth_nbr - b.pay_yr_mnth_nbr)
            const payMonthYearIncome = d3.group(curEstIncData, d => d.pay_mnth_nm_yr_nbr)

            //This is total by month, will need to break down in a further version by hodling.
            const payMonthYearIncomeTotals = Array.from(payMonthYearIncome, ([pay_mnth_nm_yr_nbr, values]) => ({
                pay_mnth_nm_yr_nbr
                , pay_ttl: d3.sum(values, d => d.inc_amt)
              }))

            incomeTimeChartContainer = document.getElementById('incomeTimeChartContainer');
            const incomeChartWidth = incomeTimeChartContainer.offsetWidth;
            const incomeChartHeight = incomeTimeChartContainer.offsetHeight;
            const incomeChartMargin = {top: 20, right: 20, bottom: 20, left: 20}
              */
            const incomeChartMargin = {top: 20, right: 20, bottom: 20, left: 40}
            createBarChart("#incomeTimeChartContainer", curEstIncData, "pay_yr_mnth_nbr", "inc_amt", incomeChartMargin, "inc_status", ['#4682b4', '#4d90c7'])
            /*
            // Set up the scales
            const xScale = d3.scaleBand()
                .domain(payMonthYearIncomeTotals.map(data => data.pay_mnth_nm_yr_nbr))
                .range([incomeChartMargin.left, incomeChartWidth - incomeChartMargin.right])
                .padding(0.1);
            
            const yScale = d3.scaleLinear()
                .domain([0, d3.max(payMonthYearIncomeTotals, data => data.pay_ttl)])
                .range([incomeChartHeight - incomeChartMargin.bottom, incomeChartMargin.top]);

            // Create the SVG element
            const svg = d3.select("#incomeTimeChartContainer")
                .append("svg")
                .attr("width", incomeChartWidth)
                .attr("height", incomeChartHeight);

             // Create the bars
            svg.selectAll("rect")
                .data(payMonthYearIncomeTotals)
                .enter()
                .append("rect")
                .attr("x", data => xScale(data.pay_mnth_nm_yr_nbr))
                .attr("y", data => yScale(data.pay_ttl))
                .attr("width", xScale.bandwidth())
                .attr("height", data => incomeChartHeight - incomeChartMargin.bottom - yScale(data.pay_ttl))
                .attr("fill", "steelblue");
            
            // Add labels
            svg.selectAll("text")
                .data(payMonthYearIncomeTotals)
                .enter()
                .append("text")
                .text(data => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.pay_ttl))
                //.text(data => new Date(data.pay_mnth_nm_yr_nbr).toISOString().slice(0, 10))
                .attr("x", data => xScale(data.pay_mnth_nm_yr_nbr) + xScale.bandwidth() / 2)
                .attr("y", data => yScale(data.pay_ttl) - 5)
                .attr("text-anchor", "middle")
                .attr("fill", "#fff");

            const xAxis = d3.axisBottom(xScale)

            const xAxisGroup = svg.append('g')
                .attr("transform", `translate(0, ${incomeChartHeight - incomeChartMargin.bottom})`)
                .attr("class", "xAxisGroup")
                .attr("stroke", "#fff");
                //.attr("opacity", "0.5");
                
            xAxisGroup.call(xAxis);

            xAxisGroup.selectAll("text")
                .style("text-anchor", "end")
                //.text(data => data.snsh_dt)
                .attr("transform", "rotate(-45)")
                .attr("fill", "#fff")
                .attr("dx", "-0.8em")
                .attr("dy", "0.15em");
            */

        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function init_load() {
    loadBalanceData();
    loadBalanceHistData();
    loadRecentIncomeData();
    loadCurEstIncomeData();
}
 
init_load();

