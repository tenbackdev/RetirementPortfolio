import {accountMap, currentAccountMap, clearAccountMap, clearCurrentAccountMap, fetchAccountData, fetchCurrentAccountData, loadAccountData, loadCurrentAccountData, retrieveAccountData, retrieveCurrentAccountData} from './js/main.js';

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

async function main() {
    localStorage.removeItem('accountData');
    localStorage.removeItem('currentAccountData')
    clearAccountMap();
    clearCurrentAccountMap();
    retrieveAccountData();
    retrieveCurrentAccountData();
    
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


    updateStarterPortVal()
    updateChartPortVal()
    

}

function updateStarterPortVal() {
    const h2Tag = document.getElementById('portValText');

    const portVal = Object.values(currentAccountMap.accounts)
        .flatMap(account => account.snapshots)
        .reduce((totalBalance, snapshot) => totalBalance += snapshot.balance, 0);

    h2Tag.textContent = `${currencyFormatCents.format(portVal)}`
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



