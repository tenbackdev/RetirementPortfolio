class CurrencyFormatter {

    constructor(locale = 'en-US', currency = 'USD', fractionDigits = 2) {
        this.formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits
        });
    }

    format(amount) {
        return this.formatter.format(amount);
    }

}

export default CurrencyFormatter;
