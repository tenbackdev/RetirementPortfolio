import Ticker from './ticker.js';
import Income from "./income.js";
import { accountMap } from './main.js';

class IncomeMap {
    constructor() {
        this.byTicker = new Map();
        this.byDate = new Map();
        this.byAccount = new Map();
    }

    addIncome(income) {
        if (!(income instanceof Income)) {
            throw new TypeError('income must be an instance of Income');
        }

        // Add by Ticker
        if (!this.byTicker.has(income.ticker.tickerSymbol)) {
            this.byTicker.set(income.ticker.tickerSymbol, []);
        }
        this.byTicker.get(income.ticker.tickerSymbol).push(income);

        // Add by Date
        const dateKey = income.payDate.toISOString().split('T')[0];
        if (!this.byDate.has(dateKey)) {
            this.byDate.set(dateKey, []);
        }
        this.byDate.get(dateKey).push(income);

        const accountKey = income.account.accountName;
        if (!this.byAccount.has(accountKey)) {
            this.byAccount.set(accountKey, [])
        }
        this.byAccount.get(accountKey).push(income);
    }

    getByTicker(tickerSymbol) {
        return this.byTicker.get(tickerSymbol) || [];
    }

    getByDate(date) {
        return this.byDate.get(date) || [];
    }

    getByAccount(accountName) {
        return this.byAccount.get(accountName) || [];
    }

    getAllByTicker() {
        return Array.from(this.byTicker.entries()).reduce((acc, [ticker, incomes]) => {
            acc[ticker] = incomes;
            return acc;
        }, {});
    }

    getAllByAccount() {
        return Array.from(this.byAccount.entries()).reduce((acc, [account, incomes]) => {
            acc[account] = incomes;
            return acc;
        }, {});
    }

}

export default IncomeMap;
