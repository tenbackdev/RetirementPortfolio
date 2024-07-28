import {accountMap, currentAccountMap, incomeMap, clearAccountMap, clearCurrentAccountMap, fetchAccountData, fetchCurrentAccountData, fetchIncomeData, loadAccountData, loadCurrentAccountData, loadIncomeData, retrieveAccountData, retrieveCurrentAccountData, retrieveIncomeData} from './js/main.js';

/*Will be replacing these with a class.*/
const currencyFormatCents = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const currencyFormatDollars = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

/*Rethink placement of this function as well*/
function formatDateToMMDDYYYY(date) {
    const myDate = new Date(date);
    //console.log(myDate);
    //console.log(typeof(myDate));
    const year = myDate.getUTCFullYear();
    const month = myDate.getUTCMonth() + 1; // getMonth() returns month from 0-11
    const day = myDate.getUTCDate();

    // Pad single-digit months and days with leading zero if necessary
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;


    //console.log(`${formattedMonth}/${formattedDay}/${year}`)
    return `${formattedMonth}/${formattedDay}/${year}`;
}

function formatDateToYYYYMMDD(date) {
    const myDate = new Date(date);
    //console.log(myDate);
    //console.log(typeof(myDate));
    const year = myDate.getUTCFullYear();
    const month = myDate.getUTCMonth() + 1; // getMonth() returns month from 0-11
    const day = myDate.getUTCDate();

    // Pad single-digit months and days with leading zero if necessary
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;


    //console.log(`${year}-${formattedMonth}-${formattedDay}`)
    return `${year}-${formattedMonth}-${formattedDay}`;
}

function formatDateToMMDD(date) {
    const month = date.getUTCMonth() + 1; // getMonth() returns month from 0-11
    const day = date.getUTCDate();

    // Pad single-digit months and days with leading zero if necessary
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedMonth}/${formattedDay}`;
}

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
    

}

function updateStarterPortVal() {
    const h2Tag = document.getElementById('portValText');

    const portVal = Object.values(currentAccountMap.accounts)
        .flatMap(account => account.snapshots)
        .reduce((totalBalance, snapshot) => totalBalance += snapshot.balance, 0);

    h2Tag.textContent = `${currencyFormatCents.format(portVal)}`
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
    h2Tag.textContent = `${currencyFormatCents.format(estIncTot)}`
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
    h2Tag.textContent = `${currencyFormatCents.format(recIncTot)}`
}

function updateStarterNextIncVal() {
    const h2Tag = document.getElementById('nextIncText');
    const pTag = document.getElementById('nextIncLabel');


    // WIP WIP WIP WIP WIP
    const today = new Date();
    const dates = Array.from(incomeMap.byDate.keys()).map(dateStr => new Date(dateStr));
    dates.sort((a, b) => a - b);
    const nextDate = dates.find(date => date >= today);
    //console.log(nextDate);

    const incomesForDate = incomeMap.byDate.get(formatDateToYYYYMMDD(nextDate));
    const totalIncomeAmount = incomesForDate.reduce((sum, income) => sum + income.incomeAmount, 0);
    const uniqueTickers = [...new Set(incomesForDate.map(income => income.ticker.tickerSymbol))].join(', ')
    //console.log(totalIncomeAmount);
    h2Tag.textContent = `${currencyFormatCents.format(totalIncomeAmount)}`
    pTag.textContent = `Next Income - ${formatDateToMMDD(nextDate)} (${uniqueTickers})`
    /*
    const recIncTot = Array.from(incomeMap.byStatus).reduce((recIncVal, [key, array]) => {
        if (['Received'].includes(key)) {
            const arraySum = array.reduce((sum, obj) => sum + (obj.incomeRecent === true ? obj.incomeAmount : 0 || 0), 0)
            return recIncVal + arraySum
        }
        return recIncVal
    }, 0);
    h2Tag.textContent = `${currencyFormatCents.format(recIncTot)}`
    */
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

    

    //console.log(balancesBySnapshotDate);

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
                            return formatDateToMMDDYYYY(origLabel);
                        },
                        label: function(tooltipItem) {
                            const value = tooltipItem.raw;
                            return `${currencyFormatCents.format(value)}`;
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
                            return currencyFormatDollars.format(value);
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

    /*
    fetch(`${apiURLDomainPort}/balance/historical/365`)
        .then(response => response.json())
        .then(data => {
 
            const balanceHistory = groupAndSumBy(data, 'snapshot_date', 'account_balances', 'group', 'ascending');
            const balanceHistoryDates = Object.keys(balanceHistory)

            new Chart(pvc, {
                type: 'line',
                data: {
                    labels: balanceHistoryDates,
                    datasets : [{
                        data: Object.values(balanceHistory),
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
                                    return formatDateToMMDDYYYY(origLabel);
                                },
                                label: function(tooltipItem) {
                                    const value = tooltipItem.raw;
                                    return `${currencyFormatCents.format(value)}`;
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
                                    return currencyFormatDollars.format(value);
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

        })
        .catch(error => {
            console.error('Error fetching data:', error);
            //h2Tag.textContent = 'Failed to load data'
        });

    */
};


main();



