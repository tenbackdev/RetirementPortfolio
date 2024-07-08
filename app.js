//import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js@4.2.1/dist/chart.esm.js';
//import 'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0';
//import { enUS } from 'date-fns/locale';

//const moment = require("moment");

const apiURLDomainPort = 'http://localhost:5000'
const currencyFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function initialize() {
    updateStarterPortVal();
    updateEstimatedIncomeVal();
    updateRecentIncomeVal();
    updateNextIncomeVal();
    updateChartPortVal();
    updateChartEstIncDoughnut();
}



function updateStarterPortVal() {
    const h2Tag = document.getElementById('portValText');

    fetch(`${apiURLDomainPort}/balance/current`)
        .then(response => response.json())
        .then(data => {
            let totVal = data.reduce((total, item) => total + item.account_balance, 0);
            h2Tag.textContent = `${currencyFormat.format(totVal)}`
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            h2Tag.textContent = 'Failed to load data'
        });
}

function updateEstimatedIncomeVal() {
    const h2Tag = document.getElementById('estIncText');

    fetch(`${apiURLDomainPort}/income/estimated`)
        .then(response => response.json())
        .then(data => {
            let estInc = data.reduce((total, item) => total + item.income_dollars, 0);
            h2Tag.textContent = `${currencyFormat.format(estInc)}`
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            h2Tag.textContent = 'Failed to load data'
        });
}

function updateRecentIncomeVal() {
    const h2Tag = document.getElementById('recIncText');

    fetch(`${apiURLDomainPort}/income/historical`)
        .then(response => response.json())
        .then(data => {
            let recInc = data
                .filter(item => item.income_recent)
                .reduce((total, item) => total + item.income_dollars, 0);
            h2Tag.textContent = `${currencyFormat.format(recInc)}`
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            h2Tag.textContent = 'Failed to load data'
        });
}

function updateNextIncomeVal() {
    const h2Tag = document.getElementById('nextIncText');
    const pTag = document.getElementById('nextIncLabel');

    fetch(`${apiURLDomainPort}/income/next`)
        .then(response => response.json())
        .then(data => {
            //Need to figure out what to do when there are multiple DIVs in one day
            let asOfDate = new Date(data[0].pay_dt)
            let ttlDollars = data.reduce((total, item) => total + item.trans_amt, 0);

            h2Tag.textContent = `${currencyFormat.format(ttlDollars)}`
            pTag.textContent = `Next Income - ${formatDateToMMDD(asOfDate)}`
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            h2Tag.textContent = 'Failed to load data'
        });
}

function updateChartPortVal() {
    const pvc = document.getElementById("port-val-chart");

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
                                    return `${currencyFormat.format(value)}`;
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
                                    return currencyFormat.format(value);
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

    
};

function updateChartEstIncDoughnut() {
    const pvc = document.getElementById("est-inc-tick-doughnut-chart");

    fetch(`${apiURLDomainPort}/income/estimated`)
        .then(response => response.json())
        .then(data => {
            
            const tickIncome = groupAndSumBy(data, 'ticker', 'income_dollars', 'sum', 'ascending');

            new Chart(pvc, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(tickIncome),
                    datasets : [{
                        data: Object.values(tickIncome),
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
                                    return `${currencyFormat.format(value)}`;
                                }
                            }
                        },
                        legend: {
                            display: false
                        }
                    }
                }
            })

        })
        .catch(error => {
            console.error('Error fetching data:', error);
            h2Tag.textContent = 'Failed to load data'
        });

    
};

// Function to group by keyB and sum keyA, then sort by the specified parameter and direction
function groupAndSumBy(data, keyToGroupBy, keyToSum, sortBy = 'none', sortDirection = 'ascending') {
    // Group by keyB and sum keyA
    const groupedData = data.reduce((acc, item) => {
        const group = item[keyToGroupBy];
        const value = item[keyToSum];

        if (!acc[group]) {
            acc[group] = 0;
        }

        acc[group] += value;
        return acc;
    }, {});

    // Convert the grouped data to an array of [key, value] pairs
    const groupedArray = Object.entries(groupedData);

    // Determine the sort order multiplier
    const sortOrder = sortDirection === 'ascending' ? 1 : -1;

    // Sort the array based on the sortBy parameter and sortDirection
    if (sortBy === 'sum') {
        groupedArray.sort((a, b) => (b[1] - a[1]) * sortOrder); // Sort by sum
    } else if (sortBy === 'group') {
        groupedArray.sort((a, b) => a[0].localeCompare(b[0]) * sortOrder); // Sort by group name
    }

    // Convert the sorted array back to an object
    const sortedGroupedData = Object.fromEntries(groupedArray);

    return sortedGroupedData;
}




function generateDateArray(startDate, length, intervalDays) {
    // Convert the start date string to a Date object
    const start = new Date(startDate);

    // Initialize an array to hold the dates
    const datesArray = [];

    // Generate dates
    for (let i = 0; i < length; i++) {
        // Create a new date object for each date in the sequence
        const nextDate = new Date(start);
        nextDate.setDate(start.getDate() + i * intervalDays);

        // Convert the date back to a string (optional)
        datesArray.push(nextDate.toISOString().split('T')[0]);
    }

    return datesArray;
}

function formatDateToMMDDYYYY(date) {
    const myDate = new Date(date);
    console.log(myDate);
    console.log(typeof(myDate));
    const year = myDate.getUTCFullYear();
    const month = myDate.getUTCMonth() + 1; // getMonth() returns month from 0-11
    const day = myDate.getUTCDate();

    // Pad single-digit months and days with leading zero if necessary
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;


    console.log(`${formattedMonth}/${formattedDay}/${year}`)
    return `${formattedMonth}/${formattedDay}/${year}`;
}

function formatDateToMMDD(date) {
    const month = date.getUTCMonth() + 1; // getMonth() returns month from 0-11
    const day = date.getUTCDate();

    // Pad single-digit months and days with leading zero if necessary
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedMonth}/${formattedDay}`;
}

document.addEventListener('DOMContentLoaded', initialize);