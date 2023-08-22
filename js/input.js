function acctBalanceSnshSubmit() {
    console.log('Button Clicked!')

    const postData = {
        acct_id: 1
        , snsh_dt: '2023-08-22'
        , acct_bal: 1000.00
    }

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