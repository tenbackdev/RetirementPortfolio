function loadBalanceData() {
    getCurrentBalanceData()
    .then(curAcctBalanceData => {

        //Aggregate & Display Total Balance
        const totalBalance = curAcctBalanceData.reduce((sum, record) => sum + record.acct_bal, 0);
        const formattedBalance = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(totalBalance);
        const balanceTotalTextElement = document.getElementById('balanceTotalCardText');
        balanceTotalTextElement.textContent = formattedBalance;

        //Determine Relevant Snapshost Date & Display Total Balance Info
        const infoDate = curAcctBalanceData.reduce((max, record) => record.snsh_dt > max ? record.snsh_dt : max, '');
        const formattedInfoDate = new Date(infoDate).toISOString().split('T')[0];
        const balanceAsOfElement = document.getElementById('balanceTotalCardAsOf');
        balanceAsOfElement.textContent = `as of ${formattedInfoDate}`;
    });
};

function loadBalanceHistChart() {

    const elementId = '#balanceChartContent'
    const dataSourceURL = "http://localhost:5501/acctBalHist"

    createChart(elementId, dataSourceURL);
};

loadBalanceHistChart();
loadBalanceData();