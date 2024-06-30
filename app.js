const apiURLDomainPort = 'http://localhost:5000'
const currencyFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function initialize() {
    updateStarterPortVal();
    updateRecentIncomeVal();
    updateNextIncomeVal();
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

function updateRecentIncomeVal() {
    const h2Tag = document.getElementById('recIncText');

    fetch(`${apiURLDomainPort}/income`)
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

    fetch(`${apiURLDomainPort}/income`)
        .then(response => response.json())
        .then(data => {
            console.log(data)

            // WORK IN PROGRESS
            // NOT GETTING THE DATE DESIRED, OR EVEN AT ALL
            // WILL NEED TO DEBUG LATER
            const today = new Date();
            const datesPastToday = data
                .filter(item => new Date(item.income_date) > today)
                .map(item => new Date(item.income_date));
            const firstDatePastToday = datesPastToday.reduce((min, date) => (date < min ? date : min), datesPastToday[0]);
            console.log(firstDatePastToday);

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

document.addEventListener('DOMContentLoaded', initialize);