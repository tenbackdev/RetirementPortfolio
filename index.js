import {accountMap, fetchAccountData, loadAccountData, retrieveAccountData} from './js/main.js';

async function main() {
    retrieveAccountData();
    //avoid an api call / loading data if data already exists
    
    if (Object.keys(accountMap.accounts).length === 0) {
        const accountData = await fetchAccountData();
        loadAccountData(accountData);
    }
    
    console.log(accountMap);

    //console.log(loadAccountData());
}

main();



