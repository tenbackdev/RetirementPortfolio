function addAccountSelectOptions() {
    getAccounts()
        .then(acctData => {
            console.log(acctData)
            
            const acctDropDown = d3.select('acctSelect')


            acctDropDown.selectAll('option')
                .data(acctData)
                .enter()
                    .text(d => d.acct_nm)
                    .attr('value', 'testing')
                    .append('option');
        });
}


addAccountSelectOptions();