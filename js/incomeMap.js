import Ticker from './ticker.js';
import Income from "./income.js";
import { accountMap } from './main.js';

class IncomeMap {
    constructor() {
        this.byTicker = new Map();
        this.byDate = new Map();
        this.byAccount = new Map();
        this.byStatus = new Map();
    }

    addIncome(income) {
        if (!(income instanceof Income)) {
            throw new TypeError('income must be an instance of Income');
        }

        const dateKey = income.payDate.toISOString().split('T')[0];
        this._addToMap(this.byTicker, income.ticker.tickerSymbol, income);
        this._addToMap(this.byDate, dateKey, income);
        this._addToMap(this.byAccount, income.account.accountName, income);
        this._addToMap(this.byStatus, income.incomeStatus, income);
    }

    _addToMap(map, key, value) {
        if (!map.has(key)) {
            map.set(key, []);
        }
        const arr = map.get(key);
        arr.push(value);
        arr.sort((a, b) => a - b);
        map.set(key, arr);
    }

    _convertMapToObject(map) {
        const obj = {};
        map.forEach((value, key) => {
            obj[key] = value;
        });
        map.sort
        return obj;
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

    getAllGroupedBy(key) {
        switch (key) {
            case 'ticker':
                return this._convertMapToObject(this.byTicker);
            case 'date':
                return this._convertMapToObject(this.byDate);
            case 'account':
                return this._convertMapToObject(this.byAccount);
            case 'status':
                return this._convertMapToObject(this.byStatus);
            default:
                throw new Error('Invalid key specified');
        }
    }

}

export default IncomeMap;
