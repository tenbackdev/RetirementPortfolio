const dateFormat = new Date().toISOString().split('T')[0]
const currencyFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})

//Serves As The Main Function To Go Get The Contents Of curEstInc Endpoint
function getCurEstIncTickerPayDt() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5501/curEstIncTickerPayDt')
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}

//Serves As The Main Function To Go Get The Contents Of curEstIncAvg Endpoint
function getCurEstIncAvg() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5501/curEstIncAvg')
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}

// Function to filter keys based on specified array
function filterKeys(data, filterArray) {
    return data.map(obj => {
      const filteredObj = {};
      Object.keys(obj).forEach(key => {
        if (filterArray.includes(key)) {
          filteredObj[key] = obj[key];
        }
      });
      return filteredObj;
    });
  }
  
function createHtmlTable(tblData) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    
    //Create the Table Header
    const headers = Object.keys(tblData[0]);
    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    //Create Table Rows
    let isAltRow = 0
    tblData.forEach(item => {
        const row = document.createElement("tr");
        if (isAltRow === 0) {
            row.classList.add("mainRow");
            isAltRow = 1;
        } else {
            row.classList.add("altRow");
            isAltRow = 0;
        }
        headers.forEach(header => {
            const cell = document.createElement("td");
            cell.textContent = item[header];
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function loadCurEstIncomeData() {
    getCurEstIncTickerPayDt()
        .then(curEstIncData => {



            //Load Detail Table of All Estimated Income Pay Dates / Tickers
            const keysOfInterest = ["acct_nm", "inst_nm", "ticker", "ticker_nm", "pay_dt", "inc_status", "inc_freq", "inc_qty", "inc_rate", "inc_amt"]
            curEstIncDataFiltered = filterKeys(curEstIncData, keysOfInterest)
            curEstIncDataFiltered.sort((a, b) => new Date(a.pay_dt) - new Date(b.pay_dt));
            const estIncTable = createHtmlTable(curEstIncDataFiltered);
            const estIncTableContainer = document.getElementById("estimatedIncomeTableContainer")
            estIncTableContainer.appendChild(estIncTable);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function loadCurEstIncomeAvg() {
    getCurEstIncAvg()
        .then(curEstIncAvgData => {
            //Load values into Summary Card for Total / Avg Income Rates
            const annualEstInc = document.getElementById("annualEstInc");
            const monthlyAvgInc = document.getElementById("monthlyAvgInc");
            const dlyAvgInc = document.getElementById("dlyAvgInc");
            annualEstInc.textContent = currencyFormat.format(curEstIncAvgData[0].inc_amt_annual);
            monthlyAvgInc.textContent = currencyFormat.format(curEstIncAvgData[0].inc_amt_mnly);
            dlyAvgInc.textContent = currencyFormat.format(curEstIncAvgData[0].inc_amt_dly);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

loadCurEstIncomeData();
loadCurEstIncomeAvg();