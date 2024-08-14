import Account from './account.js';
import AccountSnapshot from './accountSnapshot.js';
import Ticker from './ticker.js';
import Income from './income.js';
import IncomeMap from './incomeMap.js';
import CurrencyFormatter from './currencyFormatter.js'
import DateFormatter from './dateFormatter.js';

export let accountMap = Account.createAccountMap();
export let currentAccountMap = Account.createAccountMap();
export let incomeMap = new IncomeMap();
export let formatterCents = new CurrencyFormatter('en-US', 'USD', 2);
export let formatterDollars = new CurrencyFormatter('en-US', 'USD', 0);
export let formatterDateMMYYYY = new DateFormatter('MMYYYY', '/');
export let formatterDateMMDDYYYY = new DateFormatter('MMDDYYYY', '/');
//// These are necessary if the variable is a const
//exports.formatterCents = formatterCents;
//exports.formatterDollars = formatterDollars;

const apiURLDomainPort = 'http://localhost:5000'

export async function fetchAccountData(days = 365) {
    if (typeof days !== 'number') {
        throw new TypeError(`Days must be a number`);
    }
    /*Make this a parameter, instead of the hardcoded 365*/
    const response = await fetch(`${apiURLDomainPort}/balance/historical/${days}`);
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
    
    // Filtering down to just the data after tracking started
    const historicalTransformed = historical
        .filter(entry => new Date(entry.income_date) >= new Date('2023-07-01'))    
        .map(income => ({
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
}

export function getIncomeStatuses() {
    return Income.validStatuses;
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

export async function loadIncomeData(jsonData) {

    jsonData.forEach(entry => {
        const {account_name, income_dollars, income_recent, income_reinvested ,income_status, institution_name, pay_date, ticker, ticker_name} = entry;
        // Every entry in the json input is considered to be its own income.
        let tickerObj = new Ticker(ticker, ticker_name);
        let account = new Account(institution_name, account_name);
        //console.log(entry);
        let income = new Income(tickerObj, account, pay_date, income_dollars, income_status, income_recent, income_reinvested)
        incomeMap.addIncome(income);
    });
    //console.log(JSON.stringify(incomeMap));
    localStorage.setItem('incomeData', `{"income": ${JSON.stringify(incomeMap.getAllGroupedBy('date'))}}`);
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

export function retrieveIncomeData() {
    const storedData = JSON.parse(localStorage.getItem('incomeData'));
    //find some way to parse the "accounts" part of what is being stored in Local Storage
    //console.log(storedData.accounts);
    
    if (!storedData?.income) {
        //avoid errors if there is no data to retrieve
        return;
    }

    if (storedData.income) {
        Object.entries(storedData.income).forEach(([incomeDate, incomeEntry]) => {
            incomeEntry.forEach(entryDetail => {
                const {incomeAmount, incomeRecent, incomeReinvested, incomeStatus, payDate} = entryDetail;
                // Every entry in the json input is considered to be its own income.
                let tickerObj = new Ticker(entryDetail.ticker.tickerSymbol, entryDetail.ticker.tickerName);
                let account = new Account(entryDetail.account.institution, entryDetail.account.accountName);
                //console.log(entry);
                let income = new Income(tickerObj, account, payDate, incomeAmount, incomeStatus, incomeRecent, incomeReinvested)
                incomeMap.addIncome(income);
            })
        });
    }    
}

