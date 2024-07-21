import Account from './account.js';
import AccountSnapshot from './accountSnapshot.js';

export let accountMap = Account.createAccountMap();
const apiURLDomainPort = 'http://localhost:5000'

export async function fetchAccountData() {
    const response = await fetch(`${apiURLDomainPort}/balance/historical/365`);
    const data = await response.json();
    return data;
}

export async function loadAccountData(jsonData) {


    jsonData.forEach(entry => {
        const {snapshot_date, institution_name, account_name, account_balances} = entry;
      
        let account = accountMap.get(account_name);
        if (!account) {
            //Create a new account if it doesn't exist
            account = new Account(institution_name, account_name);
            accountMap.add(account);
        }

        // Create and add the AccountSnapshot
        account.addBalance(snapshot_date, account_balances);
        //console.log(account.toString());
    });
}

export function retrieveAccountData() {
    const storedData = localStorage.getItem('accounts');
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        accounts = parsedData.map(data => {
            const account = new Account(data.institution, data.accountName, data.accountNumber);
            data.history.forEach(snapshot => {
                account.addBalance(new Date(snapshot.snapshotDate), snapshot.balance);
            })
            return account;
        });
    }    
}

