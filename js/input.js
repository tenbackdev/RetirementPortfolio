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

function initialize() {
    //Add Event Listeners
    var acctBalanceSnshBtn = document.getElementById('acctBalanceSnshBtn');

    acctBalanceSnshBtn.addEventListener('click', acctBalanceSnshSubmit)
}

function addAccountSelectOptions() {
    getAccounts()
        .then(acctData => {
            console.log(acctData)
            
            const acctDropDown = d3.select('#acctSelect')

            acctDropDown.selectAll('option')
                .data(acctData)
                .enter()
                .append('option')
                .text(d => `${d.acct_nm} (${d.acct_nbr}) at ${d.inst_nm}`)
                .attr('value', d => `${d.acct_id}`);
        });
}

document.addEventListener('DOMContentLoaded', initialize);
addAccountSelectOptions();