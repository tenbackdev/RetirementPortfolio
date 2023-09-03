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

    /*
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
    */
}

function getCurrentDate() {
    let now = new Date()
    return `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${('0' + now.getDate()).slice(-2)}`
}

function setDefaultSnapshotDate(elemId) {
    var snshDefaultDate = getCurrentDate()
    console.log(snshDefaultDate)
    console.log(elemId)
    var snshDtInp = document.getElementById(elemId)
    console.log(document.getElementById('snapshotDateInput'))
    console.log(snshDtInp)
    snshDtInp.value = snshDefaultDate;
}

function initAccountBalanceSnapshotInput() {
    //Add Event Listeners
    var acctBalanceSnshBtn = document.getElementById('acctBalanceSnshBtn');
    acctBalanceSnshBtn.addEventListener('click', acctBalanceSnshSubmit)

    addAccountSelectOptions('#acctSelect');
    setDefaultSnapshotDate('snapshotDateInput');
}

function initTransactionInput() {
    //Add Event Listeners
    var transBtn = document.getElementById('transInputBtn');
    transBtn.addEventListener('click', transactionSubmit)

    addAccountSelectOptions('#transAcctSelect');
    setDefaultSnapshotDate('transDateInput');
}

function initialize() {
    initAccountBalanceSnapshotInput();
    initTransactionInput();
}

function addAccountSelectOptions(elemId) {
    getAccounts()
        .then(acctData => {
            console.log(acctData)
            
            const acctDropDown = d3.select(elemId)

            acctDropDown.selectAll('option')
                .data(acctData)
                .enter()
                .append('option')
                .text(d => `${d.acct_nm} (${d.acct_nbr}) at ${d.inst_nm}`)
                .attr('value', d => `${d.acct_id}`);
        });
}

document.addEventListener('DOMContentLoaded', initialize);
