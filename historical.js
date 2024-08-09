import {accountMap, currentAccountMap, incomeMap, clearAccountMap, clearCurrentAccountMap, fetchAccountData, fetchCurrentAccountData, fetchIncomeData, getIncomeStatuses, loadAccountData, loadCurrentAccountData, loadIncomeData, retrieveAccountData, retrieveCurrentAccountData, retrieveIncomeData, formatterCents, formatterDollars, formatterDateMMYYYY, formatterDateMMDDYYYY} from './js/main.js';

async function main() {

    // Revisit to see how the remove / retrieve / load logic can be DRYd up
    // Logic is currently sitting in two different places, and will expand to more locations.
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
    updateStarterPortValDelta();
    updateStarterRetirementVal();
    updateStarterHsaTaxableVal();
    updateChartPortStackVal();

}

function updateStarterPortVal() {
    const h2Tag = document.getElementById('portValText');

    const portVal = Object.values(currentAccountMap.accounts)
        .flatMap(account => account.snapshots)
        .reduce((totalBalance, snapshot) => totalBalance += snapshot.balance, 0);

    h2Tag.textContent = `${formatterCents.format(portVal)}`
}

function updateStarterPortValDelta() {
    const h2Tag = document.getElementById('portValDeltaText');

    // Get the threshold for TTM snapshot date
    let ttmDate = new Date();
    ttmDate.setDate(ttmDate.getDate() - 365);

    // Find the list of snapshot dates
    // Steps involved
    //      1) Flatten the map of all acounts, with nested accountSnapshot objects
    //      2) Extract just the snapshotDate from the flattened results
    //      3) Convert those dates to a string, to allow the Set object to reduce to unique values
    //      4) Convert back to date objects in the array
    //      5) Sort the dates in descending order (important for the .find usage in next steps)
    const snshDates = Array.from(new Set(Object.values(accountMap.accounts)
        .flatMap(account => account.snapshots)
        .map(snapshot => snapshot.snapshotDate.toISOString().split('T')[0])))
        .map(dateString => new Date(dateString))
        .sort((a, b) => b - a);

    // Find the first date that is old enough, otherwise just return the oldest date contained
    let deltaDate = snshDates.find(snshDate => snshDate <= ttmDate);

    if (!deltaDate) {
        deltaDate = snshDates[snshDates.length - 1];
    }
       
    const portValDelta = Object.values(accountMap.accounts)
                .flatMap(account => account.snapshots)
                .filter(item => item.snapshotDate.getTime() === deltaDate.getTime())
                .reduce((totBal, acctSnsh) => totBal += acctSnsh.balance, 0);

    //accountMap.

    // Identify the snapshot date to use across all acounts
    // Get the account balances for the snapshot date identified

    const portValCur = Object.values(currentAccountMap.accounts)
        .flatMap(account => account.snapshots)
        .reduce((totalBalance, snapshot) => totalBalance += snapshot.balance, 0);

    const deltaFinal = portValCur - portValDelta;

    h2Tag.textContent = `${formatterCents.format(deltaFinal)}`
}

function updateStarterRetirementVal() {
    const h2Tag = document.getElementById('retValText');

    const retVal = Object.values(currentAccountMap.accounts)
        .filter(account => account.accountName.includes('401K') ||  account.accountName.includes('IRA'))    
        .flatMap(account => account.snapshots)
        .reduce((totalBalance, snapshot) => totalBalance += snapshot.balance, 0);

    h2Tag.textContent = `${formatterCents.format(retVal)}`
}

function updateStarterHsaTaxableVal() {
    const h2Tag = document.getElementById('hsaTaxableValText');

    const taxVal = Object.values(currentAccountMap.accounts)
        .filter(account => !(account.accountName.includes('401K') || account.accountName.includes('HSA') ||  account.accountName.includes('IRA')))    
        .flatMap(account => account.snapshots)
        .reduce((totalBalance, snapshot) => totalBalance += snapshot.balance, 0);

    const hsaVal = Object.values(currentAccountMap.accounts)
        .filter(account => account.accountName.includes('HSA'))    
        .flatMap(account => account.snapshots)
        .reduce((totalBalance, snapshot) => totalBalance += snapshot.balance, 0);

    h2Tag.textContent = `${formatterCents.format(taxVal)} / ${formatterCents.format(hsaVal)}`
}

async function updateChartPortStackVal() {
    const pvc = document.getElementById("port-val-stacked-chart");


    let portValStackedMap = new Map();
    let portValStackedDates = [...new Set(Object.values(accountMap.accounts)
                                    .flatMap(account => account.snapshots)
                                    .map(snapshot => snapshot.snapshotDate.toISOString().split('T')[0]) 
                                    )]

    //Looping through each account
    Object.keys(accountMap.accounts).forEach(account => {
        let indAccountBalanceMap = new Map();
        portValStackedDates.forEach(xDate => {
            const snapshotArray = accountMap.get(account).snapshots;
            const curDate = new Date(xDate);
            const foundSnapshotIndex = snapshotArray.findIndex(item => {
                const snapDate = new Date(item.snapshotDate)
                return curDate.getTime() === snapDate.getTime();
                })
            //console.log(snapshotArray[foundSnapshotIndex].snapshotDate);

            const snapAcctDate = foundSnapshotIndex !== -1 && snapshotArray[foundSnapshotIndex] 
                ? new Date(snapshotArray[foundSnapshotIndex].snapshotDate).toISOString().split('T')[0]
                : curDate.toISOString().split('T')[0];
            const snapAcctBal = foundSnapshotIndex !== -1 && snapshotArray[foundSnapshotIndex] 
                ? snapshotArray[foundSnapshotIndex].balance
                : null;

            indAccountBalanceMap.set(
                snapAcctDate,
                snapAcctBal
            
                )
            });

            portValStackedMap.set(account, indAccountBalanceMap); 
        /*
        accountMap.get(account).snapshots.forEach(snapshot => {
            indAccountBalanceMap.set(
                    snapshot.snapshotDate.toISOString().split('T')[0],
                    snapshot.balance
                    )
            
        })
        portValStackedMap.set(account, indAccountBalanceMap);
        */
    });

    let datasetsConfig = [];
        Object.keys(accountMap.accounts).forEach(datasetLabel => {
            //console.log({label: datasetLabel, borderWidth: 1, stack: 'Stack 0', data: Array.from(incomeStatusTimeSeriesMap.get(datasetLabel).values())});
            datasetsConfig.push({
                label: datasetLabel,
                borderWidth: 1,
                pointStyle: false,
                pointRadius: 0,
                hoverPointRadius: 0,
                tension: 0.1,
                pointHitRadius: 20, 
                stack: 'Stack 0', 
                fill: 'origin',
                data: Array.from(portValStackedMap.get(datasetLabel).values())} )
        })

    new Chart(pvc, {
        type: 'line',
        data : {
            labels: Array.from(portValStackedMap.get(portValStackedMap.keys().next().value).keys()),
            datasets: datasetsConfig
        },
        options: {
            maintainAspectRation: false,
            autoPadding: true,
            responsive: true,
            plugins:{
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            const origLabel = tooltipItems[0].chart.data.labels[index];
                            console.log(origLabel);
                            return formatterDateMMDDYYYY.formatDate(new Date(`${origLabel}`));
                        },

                        label: function(context) {
                            let label = context.dataset.labels || '';
                            let totalRaw = 0;
                            if (label) {
                                label += ': ';
                            }
                            const acctLabel = context.dataset.label
                            const balLabel =  formatterCents.format(context.raw)
                            const charCount = acctLabel.length + balLabel.length
                            
                            label += context.raw !== null ? `${acctLabel}:${' '.repeat(50-charCount)}${balLabel}` : `${acctLabel}:${' '.repeat(45-charCount)}$0.00`;
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

    //console.log(portValStackedMap);
};

main();

