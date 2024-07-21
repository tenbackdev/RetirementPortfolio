class AccountSnapshot {
    constructor(snapshotDate, balance) {
        this.snapshotDate = new Date(snapshotDate);
        this.balance = balance;
    }
}

export default AccountSnapshot;