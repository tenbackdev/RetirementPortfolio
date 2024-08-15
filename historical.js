import {accountMap, currentAccountMap, incomeMap, clearAccountMap, clearCurrentAccountMap, fetchAccountData, fetchCurrentAccountData, fetchIncomeData, getIncomeStatuses, loadAccountData, loadCurrentAccountData, loadIncomeData, retrieveAccountData, retrieveCurrentAccountData, retrieveIncomeData, formatterCents, formatterDollars, formatterDateMMYYYY, formatterDateMMDDYYYY} from './js/main.js';
import Account from './js/account.js';

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
        const accountData = await fetchAccountData(10000);
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
    //const legendPvc = document.getElementById("port-val-stacked-legend");
    //const legendPvc2D = legendPvc.getContext('2d');
    const legendDiv = document.getElementById("port-val-stacked-legend");

    let portValStackedMap = new Map();
    let portValStackedDates = [...new Set(Object.values(accountMap.accounts)
                                    .flatMap(account => account.snapshots)
                                    .map(snapshot => snapshot.snapshotDate.toISOString().split('T')[0]) 
                                    )]

    
    //const allAccountCurrentValueArray = 
    
    const accountOrderArray = Object.keys(accountMap.accounts).map(account => {
        return {accountName: account, accountBalance: accountMap.get(account).getCurrentBalance()}
        })
        .sort((a, b) => b.accountBalance - a.accountBalance);
    
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
        accountOrderArray.forEach(account => { 
            const datasetLabel = account.accountName;
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

    let myChart = new Chart(pvc, {
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
                    bodyFontFamily: '"Courier New", monospace',
                    intersect: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            const origLabel = tooltipItems[0].chart.data.labels[index];
                            return formatterDateMMDDYYYY.formatDate(new Date(`${origLabel}`));
                        },

                        label: function(context) {
                            const chart = context.chart;
                            //const datasetIndex = context.datasetIndex;
                            const datasets = chart.data.datasets;

                            //chart.options.tooltips.bodyFontFamily = '"Courier New", monospace';

                            let maxAccountNameLength = 0;
                            let maxBalanceLength = 0;

                            datasets.forEach(dataset => {
                                if (!chart.getDatasetMeta(context.datasetIndex).hidden) {
                                    const accountName = dataset.label;
                                    const balance = formatterCents.format(context.raw);

                                    maxAccountNameLength = Math.max(maxAccountNameLength, accountName.length);
                                    maxBalanceLength = Math.max(maxBalanceLength, balance.length);
                                }
                            });

                            console.log(maxAccountNameLength);
                            console.log(maxBalanceLength);

                            // Format Each Label
                            const accountName = context.dataset.label;
                            const balance = formatterCents.format(context.raw);


                            // Add padding based on the maximum lengths
                            const paddedAccountName = accountName.padEnd(maxAccountNameLength, ' ');
                            const paddedBalance = balance.padStart(maxBalanceLength, ' ');

                            console.log(`length: ${paddedAccountName.length}, |${paddedAccountName}|`)

                            return `${paddedAccountName}:${paddedBalance}`
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
                /*
                // Tooltip was failing from a presentation standpoint, trying a different way
                tooltip: {
                    enabled: false, // Disable default tooltip
                    external: function(context) {
                        let tooltip = document.getElementById('port-val-stacked-chart-tooltip');
                        let tooltipModel = context.tooltip;

                        console.log(tooltipModel);

                        if (tooltipModel.opacity === 0) {
                            tooltip.style.opacity = 0;
                            return;
                        }

                        let bodyLines = tooltipModel.body.map(bodyItem => {
                            return bodyItem.lines;
                        });

                        tooltip.innerHTML = '';

                        bodyLines.forEach(function(body, i) {
                            let leftText = `${body[0].split(':')[0].trim()}:` 
                            let rightText = `${body[0].split(':')[1].trim()}` 

                            var row = document.createElement('div');
                            row.style.display = 'flex';
                            row.style.justifyContent = 'space-between';

                            var leftSpan = document.createElement('span');
                            leftSpan.textContent = leftText;
                            leftSpan.style.flex = '1 1 auto';
                            leftSpan.style.textAlign = 'left';

                            var rightSpan = document.createElement('span');
                            rightSpan.textContent = rightText;
                            rightSpan.style.flex = '1 1 auto';
                            rightSpan.style.textAlign = 'right';

                            row.appendChild(leftSpan);
                            row.appendChild(rightSpan);

                            tooltip.appendChild(row);
                        });
                        var position = context.chart.canvas.getBoundingClientRect();

                        tooltip.style.opacity = 1;
                        tooltip.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                        tooltip.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                        tooltip.style.display = 'block';
                    }
                }
                */
                /*
                // Commenting this out to test using an external function to create tooltip content.
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            const origLabel = tooltipItems[0].chart.data.labels[index];
                            return formatterDateMMDDYYYY.formatDate(new Date(`${origLabel}`));
                        },

                        label: function(context) {
                            // Get Chart Dataset Meta (Don't Display Hidden Values)
                            const chart = context.chart;
                            const datasetIndex = context.datasetIndex;
                            const meta = chart.getDatasetMeta(datasetIndex);

                            if (!meta.hidden) {
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
                            }


                        },
                        afterBody: function(tooltipItems) {
                            let total = 0
                            tooltipItems.forEach(function(tooltipItem) {
                                total += tooltipItem.raw ? tooltipItem.raw : 0;
                            });
                            return `    Total: ${formatterCents.format(total) }`;
                        }
                    }
                }*/
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            return formatterDollars.format(value);
                        }
                    },
                    grid: {
                        z: 12
                    } 
                },
                x: {
                    type: 'time',
                    time: {
                        dispalyFormat: 'MM/DD/YYY'
                    },
                    grid: {
                        z: 12
                    } 
                }
            },
        }


    })

    function setAlphaForDatasets(datasets, alpha) {
        datasets.forEach(function(dataset) {
            dataset.backgroundColor = dataset.backgroundColor.replace(/rgba\((\d+), (\d+), (\d+), [^)]+\)/, `rgba($1, $2, $3, ${alpha})`);
            dataset.borderColor = dataset.borderColor.replace(/rgba\((\d+), (\d+), (\d+), [^)]+\)/, `rgba($1, $2, $3, ${alpha})`);
        })
    }

    setAlphaForDatasets(myChart.data.datasets, 1);

    function createLegend(chart, legend) {
        chart.legend.legendItems.forEach((legendItem, index) => {
            let button = document.createElement('button');
            button.textContent = legendItem.text;
            button.setAttribute('data-id', index)
            button.style.backgroundColor = legendItem.fillStyle;
            button.style.width = '90% ';

            let buttonOnly = document.createElement('buttonOnly')
            buttonOnly.textContent = 'Only'
            buttonOnly.setAttribute('data-id', index);
            buttonOnly.style.backgroundColor = legendItem.fillStyle;
            buttonOnly.style.textAlign = 'center';
            buttonOnly.style.width = '90% ';


            button.addEventListener('click', (event) => {
                const datasetIndex = event.target.getAttribute('data-id');
                const meta = chart.getDatasetMeta(datasetIndex);
                meta.hidden = meta.hidden === null ? !chart.data.datasets[datasetIndex].hidden : null;
                chart.update();
            })

            buttonOnly.addEventListener('click', (event) => {
                const datasetIndex = event.target.getAttribute('data-id');

                chart.legend.legendItems.forEach((legendItem, index) => {
                    if (index != datasetIndex) {
                        const meta = chart.getDatasetMeta(index);
                        meta.hidden = meta.hidden === null ? !chart.data.datasets[datasetIndex].hidden : null;
                        
                    }
                })
                chart.update();
            })
                
            legend.appendChild(button);
            legend.appendChild(buttonOnly);
        })
    }

    createLegend(myChart, legendDiv);
    /* //ATTEMPT 2
    function drawCustomLegend(chart, legend) {
        legend.clearRect(0, 0, legend.canvas.width, legend.canvas.height);

        chart.legend.legendItems.forEach(function(legendItem, index) {
            const x = 5;
            const y = 0 + (index * 15);

            // Draw Legend Box
            legend.fillStyle = legendItem.fillStyle;
            legend.fillRect(x, y, 200, 12);

            // Draw Legend Text
            legend.fillStyle = 'black'
            legend.textAlignt = 'center';
            legend.textBaseline = 'middle';
            legend.fillText(legendItem.text, x + 20, y + 6);

            console.log(legendItem.text);
        })
        
          ///ATTEMP 1
        const datasets = chart.data.datasets;
        //const labels = chart.data.labels;

        legend.font = '14px'
        const lineHeight = 10;
        const lineGap = 4;

        datasets.forEach((dataset, index) => {
            const color = dataset.backgroundColor;
            const label = dataset.label;

            // Color Box
            legend.fillStyle = color;
            legend.fillRect(10, index * (lineHeight + lineGap), 250, lineHeight);

            // Label Text
            legend.fillStyle = "#000";
            legend.fillText(label, 50, 10 + index * (lineHeight + lineGap));
        });
        
    }
    */

    //drawCustomLegend(myChart, legendPvc2D);
    /*
    // ATTEMPT #2
    legendPvc.addEventListener('click', function(event) {
        
        const rect = legendPvc2D.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        myChart.legend.legendItems.forEach(function(legendItem, index) {
            const x = 5;
            const y = 0 + (index * 15);
            if (mouseX >= x && mouseX <= x + 200 && mouseY >= y && mouseY <= y + 12) {
                const meta = myChart.getDatasetMeta(index);
                console.log(meta);
                meta.hidden = meta.hidden === null ? !myChart.data.datasets[index].hidden : null;
                myChart.update();
                drawCustomLegend(myChart, legendPvc2D);
            }
        })
    });
    */

    

    //console.log(portValStackedMap);
};

main();

