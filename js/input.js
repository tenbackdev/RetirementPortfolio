function acctBalanceSnshSubmit() {
    
    const acctIdInputValue = document.getElementById('acctSelect').value;
    const snshDtInputValue = document.getElementById('snapshotDateInput').value;
    const acctBalInputValue = document.getElementById('balanceValue').value;

    const postData = {
        acct_id: acctIdInputValue
        , snsh_dt: snshDtInputValue
        , acct_bal: acctBalInputValue
    }

    console.log(acctIdInputValue, snshDtInputValue, acctBalInputValue);

    axios.post('http://localhost:5501/acctBalSnshInput', postData)
        .then(response => {
            console.log(response.data.message);
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
    console.log('calcTransAmount called')

    const transPriceInputValue = document.getElementById('transPrice').value;
    const transQtyInputValue = document.getElementById('transQty').value;
    var transAmtInput = document.getElementById('transAmt');

    const transAmountCalc = transPriceInputValue * transQtyInputValue;

    if (transAmountCalc) {
        console.log('hello')
        transAmtInput.value = transAmountCalc;
    }

};

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
