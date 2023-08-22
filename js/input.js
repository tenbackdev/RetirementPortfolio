function acctBalanceSnshSubmit() {
    console.log('Button Clicked!')
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