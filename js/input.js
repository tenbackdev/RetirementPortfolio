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
    console.log('calcTransAmount called')

    const transPriceInputValue = document.getElementById('transPrice').value;
    const transQtyInputValue = document.getElementById('transQty').value;
    var transAmtInput = document.getElementById('transAmt');

    const transAmountCalc = transPriceInputValue * transQtyInputValue;

    if (transAmountCalc) {
        transAmtInput.value = transAmountCalc;
    }

};

function getStockData() {
    console.log('Hi, from Stock Data.')

    //Replace with REST call from public API
    myJson = `{"pagination":{"limit":100,"offset":0,"count":100,"total":250},"data":[{"open":176.48,"high":176.5,"low":173.82,"close":175.01,"volume":109205100.0,"adj_high":176.495,"adj_low":173.82,"adj_close":175.01,"adj_open":176.48,"adj_volume":109259461.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-09-15T00:00:00+0000"},{"open":174.0,"high":176.1,"low":173.58,"close":175.74,"volume":60832500.0,"adj_high":176.1,"adj_low":173.58,"adj_close":175.74,"adj_open":174.0,"adj_volume":60895757.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-09-14T00:00:00+0000"},{"open":176.51,"high":177.3,"low":173.98,"close":174.21,"volume":84165800.0,"adj_high":177.3,"adj_low":173.98,"adj_close":174.21,"adj_open":176.51,"adj_volume":84267928.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-09-13T00:00:00+0000"},{"open":179.49,"high":180.12,"low":174.82,"close":176.3,"volume":88211615.0,"adj_high":180.13,"adj_low":174.82,"adj_close":176.3,"adj_open":179.49,"adj_volume":90370192.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-09-12T00:00:00+0000"},{"open":180.07,"high":180.3,"low":177.34,"close":179.36,"volume":58796496.0,"adj_high":180.3,"adj_low":177.34,"adj_close":179.36,"adj_open":180.07,"adj_volume":58953052.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-09-11T00:00:00+0000"},{"open":178.35,"high":180.239,"low":177.79,"close":178.18,"volume":65602066.0,"adj_high":180.239,"adj_low":177.79,"adj_close":178.18,"adj_open":178.35,"adj_volume":65602066.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-09-08T00:00:00+0000"},{"open":175.18,"high":178.21,"low":173.54,"close":177.56,"volume":109389817.0,"adj_high":178.21,"adj_low":173.54,"adj_close":177.56,"adj_open":175.18,"adj_volume":112488803.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-09-07T00:00:00+0000"},{"open":188.4,"high":188.735,"low":181.47,"close":182.91,"volume":81059495.0,"adj_high":188.85,"adj_low":181.47,"adj_close":182.91,"adj_open":188.4,"adj_volume":81755816.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-09-06T00:00:00+0000"},{"open":188.28,"high":189.98,"low":187.61,"close":189.7,"volume":44502638.0,"adj_high":189.98,"adj_low":187.61,"adj_close":189.7,"adj_open":188.28,"adj_volume":45280027.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-09-05T00:00:00+0000"},{"open":189.485,"high":189.92,"low":188.28,"close":189.46,"volume":45766503.0,"adj_high":189.92,"adj_low":188.28,"adj_close":189.46,"adj_open":189.485,"adj_volume":45766503.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-09-01T00:00:00+0000"},{"open":187.84,"high":189.12,"low":187.48,"close":187.87,"volume":60579365.0,"adj_high":189.12,"adj_low":187.48,"adj_close":187.87,"adj_open":187.84,"adj_volume":60794467.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-31T00:00:00+0000"},{"open":184.94,"high":187.79,"low":184.74,"close":187.65,"volume":59225736.0,"adj_high":187.85,"adj_low":184.74,"adj_close":187.65,"adj_open":184.94,"adj_volume":60813888.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-30T00:00:00+0000"},{"open":179.695,"high":184.9,"low":179.5,"close":184.12,"volume":50544969.0,"adj_high":184.9,"adj_low":179.5,"adj_close":184.12,"adj_open":179.695,"adj_volume":53003948.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-29T00:00:00+0000"},{"open":180.09,"high":180.585,"low":178.545,"close":180.19,"volume":39522558.0,"adj_high":180.59,"adj_low":178.545,"adj_close":180.19,"adj_open":180.09,"adj_volume":43820697.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-28T00:00:00+0000"},{"open":177.38,"high":179.15,"low":175.82,"close":178.61,"volume":51418700.0,"adj_high":179.15,"adj_low":175.82,"adj_close":178.61,"adj_open":177.38,"adj_volume":51449594.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-25T00:00:00+0000"},{"open":180.674,"high":181.104,"low":176.02,"close":176.38,"volume":53184586.0,"adj_high":181.104,"adj_low":176.01,"adj_close":176.38,"adj_open":180.674,"adj_volume":54945798.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-24T00:00:00+0000"},{"open":178.52,"high":181.55,"low":178.325,"close":181.12,"volume":52692713.0,"adj_high":181.55,"adj_low":178.325,"adj_close":181.12,"adj_open":178.52,"adj_volume":52722752.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-23T00:00:00+0000"},{"open":177.06,"high":177.6778,"low":176.25,"close":177.23,"volume":41363946.0,"adj_high":177.68,"adj_low":176.25,"adj_close":177.23,"adj_open":177.06,"adj_volume":42084245.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-22T00:00:00+0000"},{"open":175.07,"high":176.13,"low":173.735,"close":175.84,"volume":46200264.0,"adj_high":176.13,"adj_low":173.735,"adj_close":175.84,"adj_open":175.07,"adj_volume":46311879.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-21T00:00:00+0000"},{"open":172.3,"high":175.1,"low":171.96,"close":174.49,"volume":61114200.0,"adj_high":175.1,"adj_low":171.96,"adj_close":174.49,"adj_open":172.3,"adj_volume":61172150.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-18T00:00:00+0000"},{"open":177.14,"high":177.5054,"low":173.48,"close":174.0,"volume":61161415.0,"adj_high":177.5054,"adj_low":173.48,"adj_close":174.0,"adj_open":177.14,"adj_volume":66062882.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-17T00:00:00+0000"},{"open":177.13,"high":178.53,"low":176.5,"close":176.57,"volume":45793160.0,"adj_high":178.54,"adj_low":176.5,"adj_close":176.57,"adj_open":177.13,"adj_volume":46964857.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-16T00:00:00+0000"},{"open":178.88,"high":179.47,"low":177.0517,"close":177.45,"volume":43512030.0,"adj_high":179.48,"adj_low":177.05,"adj_close":177.45,"adj_open":178.88,"adj_volume":43622593.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-15T00:00:00+0000"},{"open":177.97,"high":179.69,"low":177.305,"close":179.46,"volume":43542592.0,"adj_high":179.69,"adj_low":177.305,"adj_close":179.46,"adj_open":177.97,"adj_volume":43675627.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-14T00:00:00+0000"},{"open":177.32,"high":178.62,"low":176.55,"close":177.79,"volume":51988100.0,"adj_high":178.62,"adj_low":176.55,"adj_close":177.79,"adj_open":177.32,"adj_volume":52036672.0,"split_factor":1.0,"dividend":0.24,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-11T00:00:00+0000"},{"open":179.48,"high":180.75,"low":177.601,"close":177.97,"volume":51330160.0,"adj_high":180.75,"adj_low":177.6,"adj_close":177.97,"adj_open":179.48,"adj_volume":54686851.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-10T00:00:00+0000"},{"open":180.87,"high":180.93,"low":177.01,"close":178.19,"volume":60286200.0,"adj_high":180.93,"adj_low":177.01,"adj_close":178.19,"adj_open":180.87,"adj_volume":60378492.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-09T00:00:00+0000"},{"open":179.69,"high":180.27,"low":177.58,"close":179.8,"volume":67690988.0,"adj_high":180.27,"adj_low":177.58,"adj_close":179.8,"adj_open":179.69,"adj_volume":67823003.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-08T00:00:00+0000"},{"open":182.13,"high":183.13,"low":177.36,"close":178.85,"volume":97263524.0,"adj_high":183.13,"adj_low":177.35,"adj_close":178.85,"adj_open":182.13,"adj_volume":97576069.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-07T00:00:00+0000"},{"open":185.52,"high":187.38,"low":181.92,"close":181.99,"volume":115799700.0,"adj_high":187.38,"adj_low":181.92,"adj_close":181.99,"adj_open":185.52,"adj_volume":115956841.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-04T00:00:00+0000"},{"open":191.57,"high":192.37,"low":190.69,"close":191.17,"volume":61235200.0,"adj_high":192.37,"adj_low":190.69,"adj_close":191.17,"adj_open":191.57,"adj_volume":62243282.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-03T00:00:00+0000"},{"open":195.04,"high":195.18,"low":191.85,"close":192.58,"volume":50241600.0,"adj_high":195.18,"adj_low":191.8507,"adj_close":192.58,"adj_open":195.04,"adj_volume":50389327.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-02T00:00:00+0000"},{"open":196.24,"high":196.73,"low":195.28,"close":195.61,"volume":35175100.0,"adj_high":196.73,"adj_low":195.28,"adj_close":195.61,"adj_open":196.235,"adj_volume":35281426.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-08-01T00:00:00+0000"},{"open":196.06,"high":196.49,"low":195.26,"close":196.45,"volume":38778100.0,"adj_high":196.49,"adj_low":195.26,"adj_close":196.45,"adj_open":196.06,"adj_volume":38824113.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-31T00:00:00+0000"},{"open":194.67,"high":196.63,"low":194.14,"close":195.83,"volume":48254600.0,"adj_high":196.626,"adj_low":194.14,"adj_close":195.83,"adj_open":194.67,"adj_volume":48291443.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-28T00:00:00+0000"},{"open":196.02,"high":197.2,"low":192.56,"close":193.22,"volume":47352217.0,"adj_high":197.2,"adj_low":192.55,"adj_close":193.22,"adj_open":196.02,"adj_volume":47460180.0
    ,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-27T00:00:00+0000"},{"open":193.67,"high":195.64,"low":193.32,"close":194.5,"volume":47402800.0,"adj_high":195.64,"adj_low":193.32,"adj_close":194.5,"adj_open":193.67,"adj_volume":47471868.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-26T00:00:00+0000"},{"open":193.33,"high":194.44,"low":192.92,"close":193.62,"volume":37184800.0,"adj_high":194.44,"adj_low":192.915,"adj_close":193.62,"adj_open":193.33,"adj_volume":37283201.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-25T00:00:00+0000"},{"open":193.41,"high":194.91,"low":192.29,"close":192.75,"volume":44776111.0,"adj_high":194.91,"adj_low":192.25,"adj_close":192.75,"adj_open":193.41,"adj_volume":45505097.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-24T00:00:00+0000"},{"open":194.1,"high":194.97,"low":191.23,"close":191.94,"volume":71917800.0,"adj_high":194.97,"adj_low":191.23,"adj_close":191.94,"adj_open":194.1,"adj_volume":71951683.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-21T00:00:00+0000"},{"open":195.09,"high":196.47,"low":192.5,"close":193.13,"volume":59415700.0,"adj_high":196.47,"adj_low":192.495,"adj_close":193.13,"adj_open":195.09,"adj_volume":59581196.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-20T00:00:00+0000"},{"open":193.1,"high":198.22,"low":192.65,"close":195.1,"volume":77149150.0,"adj_high":198.23,"adj_low":192.65,"adj_close":195.1,"adj_open":193.1,"adj_volume":80507323.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-19T00:00:00+0000"},{"open":193.35,"high":194.33,"low":192.415,"close":193.73,"volume":46631931.0,"adj_high":194.33,"adj_low":192.415,"adj_close":193.73,"adj_open":193.35,"adj_volume":48353774.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-18T00:00:00+0000"},{"open":191.9,"high":194.32,"low":191.81,"close":193.99,"volume":49798987.0,"adj_high":194.32,"adj_low":191.81,"adj_close":193.99,"adj_open":191.9,"adj_volume":50520159.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-17T00:00:00+0000"},{"open":190.23,"high":191.18,"low":189.63,"close":190.69,"volume":41573900.0,"adj_high":191.1799,"adj_low":189.63,"adj_close":190.69,"adj_open":190.23,"adj_volume":41616242.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-14T00:00:00+0000"},{"open":190.5,"high":191.19,"low":189.78,"close":190.54,"volume":38321242.0,"adj_high":191.19,"adj_low":189.78,"adj_close":190.54,"adj_open":190.5,"adj_volume":41342338.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-13T00:00:00+0000"},{"open":189.68,"high":191.7,"low":188.47,"close":189.77,"volume":55924932.0,"adj_high":191.7,"adj_low":188.47,"adj_close":189.77,"adj_open":189.68,"adj_volume":60750248.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-12T00:00:00+0000"},{"open":189.16,"high":189.28,"low":186.6,"close":188.08,"volume":46509718.0,"adj_high":189.3,"adj_low":186.6,"adj_close":188.08,"adj_open":189.16,"adj_volume":46638119.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-11T00:00:00+0000"},{"open":189.26,"high":189.99,"low":187.035,"close":188.61,"volume":59832710.0,"adj_high":189.99,"adj_low":187.035,"adj_close":188.61,"adj_open":189.26,"adj_volume":59922163.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-10T00:00:00+0000"},{"open":191.41,"high":192.67,"low":190.24,"close":190.68,"volume":46778000.0,"adj_high":192.67,"adj_low":190.24,"adj_close":190.68,"adj_open":191.41,"adj_volume":46814998.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-07T00:00:00+0000"},{"open":189.84,"high":192.018,"low":189.21,"close":191.81,"volume":44773779.0,"adj_high":192.02,"adj_low":189.2,"adj_close":191.81,"adj_open":189.84,"adj_volume":45156009.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-06T00:00:00+0000"},{"open":191.565,"high":192.98,"low":190.62,"close":191.33,"volume":46358709.0,"adj_high":192.98,"adj_low":190.62,"adj_close":191.33,"adj_open":191.565,"adj_volume":46920261.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-05T00:00:00+0000"},{"open":193.78,"high":193.88,"low":191.76,"close":192.46,"volume":31458198.0,"adj_high":193.88,"adj_low":191.76,"adj_close":192.46,"adj_open":193.78,"adj_volume":31458198.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-07-03T00:00:00+0000"},{"open":191.63,"high":194.48,"low":191.26,"close":193.97,"volume":85069600.0,"adj_high":194.48,"adj_low":191.26,"adj_close":193.97,"adj_open":191.63,"adj_volume":85213216.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-30T00:00:00+0000"},{"open":189.08,"high":190.07,"low":188.94,"close":189.59,"volume":45331827.0,"adj_high":190.07,"adj_low":188.94,"adj_close":189.59,"adj_open":189.08,"adj_volume":46347308.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-29T00:00:00+0000"},{"open":187.93,"high":189.9,"low":187.6,"close":189.25,"volume":48829939.0,"adj_high":189.9,"adj_low":187.6,"adj_close":189.25,"adj_open":187.93,"adj_volume":51216801.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-28T00:00:00+0000"},{"open":185.89,"high":188.3899,"low":185.67,"close":188.06,"volume":46982317.0,"adj_high":188.39,"adj_low":185.67,"adj_close":188.06,"adj_open":185.89,"adj_volume":50730846.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-27T00:00:00+0000"},{"open":186.83,"high":188.05,"low":185.23,"close":185.27,"volume":47977400.0,"adj_high":188.05,"adj_low":185.23,"adj_close":185.27,"adj_open":186.83,"adj_volume":48088661.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-26T00:00:00+0000"},{"open":185.55,"high":187.56,"low":185.01,"close":186.68,"volume":53079300.0,"adj_high":187.56,"adj_low":185.01,"adj_close":186.68,"adj_open":185.55,"adj_volume":53116996.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-23T00:00:00+0000"},{"open":183.74,"high":187.05,"low":183.67,"close":187.0,"volume":51245300.0,"adj_high":187.045,"adj_low":183.67,"adj_close":187.0,"adj_open":183.74,"adj_volume":51245327.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-22T00:00:00+0000"},{"open":184.9,"high":185.41,"low":182.59,"close":183.96,"volume":49515700.0,"adj_high":185.41,"adj_low":182.5901,"adj_close":183.96,"adj_open":184.9,"adj_volume":49515697.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-21T00:00:00+0000"},{"open":184.41,"high":186.1,"low":184.41,"close":185.01,"volume":49799100.0,"adj_high":186.1,"adj_low":184.41,"adj_close":185.01,"adj_open":184.41,"adj_volume":49799092.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-20T00:00:00+0000"},{"open":186.73,"high":186.99,"low":184.27,"close":184.92,"volume":101235600.0,"adj_high":186.99,"adj_low":184.27,"adj_close":184.92,"adj_open":186.73,"adj_volume":101256225.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-16T00:00:00+0000"},{"open":183.96,"high":186.52,"low":183.78,"close":186.01,"volume":65433200.0,"adj_high":186.52,"adj_low":183.78,"adj_close":186.01,"adj_open":183.96,"adj_volume":65433166.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-15T00:00:00+0000"},{"open":183.37,"high":184.39,"low":182.02,"close":183.95,"volume":57462879.0,"adj_high":184.39,"adj_low":182.02,"adj_close":183.95,"adj_open":183.37,"adj_volume":57462882.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-14T00:00:00+0000"},{"open":182.8,"high":184.15,"low":182.44,"close":183.31,"volume":54929129.0,"adj_high":184.15,"adj_low":182.44,"adj_close":183.31,"adj_open":182.8,"adj_volume":54929129.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-13T00:00:00+0000"},{"open":181.27,"high":183.89,"low":180.97,"close":183.79,"volume":54755000.0,"adj_high":183.89,"adj_low":180.97,"adj_close":183.79,"adj_open":181.27,"adj_volume":54754995.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-12T00:00:00+0000"},{"open":181.5,"high":182.23,"low":180.63,"close":180.96,"volume":48870700.0,"adj_high":182.23,"adj_low":180.63,"adj_close":180.96,"adj_open":181.5,"adj_volume":48899973.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-09T00:00:00+0000"},{"open":177.9,"high":180.84,"low":177.46,"close":180.57,"volume":50214900.0,"adj_high":180.84,"adj_low":177.46,"adj_close":180.57,"adj_open":177.895,"adj_volume":50214881.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-08T00:00:00+0000"},{"open":178.44,"high":181.21,"low":177.32,"close":177.82,"volume":61944600.0,"adj_high":181.21,"adj_low":177.32,"adj_close":177.82,"adj_open":178.44,"adj_volume":61944615.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-07T00:00:00+0000"},{"open":179.97,"high":180.12,"low":177.43,"close":179.21,"volume":64848400.0,"adj_high":180.12,"adj_low":177.43,"adj_close":179.21,"adj_open":179.965,"adj_volume":64848374.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-06T00:00:00+0000"},{"open":182.63,"high":184.95,"low":178.04,"close":179.58,"volume":121946500.0,"adj_high":184.951,"adj_low":178.035,"adj_close":179.58,"adj_open":182.63,"adj_volume":121946497.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS"
    ,"date":"2023-06-05T00:00:00+0000"},{"open":181.03,"high":181.78,"low":179.26,"close":180.95,"volume":61945900.0,"adj_high":181.78,"adj_low":179.26,"adj_close":180.95,"adj_open":181.03,"adj_volume":61996913.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-02T00:00:00+0000"},{"open":177.7,"high":180.12,"low":176.93,"close":180.09,"volume":68901800.0,"adj_high":180.12,"adj_low":176.9306,"adj_close":180.09,"adj_open":177.7,"adj_volume":68901809.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-06-01T00:00:00+0000"},{"open":177.33,"high":179.35,"low":176.76,"close":177.25,"volume":99625300.0,"adj_high":179.35,"adj_low":176.76,"adj_close":177.25,"adj_open":177.325,"adj_volume":99313268.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-31T00:00:00+0000"},{"open":176.96,"high":178.99,"low":176.57,"close":177.3,"volume":55964400.0,"adj_high":178.99,"adj_low":176.57,"adj_close":177.3,"adj_open":176.96,"adj_volume":55964401.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-30T00:00:00+0000"},{"open":173.32,"high":175.77,"low":173.11,"close":175.43,"volume":54794100.0,"adj_high":175.77,"adj_low":173.11,"adj_close":175.43,"adj_open":173.32,"adj_volume":54834975.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-26T00:00:00+0000"},{"open":172.41,"high":173.9,"low":171.69,"close":172.99,"volume":56058300.0,"adj_high":173.895,"adj_low":171.69,"adj_close":172.99,"adj_open":172.41,"adj_volume":56058258.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-25T00:00:00+0000"},{"open":171.09,"high":172.42,"low":170.52,"close":171.84,"volume":45143500.0,"adj_high":172.4183,"adj_low":170.52,"adj_close":171.84,"adj_open":171.09,"adj_volume":45143488.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-24T00:00:00+0000"},{"open":173.13,"high":173.38,"low":171.28,"close":171.56,"volume":50747300.0,"adj_high":173.3794,"adj_low":171.275,"adj_close":171.56,"adj_open":173.13,"adj_volume":50747263.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-23T00:00:00+0000"},{"open":173.98,"high":174.71,"low":173.45,"close":174.2,"volume":43570900.0,"adj_high":174.71,"adj_low":173.45,"adj_close":174.2,"adj_open":173.98,"adj_volume":43570932.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-22T00:00:00+0000"},{"open":176.39,"high":176.39,"low":174.94,"close":175.16,"volume":55772400.0,"adj_high":176.39,"adj_low":174.94,"adj_close":175.16,"adj_open":176.39,"adj_volume":55809475.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-19T00:00:00+0000"},{"open":173.0,"high":175.24,"low":172.58,"close":175.05,"volume":65496700.0,"adj_high":175.24,"adj_low":172.58,"adj_close":175.05,"adj_open":173.0,"adj_volume":65496657.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-18T00:00:00+0000"},{"open":171.71,"high":172.93,"low":170.42,"close":172.69,"volume":57951600.0,"adj_high":172.925,"adj_low":170.4201,"adj_close":172.69,"adj_open":171.71,"adj_volume":57951604.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-17T00:00:00+0000"},{"open":171.99,"high":173.14,"low":171.8,"close":172.07,"volume":42110300.0,"adj_high":173.1383,"adj_low":171.7991,"adj_close":172.07,"adj_open":171.99,"adj_volume":42110293.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-16T00:00:00+0000"},{"open":173.16,"high":173.21,"low":171.47,"close":172.07,"volume":37266700.0,"adj_high":173.21,"adj_low":171.47,"adj_close":172.07,"adj_open":173.16,"adj_volume":37266659.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-15T00:00:00+0000"},{"open":173.62,"high":174.06,"low":171.0,"close":172.57,"volume":45497800.0,"adj_high":174.06,"adj_low":171.0,"adj_close":172.57,"adj_open":173.62,"adj_volume":45533138.0,"split_factor":1.0,"dividend":0.24,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-12T00:00:00+0000"},{"open":173.85,"high":174.59,"low":172.17,"close":173.75,"volume":49514700.0,"adj_high":174.3475279208,"adj_low":171.9308888375,"adj_close":173.51,"adj_open":173.6085556391,"adj_volume":49514676.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-11T00:00:00+0000"},{"open":173.02,"high":174.03,"low":171.9,"close":173.56,"volume":53724500.0,"adj_high":173.7883056536,"adj_low":171.6612638158,"adj_close":173.3203,"adj_open":172.7797083502,"adj_volume":53724501.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-10T00:00:00+0000"},{"open":173.05,"high":173.54,"low":171.6,"close":171.77,"volume":45326900.0,"adj_high":173.2989861698,"adj_low":171.3616804583,"adj_close":171.5327,"adj_open":172.809666686,"adj_volume":45326874.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-09T00:00:00+0000"},{"open":172.48,"high":173.85,"low":172.11,"close":173.5,"volume":55962800.0,"adj_high":173.6085556391,"adj_low":171.870972166,"adj_close":173.2603,"adj_open":172.2404583068,"adj_volume":55962793.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-08T00:00:00+0000"},{"open":170.98,"high":174.3,"low":170.76,"close":173.57,"volume":113316400.0,"adj_high":174.0579306753,"adj_low":170.5228470575,"adj_close":173.3302,"adj_open":170.7375484636,"adj_volume":113453171.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-05T00:00:00+0000"},{"open":164.89,"high":167.04,"low":164.31,"close":165.79,"volume":81235400.0,"adj_high":166.8080134251,"adj_low":164.0818048724,"adj_close":165.561,"adj_open":164.6609993635,"adj_volume":81235427.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-04T00:00:00+0000"},{"open":169.5,"high":170.92,"low":167.16,"close":167.45,"volume":65136000.0,"adj_high":170.6826248481,"adj_low":166.9278467681,"adj_close":167.2187,"adj_open":169.2645969562,"adj_volume":65136018.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-03T00:00:00+0000"},{"open":170.09,"high":170.35,"low":167.54,"close":168.54,"volume":48425700.0,"adj_high":170.113416469,"adj_low":167.3073190209,"adj_close":168.3072,"adj_open":169.8537775592,"adj_volume":48425696.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-02T00:00:00+0000"},{"open":169.28,"high":170.45,"low":168.64,"close":169.59,"volume":52472900.0,"adj_high":170.2132775881,"adj_low":168.4057913315,"adj_close":169.3557,"adj_open":169.0449024941,"adj_volume":52472936.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-05-01T00:00:00+0000"},{"open":168.49,"high":169.85,"low":167.88,"close":169.68,"volume":55209200.0,"adj_high":169.85,"adj_low":167.8801,"adj_close":169.68,"adj_open":168.49,"adj_volume":55275851.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-04-28T00:00:00+0000"},{"open":165.19,"high":168.56,"low":165.19,"close":168.41,"volume":64524702.0,"adj_high":168.56,"adj_low":165.19,"adj_close":168.41,"adj_open":165.19,"adj_volume":64902329.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-04-27T00:00:00+0000"},{"open":163.06,"high":165.28,"low":162.8,"close":163.76,"volume":45425700.0,"adj_high":165.28,"adj_low":162.8,"adj_close":163.76,"adj_open":163.055,"adj_volume":44105745.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-04-26T00:00:00+0000"},{"open":165.19,"high":166.3,"low":163.73,"close":163.77,"volume":48714063.0,"adj_high":166.305,"adj_low":163.73,"adj_close":163.77,"adj_open":165.19,"adj_volume":48714063.0,"split_factor":1.0,"dividend":0.0,"symbol":"AAPL","exchange":"XNAS","date":"2023-04-25T00:00:00+0000"}]}`

    const postData = {
        json: myJson
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

function initGetStockData() {
    var stockDataBtn = document.getElementById('stockDataInputBtn');
    stockDataBtn.addEventListener('click', getStockData);
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
