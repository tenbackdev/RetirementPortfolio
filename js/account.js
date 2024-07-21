import AccountSnapshot from "./accountSnapshot.js";

class Account {
    constructor(institution, accountName, accountNumber) {
        this.institution = institution;
        this.accountName = accountName;
        this.accountNumber = accountNumber;
        this.history = [];
    }

    addBalance(snapshotDate, balance) {
        const snapshot = new AccountSnapshot(snapshotDate, balance);
        this.history.push(snapshot);
        //force all balances added to be in chronological order
        this.history.sort((a, b) => new Date(a.snapshotDate) - new Date(b.snapshotDate));
    }

    getCurrentBalance() {
        return this.history,at(-1)?.balance || null;
    }

    getBalanceByDate(date) {
        const targetDate = new Date(date);
        const snapshot = this.history.find(snapshot => snapshot.snapshotDate.getTime() === targetDate);
        return snapshot ? snapshot.balance : null;
    }

}

export default Account;



