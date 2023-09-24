function loadBalanceData() {
    getCurrentBalanceData()
    .then(curAcctBalanceData => {

        //Aggregate & Display Total Balance
        const totalBalance = curAcctBalanceData.reduce((sum, record) => sum + record.acct_bal, 0);
        const formattedBalance = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(totalBalance);
        const balanceTotalTextElement = document.getElementById('balanceTotalCardText');
        balanceTotalTextElement.textContent = formattedBalance;
    });
};

function loadBalanceHistChart() {

    const elementId = '#balanceChartContent'
    const dataSourceURL = "http://localhost:5501/acctBalHist"

    createChart(elementId, dataSourceURL);
};

loadBalanceHistChart();
loadBalanceData();