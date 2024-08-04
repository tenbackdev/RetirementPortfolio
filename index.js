import {accountMap, currentAccountMap, incomeMap, clearAccountMap, clearCurrentAccountMap, fetchAccountData, fetchCurrentAccountData, fetchIncomeData, getIncomeStatuses, loadAccountData, loadCurrentAccountData, loadIncomeData, retrieveAccountData, retrieveCurrentAccountData, retrieveIncomeData, formatterCents, formatterDollars, formatterDateMMYYYY, formatterDateMMDDYYYY} from './js/main.js';

async function main() {
    localStorage.removeItem('accountData');
    localStorage.removeItem('currentAccountData');
    localStorage.removeItem('incomeData');
    clearAccountMap();
    clearCurrentAccountMap();
    retrieveAccountData();
    retrieveCurrentAccountData();
    retrieveIncomeData();

    //avoid an api call / loading data if data already exists
    if (Object.keys(accountMap.accounts).length === 0) {
        const accountData = await fetchAccountData();
        loadAccountData(accountData);
    }
    //console.log(accountMap);

    //avoid an api call / loading data if data already exists
    if (Object.keys(currentAccountMap.accounts).length === 0) {
        const currentAccountData = await fetchCurrentAccountData();
        loadCurrentAccountData(currentAccountData);
    }
    //console.log(currentAccountMap);

    //avoid an api call / loading data if data already exists
    if (Object.keys(incomeMap.getAllByTicker()).length === 0) {
        const incomeData = await fetchIncomeData();

        // Have the data coming back in a single output
        // Next step is to load the data just like Accounts were
        //console.log(incomeData);
        loadIncomeData(incomeData);
    }

    updateStarterPortVal();
    updateStarterEstIncVal();
    updateStarterRecIncVal();
    updateStarterNextIncVal();
    updateChartPortVal();
    updateChartIncTimeSrsStackBar();
    updateChartEstIncDoughnut();
}

function updateStarterPortVal() {
    const h2Tag = document.getElementById('portValText');

    const portVal = Object.values(currentAccountMap.accounts)
        .flatMap(account => account.snapshots)
        .reduce((totalBalance, snapshot) => totalBalance += snapshot.balance, 0);

    h2Tag.textContent = `${formatterCents.format(portVal)}`
}

function updateStarterEstIncVal() {
    const h2Tag = document.getElementById('estIncText');
    const estIncTot = Array.from(incomeMap.byStatus).reduce((estIncVal, [key, array]) => {
        if (['Announced', 'Estimated'].includes(key)) {
            const arraySum = array.reduce((sum, obj) => sum + (obj.incomeAmount || 0), 0)
            return estIncVal + arraySum
        }
        return estIncVal
    }, 0);
    h2Tag.textContent = `${formatterCents.format(estIncTot)}`
}

function updateStarterRecIncVal() {
    const h2Tag = document.getElementById('recIncText');
    const recIncTot = Array.from(incomeMap.byStatus).reduce((recIncVal, [key, array]) => {
        if (['Received'].includes(key)) {
            const arraySum = array.reduce((sum, obj) => sum + (obj.incomeRecent === true ? obj.incomeAmount : 0 || 0), 0)
            return recIncVal + arraySum
        }
        return recIncVal
    }, 0);
    h2Tag.textContent = `${formatterCents.format(recIncTot)}`
}

function updateStarterNextIncVal() {
    const h2Tag = document.getElementById('nextIncText');
    const pTag = document.getElementById('nextIncLabel');

    const today = new Date();
    const dates = Array.from(incomeMap.byDate.keys()).map(dateStr => new Date(dateStr));
    dates.sort((a, b) => a - b);
    const nextDate = dates.find(date => date >= today);

    const incomesForDate = incomeMap.byDate.get(formatterDateMMDDYYYY.formatDate(nextDate, 'YYYYMMDD', '-'));
    const totalIncomeAmount = incomesForDate.reduce((sum, income) => sum + income.incomeAmount, 0);
    const uniqueTickers = [...new Set(incomesForDate.map(income => income.ticker.tickerSymbol))].join(', ')
    h2Tag.textContent = `${formatterCents.format(totalIncomeAmount)}`
    pTag.textContent = `Next Income - ${formatterDateMMDDYYYY.formatDate(nextDate, 'MMDD', '/')} (${uniqueTickers})`
}

function updateChartPortVal() {
    const pvc = document.getElementById("port-val-chart");

    //Get the full list of unique x-axis values
    const snapshotDates = Array.from(
        new Set(
            Object.values(accountMap.accounts)
            .flatMap(account => account.snapshots)
            .map(snapshot => snapshot.snapshotDate)
        )
    );

    const balancesBySnapshotDate = Object.values(accountMap.accounts)
            .flatMap(account => account.snapshots)
            .reduce((acc, snapshot) => {
                const date = snapshot.snapshotDate;
                if(!acc[date]) {
                    acc[date] = 0;
                }
                acc[date] += snapshot.balance;
                return acc;
            }, {});

    new Chart(pvc, {
        type: 'line',
        data : {
            labels: snapshotDates, //should this be able to be keys of balancesBySnapshotDate?
            datasets: [{
                data: Object.values(balancesBySnapshotDate),
                borderWidth: 1,
                pointRadius: 1,
                tension: 0.1,
                pointHitRadius: 20,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            const origLabel = tooltipItems[0].chart.data.labels[index];
                            return formatterDateMMDDYYYY.formatDate(origLabel);
                        },
                        label: function(tooltipItem) {
                            const value = tooltipItem.raw;
                            return `${formatterCents.format(value)}`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value, index, values) {
                            return formatterDollars.format(value);
                        }
                    }
                },
                x: {
                    type: 'time',
                    time: {
                        dispalyFormat: 'MM/DD/YYY'
                    }
                }
            }
        }
    })
};

async function updateChartEstIncDoughnut() {
    const pvc = document.getElementById("est-inc-tick-doughnut-chart");

    const tickerIncome = new Map();
    incomeMap.byTicker.forEach((item, keyTicker) => {
        //console.log(keyTicker);
        //console.log(item);
        if(!tickerIncome.get(keyTicker)) {
            tickerIncome.set(keyTicker, 0)
        }
        item.forEach(income => {
            if(income.incomeStatus !== 'Received') {
                //console.log(keyTicker);
                tickerIncome.set(keyTicker, tickerIncome.get(keyTicker) + income.incomeAmount);
            }
        });
    });

    const sortedFilteredMap = new Map(Array.from(tickerIncome.entries())
        .filter(([key, value]) => value > 0)
        .sort((a, b) => b[1] - a[1]));

    new Chart(pvc, {
        type: 'doughnut',
        data: {
            labels: Array.from(sortedFilteredMap.keys()),
            datasets : [{
                data: Array.from(sortedFilteredMap.values()),
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const value = tooltipItem.raw;
                            console.log(tooltipItem);
                            return `${formatterCents.format(value)}`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    })
}

async function updateChartIncTimeSrsStackBar() {
    
    try {
        //Get List Of All Possible Statuses  
        const statusArr = getIncomeStatuses(); //Array.from(incomeMap.byStatus.keys());

        //Forcing Data To Be In Chronological Order
        const incomeDateOrderMap = new Map([...incomeMap.byDate].sort());

        // Create wireframe map for all datasets and data points to be added into
        let incomeStatusTimeSeriesMap = new Map();
        statusArr.forEach(item => incomeStatusTimeSeriesMap.set(item, new Map()));

        //Travese All Dates In Income
        incomeDateOrderMap.forEach((incomeArray, date) => {
            // Create a map just to keep all the income values for all statuses on a given date
            const dateYearMonth = formatterDateMMYYYY.formatDate(new Date(`${date}`), 'YYYYMM', '-'); //formatDateToYYYYMM(date);

            // Add the YYYYMM key to each of the sub maps as needed
            statusArr.forEach(item => {
                if(!incomeStatusTimeSeriesMap.get(item).get(dateYearMonth)) {
                    incomeStatusTimeSeriesMap.get(item).set(dateYearMonth, 0);
                }
            });

            // Traverse All Incomes For Date, And Add To Final Map Appropriately
            incomeArray.forEach(income => {
                const {incomeStatus, incomeAmount} = income;
                incomeStatusTimeSeriesMap.get(incomeStatus).set(dateYearMonth, incomeStatusTimeSeriesMap.get(incomeStatus).get(dateYearMonth) + incomeAmount);
            });
        })

        const pvc = document.getElementById("inc-time-srs-stack-bar-chart");

        console.log(incomeStatusTimeSeriesMap);

        let datasetsConfig = [];
        statusArr.forEach(datasetLabel => {
            //console.log({label: datasetLabel, borderWidth: 1, stack: 'Stack 0', data: Array.from(incomeStatusTimeSeriesMap.get(datasetLabel).values())});
            datasetsConfig.push({label: datasetLabel, borderWidth: 1, stack: 'Stack 0', data: Array.from(incomeStatusTimeSeriesMap.get(datasetLabel).values())} )
        })

        new Chart(pvc, {
            type: 'bar',
            data: {
                labels: Array.from(incomeStatusTimeSeriesMap.get(incomeStatusTimeSeriesMap.keys().next().value).keys()),
                //figure out how to generate all datasets from incomeStatusTimeSeriesMap
                datasets: datasetsConfig
            },
            options: {
                //WORK ON THE CONTENT & TITLE OF THE TOOLTIP
                responsive: true,
                plugins: {
                    legend: {
                        //WHY IS THIS NOT SHOWING UP?
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            title: function(tooltipItems) {
                                const index = tooltipItems[0].dataIndex;
                                const origLabel = tooltipItems[0].chart.data.labels[index];
                                //console.log(origLabel);
                                return formatterDateMMYYYY.formatDate(new Date(`${origLabel}-01`));
                            },
                            label: function(context) {
                                let label = context.dataset.labels || '';
                                let totalRaw = 0;
                                if (label) {
                                    label += ': ';
                                }
                                label += context.raw !== null ? `${context.dataset.label}: ${formatterCents.format(context.raw)}` : `${context.dataset.label}: $0.00`;
                                return label;
                            },
                            afterBody: function(tooltipItems) {
                                let total = 0
                                tooltipItems.forEach(function(tooltipItem) {
                                    total += tooltipItem.raw ? tooltipItem.raw : 0;
                                });
                                return `    Total: ${formatterCents.format(total) }`;
                            }
                        }
                    },
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            dispalyFormat: 'MM/DD/YYY'
                        },
                        grid: {
                            display: false
                        }
                    },
                    /*x: {
                        type: 'time',
                        time: {
                            unit: 'month',
                            parser: 'yyyy-MM',
                            displayFormats: {
                                month: 'yyyy-MM'
                            }
                        },
                        stacked: true,
                    },*/
                    //GET THESE TO SHOW IN DOLLARS
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value, index, values) {
                                return formatterDollars.format(value);
                            }
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }

}

main();



