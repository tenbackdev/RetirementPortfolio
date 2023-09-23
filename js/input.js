function acctBalanceSnshSubmit() {
    
    const acctIdInputValue = document.getElementById('acctSelect').value;
    const snshDtInputValue = document.getElementById('snapshotDateInput').value;
    const acctBalInputValue = document.getElementById('balanceValue').value;

    const postData = {
        acct_id: acctIdInputValue
        , snsh_dt: snshDtInputValue
        , acct_bal: acctBalInputValue
    }

    axios.post('http://localhost:5501/acctBalSnshInput', postData)
        .then(response => {
            console.log(response.data.message);
            alert(`${response.data.message}`)
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        })
}

function transactionSubmit() {
    
    console.log('Confirming Call')

    const transDtInputValue = document.getElementById('transDateInput').value;
    const acctIdInputValue = document.getElementById('transAcctSelect').value;
    const tickerInputValue = document.getElementById('tickerSelect').value;
    const transTypeInputValue = document.getElementById('transTypeSelect').value;
    const transPriceInputValue = document.getElementById('transPrice').value;
    const transQtyInputValue = document.getElementById('transQty').value;
    const transAmtInputValue = document.getElementById('transAmt').value;
    const transCommInputValue = document.getElementById('transComm').value;
    
    
    const postData = {
        trans_dt: transDtInputValue
        , acct_id: acctIdInputValue
        , ticker: tickerInputValue
        , trans_type: transTypeInputValue
        , trans_price: transPriceInputValue
        , trans_qty: transQtyInputValue
        , trans_amt: transAmtInputValue
        , trans_comm: transCommInputValue
    }

    console.log(transDtInputValue, acctIdInputValue, tickerInputValue, transTypeInputValue
        , transPriceInputValue, transQtyInputValue, transAmtInputValue, transCommInputValue);
    
    axios.post('http://localhost:5501/transInput', postData)
        .then(response => {
            console.log(response.data.message);
            alert('Transaction Submitted!')
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        })
}

function getCurrentDate() {
    let now = new Date()
    return `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${('0' + now.getDate()).slice(-2)}`
}

function setDefaultSnapshotDate(elemId) {
    var snshDefaultDate = getCurrentDate()
    var snshDtInp = document.getElementById(elemId)
    snshDtInp.value = snshDefaultDate;
}

function initAccountBalanceSnapshotInput() {
    //Add Event Listeners
    var acctBalanceSnshBtn = document.getElementById('acctBalanceSnshBtn');
    acctBalanceSnshBtn.addEventListener('click', acctBalanceSnshSubmit)

    addAccountSelectOptions('#acctSelect');
    setDefaultSnapshotDate('snapshotDateInput');
}

function calcTransAmount() {

    const transPriceInputValue = document.getElementById('transPrice').value;
    const transQtyInputValue = document.getElementById('transQty').value;
    var transAmtInput = document.getElementById('transAmt');

    const transAmountCalc = transPriceInputValue * transQtyInputValue;

    if (transAmountCalc) {
        transAmtInput.value = transAmountCalc;
    }

};

async function getStockData() {
    console.log('Hi, from Stock Data.')

    var tickerDropDown = document.getElementById('tickerSelectStockData')
    var tickerIndex = tickerDropDown.selectedIndex;
    var tickerDropDownLength = tickerDropDown.options.length;
    var curTicker = tickerDropDown.value;

    if (tickerIndex < (tickerDropDownLength - 1)) {
        tickerDropDown.selectedIndex = tickerIndex + 1;
    }

    console.log(`I: ${tickerIndex}, L: ${tickerDropDownLength}, V: ${curTicker}`);

    const marketDataApiEndpoint = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${curTicker}&apikey=${alphaVantageApiKey}`
    var postData = {}
    console.log(marketDataApiEndpoint)
    fetch(marketDataApiEndpoint)
        .then(response => response.json())
        .then(json => {console.log(typeof(json))
            //postData['myJson'] = json
            postData['myJson'] = JSON.stringify(json).replace("\\", '');
            console.log(postData)

            axios.post('http://localhost:5501/stockDataInput', postData)
            .then(response => {
                console.log(response.data.message);
                alert('Data Submitted!')
            })
            .catch(error => {
                console.error(`Error: ${error}`);
            })
        } 
            )
        .then(postData => {
            
        }
        )

    

    //const marketData = marketDataResponse.json();

    
    //const postData = {
    //    json: marketData
    //}

    //console.log(postData)
    //console.log(marketData)



    //getTickers()
     //   .then(tickerData => {
       //     let tickerArray = tickerData.map(function(ticker){ return ticker.ticker; });
            //tickerArray.forEach(function(item){

            //tickerArray.forEach(ticker => {
            
            /*
            var cbList = d3.select('#stockDataInputCheckBoxDiv')
                .selectAll('label')
                    //.append('text', 'hello')
                .data(tickerArray)
                .enter()
                    .append('label')
                        .attr('for', (d,i) => {return `cb${d}`; })
                        .text((d,i) => {return d; })
                    .append('input')
                        .attr('type', 'checkbox')
                        .attr('value', d => {tickerArray[d]})
                        .attr('id', (d,i) => {return `cb${d}`; })
                  
                //console.log(ticker)
            //}

            //)
            */
            /*
            for (item in ['HD', 'LOW']) {
            //['HD', 'LOW'].forEach(async function(item){
                
                console.log()

                delay(15000);

                const marketDataApiEndpoint = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${item}&apikey=${alphaVantageApiKey}`
                console.log(marketDataApiEndpoint)
                const marketDataResponse = fetch(marketDataApiEndpoint);
                const marketData = marketDataResponse.json();
            
                console.log(marketData);
            
                const postData = {
                    json: marketData
                }
            
                axios.post('http://localhost:5501/stockDataInput', postData)
                .then(response => {
                    console.log(response.data.message);
                    alert('Data Submitted!')
                })
                .catch(error => {
                    console.error(`Error: ${error}`);
                })

                
            }    
            //});
            */
       // });
    
        /*
    const marketDataApiEndpoint = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SCHD&apikey=${alphaVantageApiKey}`
    const marketDataResponse = await fetch(marketDataApiEndpoint);
    const marketData = await marketDataResponse.json();

    console.log(marketData);

    const postData = {
        json: marketData
    }

    axios.post('http://localhost:5501/stockDataInput', postData)
    .then(response => {
        console.log(response.data.message);
        alert('Data Submitted!')
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    })
    */
}

function initGetStockData() {
    var stockDataBtn = document.getElementById('stockDataInputBtn');
    stockDataBtn.addEventListener('click', getStockData);

    addTickerSelectOptions('#tickerSelectStockData');
}

function initTransactionInput() {
    //Add Event Listeners
    var transBtn = document.getElementById('transInputBtn');
    transBtn.addEventListener('click', transactionSubmit)
    var transPrice = document.getElementById('transPrice');
    transPrice.addEventListener('input', calcTransAmount);
    var transQty = document.getElementById('transQty');
    transQty.addEventListener('input', calcTransAmount);

    addAccountSelectOptions('#transAcctSelect');
    setDefaultSnapshotDate('transDateInput');
    addTickerSelectOptions('#tickerSelect');
    addTransTypesSelectOptions('#transTypeSelect');
}

function initialize() {
    initAccountBalanceSnapshotInput();
    initTransactionInput();
    initGetStockData();
}

function addAccountSelectOptions(elemId) {
    getAccounts()
        .then(acctData => {
           const acctDropDown = d3.select(elemId)

            acctDropDown.selectAll('option')
                .data(acctData)
                .enter()
                .append('option')
                .text(d => `${d.acct_nm} (${d.acct_nbr}) at ${d.inst_nm}`)
                .attr('value', d => `${d.acct_id}`);
        });
}

function addTickerSelectOptions(elemId) {
    getTickers()
        .then(tickerData => {
           const tickerDropDown = d3.select(elemId)

           tickerDropDown.selectAll('option')
                .data(tickerData)
                .enter()
                .append('option')
                .text(d => `${d.ticker} - ${d.ticker_nm}`)
                .attr('value', d => `${d.ticker}`);
        });
}

function addTransTypesSelectOptions(elemId) {
    getTransTypes()
        .then(transTypesData => {
           const transTypesDropDown = d3.select(elemId)

           transTypesDropDown.selectAll('option')
                .data(transTypesData)
                .enter()
                .append('option')
                .text(d => `${d.trans_type}`)
                .attr('value', d => `${d.trans_type}`);
        });
}

document.addEventListener('DOMContentLoaded', initialize);
