import Ticker from './ticker.js';
import Account from './account.js';

class Income {
    static validStatuses = ['Received', 'Announced', 'Estimated']

    constructor(ticker, account, payDate, incomeAmount, incomeStatus, incomeRecent, incomeReinvested) {
        if(!(ticker instanceof Ticker)) {
            throw new TypeError('ticker must be an instance of Ticker');
        }
        if(!(account instanceof Account)) {
            throw new TypeError('account must be an instance of Account');
        }

        this.ticker = ticker;
        this.account = account;
        this.payDate = new Date(payDate);
        //this.institutionName = institutionName;
        this.incomeAmount = incomeAmount;

        // Validation for incomeStatus attribute
        if (!Income.validStatuses.includes(incomeStatus)) {
            throw new TypeError(`incomeStatus must be one of ${Income.validStatuses.join(", ")}`);
        }
        this.incomeStatus = incomeStatus;

        // Validation for boolean attribute
        if (typeof incomeRecent !== 'boolean') {
            this.incomeRecent = incomeRecent != null ? Boolean(incomeRecent) : false;
        } else {
            this.incomeRecent = incomeRecent;
        }

        if (typeof incomeReinvested !== 'boolean') {
            this.incomeReinvested = incomeReinvested != null ? Boolean(incomeReinvested) : false;
        } else {
            this.incomeReinvested = incomeReinvested;
        }
        
    }
}

export default Income;
