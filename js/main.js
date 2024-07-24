import Account from './account.js';
import AccountSnapshot from './accountSnapshot.js';
import Ticker from './ticker.js';
import Income from './income.js';
import IncomeMap from './incomeMap.js';

export let accountMap = Account.createAccountMap();
export let currentAccountMap = Account.createAccountMap();
export let incomeMap = new IncomeMap();
const apiURLDomainPort = 'http://localhost:5000'

export async function fetchAccountData() {
    /*Make this a parameter, instead of the hardcoded 365*/
    const response = await fetch(`${apiURLDomainPort}/balance/historical/365`);
    const data = await response.json();
    return data;
}

export async function fetchCurrentAccountData() {
    const response = await fetch(`${apiURLDomainPort}/balance/current`);
    const data = await response.json();
    return data;
}

export async function fetchIncomeData() {
    const [historicalResponse, estimatedReponse] = await Promise.all([
        fetch(`${apiURLDomainPort}/income/historical`),
        fetch(`${apiURLDomainPort}/income/estimated`)
    ]);

    const [historical, estimated] = await Promise.all([
        historicalResponse.json(),
        estimatedReponse.json()
    ]);
    
    const historicalTransformed = historical.map(income => ({
        account_name: income.account_name,
        institution_name: income.institution_name,
        income_status: 'Received',
        income_dollars: income.income_dollars,
        income_recent: income.income_recent,
        income_reinvested: income.income_reinvested,
        pay_date: income.income_date,
        ticker: income.ticker,
        ticker_name: income.ticker_name
    }));

    const estimatedTransformed = estimated.map(income => ({
        account_name: income.account_name,
        //institution_name: income.institution_name, //need to update API to include this
        income_status: income.income_announced === true ? 'Announced' : 'Estimated',
        income_dollars: income.income_dollars,
        pay_date: income.pay_date,
        ticker: income.ticker,
        ticker_name: income.ticker_name
    }));

    const mergedData = [...historicalTransformed, ...estimatedTransformed];
    return mergedData;
    //const data = await response.json();
    //return data;
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
    localStorage.setItem('accountData', JSON.stringify(accountMap));
}

export async function loadCurrentAccountData(jsonData) {

    jsonData.forEach(entry => {
        const {snapshot_date, institution_name, account_name, account_balance} = entry;
      
        let account = currentAccountMap.get(account_name);
        if (!account) {
            //Create a new account if it doesn't exist
            account = new Account(institution_name, account_name);
            currentAccountMap.add(account);
        }

        // Create and add the AccountSnapshot
        account.addBalance(snapshot_date, account_balance);
        //console.log(account.toString());
    });
    localStorage.setItem('currentAccountData', JSON.stringify(currentAccountMap));
}

/*Re-evaluate to see if there is a way to avoid duplicating every function*/
/*Instead just marking certain account data to be current*/
/*Will also have to revisit the use of the two separate API endpoints*/
/*One idea is to have currentAccount.... just traverse the account.. and filter down to the appropriate data*/
export async function clearAccountMap() {
    accountMap = Account.createAccountMap();
}

export async function clearCurrentAccountMap() {
    currentAccountMap = Account.createAccountMap();
}

export function retrieveAccountData() {
    const storedData = JSON.parse(localStorage.getItem('accountData'));
    //find some way to parse the "accounts" part of what is being stored in Local Storage
    //console.log(storedData.accounts);
    
    if (!storedData) {
        //avoid errors if there is no data to retrieve
        return
    }

    if (storedData.accounts) {
        Object.entries(storedData.accounts).forEach(([accountName, accountData]) => {
            const account = new Account(accountData.institution, accountName, accountData.accountNumber);

            accountData.snapshots.forEach(snapshotData => {
                account.addBalance(new Date(snapshotData.snapshotDate), snapshotData.balance);
            });

            accountMap.add(account);
        });
    }    
}

export function retrieveCurrentAccountData() {
    const storedData = JSON.parse(localStorage.getItem('currentAccountData'));
    //find some way to parse the "accounts" part of what is being stored in Local Storage
    //console.log(storedData.accounts);
    
    if (!storedData) {
        //avoid errors if there is no data to retrieve
        return
    }

    if (storedData.accounts) {
        Object.entries(storedData.accounts).forEach(([accountName, accountData]) => {
            const account = new Account(accountData.institution, accountName, accountData.accountNumber);

            accountData.snapshots.forEach(snapshotData => {
                account.addBalance(new Date(snapshotData.snapshotDate), snapshotData.balance);
            });

            accountMap.add(account);
        });
    }    
}

