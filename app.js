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
 
            //Will need to DRY this up by centralizing array of one data point
            let valX = data.map(item => new Date(item.snapshot_date))
            let minX = new Date(Math.min(...valX));
            let maxX = new Date(Math.max(...valX));
            let nbrOfDays = (maxX - minX) / (1000 * 60 * 60 * 24);
            console.log(nbrOfDays/ (1000 * 60 * 60 * 24));

            console.log(generateDateArray(minX, 12, 31));

            //let totVal = data.reduce((total, item) => total + item.account_balance, 0);
            //h2Tag.textContent = `${currencyFormat.format(totVal)}

            new Chart(pvc, {
                type: 'bar',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets : [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
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

function updateChartEstIncDoughnut() {
    const pvc = document.getElementById("est-inc-tick-doughnut-chart");

    fetch(`${apiURLDomainPort}/income/estimated`)
        .then(response => response.json())
        .then(data => {
            
            const tickIncome = groupAndSumBy(data, 'ticker', 'income_dollars');

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

function groupAndSumBy(data, keyToGroupBy, keyToSum) {
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

    // Sort the array by the summed values in descending order
    groupedArray.sort((a, b) => b[1] - a[1]);

    // Convert the sorted array back to an object
    const sortedGroupedData = Object.fromEntries(groupedArray);

    return sortedGroupedData;
};




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

function formatDateToMMDD(date) {
    const month = date.getUTCMonth() + 1; // getMonth() returns month from 0-11
    const day = date.getUTCDate();

    // Pad single-digit months and days with leading zero if necessary
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedMonth}/${formattedDay}`;
}

document.addEventListener('DOMContentLoaded', initialize);