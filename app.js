//import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js@4.2.1/dist/chart.esm.js';
//import 'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0';
//import { enUS } from 'date-fns/locale';

//const moment = require("moment");

const apiURLDomainPort = 'http://localhost:5000'
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

function initialize() {
    updateStarterPortVal();
    updateEstimatedIncomeVal();
    updateRecentIncomeVal();
    updateNextIncomeVal();
    updateChartPortVal();
    updateChartEstIncDoughnut();
    updateChartIncTimeSrsStackBar();
    updateChartPortStackedVal();
}



function updateStarterPortVal() {
    const h2Tag = document.getElementById('portValText');

    fetch(`${apiURLDomainPort}/balance/current`)
        .then(response => response.json())
        .then(data => {
            let totVal = data.reduce((total, item) => total + item.account_balance, 0);
            h2Tag.textContent = `${currencyFormatCents.format(totVal)}`
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
            h2Tag.textContent = `${currencyFormatCents.format(estInc)}`
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
            h2Tag.textContent = `${currencyFormatCents.format(recInc)}`
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

            h2Tag.textContent = `${currencyFormatCents.format(ttlDollars)}`
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

    
};

function updateChartPortStackedVal() {
    const pvc = document.getElementById("port-val-stacked-chart");

    fetch(`${apiURLDomainPort}/balance/historical/365`)
        .then(response => response.json())
        .then(data => {
 
            console.log('hello');
            const accounts = [...new Set(data.map(item => item['account_name']))]

            accounts.forEach(account => {
                let accountData = data.filter(item => item['account_name'] === account);
                console.log(accountData);
            }); 

            //need to figure out how to stack them in the right order
                //how to process data sets in the order of current balance
            //need to create list of labels (aka snapshot_dates)
            //need to figure out how to have tooltip show every account balance
            //after getting MVP, figure out how to DRY this up

            console.log(accounts);

            /*const balanceHistory = groupAndSumBy(data, 'snapshot_date', 'account_balances', 'group', 'ascending');
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
            })*/

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
                                    return `${currencyFormatCents.format(value)}`;
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

async function updateChartIncTimeSrsStackBar() {
    
    try {
        const pvc = document.getElementById("inc-time-srs-stack-bar-chart");

        //force the logic to wait for all data to be made available before proceeding
        const responses = await Promise.all([fetch(`${apiURLDomainPort}/income/historical`), fetch(`${apiURLDomainPort}/income/estimated`)]);
        const histData = await responses[0].json();
        const estData = await responses[1].json();

        const histMonthData = groupAndSumByMonthYear(histData, 'income_date', 'income_dollars', 12)
        const annIncData = groupAndSumByMonthYear(estData.filter(item => item.income_announced === true), 'pay_date', 'income_dollars');
        const estIncData = groupAndSumByMonthYear(estData.filter(item => item.income_announced === false), 'pay_date', 'income_dollars');
        



        const totalData = mergeData(histMonthData, annIncData, estIncData);

        const labels = totalData.map(item => item.month_year);
        //const dataSet = histMonthData.map(item => item.total_income_dollars);

        console.log(estData);
        console.log(annIncData);
        console.log(totalData);

        //WIP Have Just The "Received" Income showing in a "stack" bar chart, need to go get the Announced / Estimated
        //This will need to coordinate the needed null values for each of the months that don't have that category of income.

        new Chart(pvc, {
            type: 'bar',
            data: {
                labels: labels,
                datasets : [{
                    label: 'Received',
                    data: totalData.map(item => item.historical),
                    borderWidth: 1,
                    stack: 'Stack 0'
                },
                {
                    label: 'Announced',
                    data: totalData.map(item => item.announced),
                    borderWidth: 1,
                    stack: 'Stack 0'
                },
                {
                    label: 'Estimated',
                    data: totalData.map(item => item.estimated),
                    borderWidth: 1,
                    stack: 'Stack 0'
                }
                ]
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
                                console.log(origLabel);
                                return formatDateToMMYYYY(origLabel);
                            },
                            label: function(context) {
                                let label = context.dataset.labels || '';
                                let totalRaw = 0;
                                if (label) {
                                    label += ': ';
                                }
                                label += context.raw !== null ? `${context.dataset.label}: ${currencyFormatCents.format(context.raw)}` : `${context.dataset.label}: $0.00`;
                                return label;
                            },
                            afterBody: function(tooltipItems) {
                                let total = 0
                                tooltipItems.forEach(function(tooltipItem) {
                                    total += tooltipItem.raw ? tooltipItem.raw : 0;
                                });
                                return `    Total: ${currencyFormatCents.format(total) }`;
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
                                return currencyFormatDollars.format(value);
                            }
                        }
                    }
                }
            }
        })
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    

}

function mergeData(historicalData, announcedData, estimatedData) {
    // Create a dictionary to store combined data
    const combinedData = {};

    // Function to process each data set
    const processData = (data, key) => {
        data.forEach(item => {
            const monthYear = item.month_year;
            if (!combinedData[monthYear]) {
                combinedData[monthYear] = { month_year: monthYear };
            }
            combinedData[monthYear][key] = item.total_income_dollars;
        });
    };

    // Process each dataset
    processData(historicalData, 'historical');
    processData(announcedData, 'announced');
    processData(estimatedData, 'estimated');

    // Convert combinedData dictionary to an array and sort it chronologically
    const result = Object.values(combinedData).sort((a, b) => new Date(a.month_year) - new Date(b.month_year));

    // Ensure each entry has all keys, defaulting to null if missing
    result.forEach(item => {
        item.historical = item.historical || null;
        item.announced = item.announced || null;
        item.estimated = item.estimated || null;
    });

    return result;
}

function groupAndSumByMonthYear(data, dateKey, sumKey, recentMonths = null) {
    const groupedData = {};

    data.forEach(item => {
        const date = new Date(item[dateKey]);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1; // Months are 0-based in JavaScript
        const key = `${year}-${month.toString().padStart(2, '0')}`;

        if (!groupedData[key]) {
            groupedData[key] = 0;
        }
        groupedData[key] += item[sumKey];
    });

    let result = Object.keys(groupedData).map(key => ({
        month_year: key,
        total_income_dollars: groupedData[key]
    }));

    // Sort results in chronological order
    result.sort((a, b) => new Date(a.month_year) - new Date(b.month_year));

    // If recentMonths is specified, slice the array to return only the most recent months
    if (recentMonths !== null) {
        result = result.slice(-recentMonths);
    }

    return result;
}

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

function formatDateToMMYYYY(date) {
    const myDate = new Date(date);
    const month = myDate.getUTCMonth() + 1; // getMonth() returns month from 0-11
    const year = myDate.getUTCFullYear();

    // Pad single-digit months and days with leading zero if necessary
    const formattedMonth = month < 10 ? `0${month}` : month;
    //const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedMonth}/${year}`;
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