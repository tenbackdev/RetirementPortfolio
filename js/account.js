import AccountSnapshot from "./accountSnapshot.js";

class Account {
    constructor(institution, accountName, accountNumber) {
        this.institution = institution;
        this.accountName = accountName;
        this.accountNumber = accountNumber;
        this.snapshots = [];
    }

    addBalance(snapshotDate, balance) {
        const snapshot = new AccountSnapshot(snapshotDate, balance);
        this.snapshots.push(snapshot);
        //force all balances added to be in chronological order
        this.snapshots.sort((a, b) => new Date(a.snapshotDate) - new Date(b.snapshotDate));
    }

    getCurrentBalance() {
        return this.history,at(-1)?.balance || null;
    }

    getBalanceByDate(date) {
        const targetDate = new Date(date);
        const snapshot = this.snapshots.find(snapshot => snapshot.snapshotDate.getTime() === targetDate);
        return snapshot ? snapshot.balance : null;
    }

    static createAccountMap() {
        return {
            accounts: {},
            add(account) {
                this.accounts[account.accountName] = account;
            },
            get(accountName) {
                return this.accounts[accountName] || null;
            }
        }
    }

    toString() {
        const snapshotDetails = this.snapshots.map(snapshot => `Date: ${snapshot.snapshotDate.toDateString()}, Balance: ${snapshot.balance}`).join('\n');
        return `Institution: ${this.institution}\nAccount Name: ${this.accountName}\nAccount Number: ${this.accountNumber}\nSnapshots:\n${snapshotDetails}`;
    }

}

export default Account;



