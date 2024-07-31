class DateFormatter {

    constructor(defaultFormat, defaultDelim) {
        this.defaultFormat = defaultFormat;
        this.defaultDelim = defaultDelim;
    }

    formatDate(date, format = this.defaultFormat, delim = this.defaultDelim) {
        if (!(date instanceof Date)) {
            throw new TypeError('date input must be an instance of Date');
        }

        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1; // getMonth() returns month from 0-11
        const day = date.getUTCDate();

        let formattedYear = `${year % 100}`
        if(format.includes('YYYY')) {
            formattedYear = `${year}`;
        }

        let formattedMonth = `${month}`
        if(format.includes('MM')) {
            formattedMonth = month < 10 ? `0${month}` : `${month}`;
        }

        let formattedDay = `${day}`
        if(format.includes('DD')) {
            formattedDay = day < 10 ? `0${day}` : `${day}`;
        }

        switch (format) {
            case 'MMDD':
                return `${formattedMonth}${delim}${formattedDay}`
            case 'MMDDYYYY':
                return `${formattedMonth}${delim}${formattedDay}${delim}${formattedYear}`
            case 'MMYY':
            case 'MMYYYY':
                return `${formattedMonth}${delim}${formattedYear}`
            case 'YYYYMM':
                return `${formattedYear}${delim}${formattedMonth}`
            //Same as YYYYMMDD
            default:
                return `${formattedYear}${delim}${formattedMonth}${delim}${formattedDay}`
        }

    }
}

export default DateFormatter;