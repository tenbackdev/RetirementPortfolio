function loadBalanceHistChart() {

    const elementId = '#balanceChartContent'
    const dataSourceURL = "http://localhost:5501/acctBalHist"

    createChart(elementId, dataSourceURL);
};

loadBalanceHistChart();