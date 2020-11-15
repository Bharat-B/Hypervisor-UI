import Accounting from 'accounting'

export default ({store, app}, inject) => {
    inject('currencyFormat', (e, precision = false) => {
        let format = store.getters.formats[store.getters.settings.currency_format];
        if(format && format.length !== 0){
            let options = {
                symbol: store.getters.currencySymbol[store.getters.settings.currency_code],
                decimal: format.decimal,
                thousand: format.thousand,
                precision: !precision ? format.precision : precision,
            };
            return Accounting.formatMoney(e, options);
        }
        return e;
    });
    inject('invoiceCurrency', (amount, currency_code, precision = false) => {
      let format = store.getters.formats[store.getters.settings.currency_format];
      if(format && format.length !== 0){
        let options = {
          symbol: store.getters.currencySymbol[currency_code],
          decimal: format.decimal,
          thousand: format.thousand,
          precision: !precision ? format.precision : precision,
        };
        return Accounting.formatMoney(amount, options);
      }
      return amount;
    })
    inject('round', (decimal, places) => {
        return decimal.toFixed(places);
    });
    inject('ram', (megabytes) => {
        if (megabytes < 1024) {
            return megabytes + ' MB'
        }
        if (megabytes > 1024 && megabytes / 1024 < 1024) {
            return (megabytes / 1024).toFixed(2) + ' GB'
        }
        if (megabytes > 1024 && megabytes / 1024 > 1024) {
            return (megabytes / 1024 * 1024).toFixed(2) + ' TB'
        }
    });
    inject('pageRange', (to) => {
        let arr = [];
        for (let i = 1; i <= to; i++) {
            arr.push(i);
        }
        return arr;
    });
    inject('upperCase', (value) => {
        if (!value) return '';
        value = value.toString();
        return value.substring().toUpperCase();
    });
    inject('lowerCase', (value) => {
        if (!value) return '';
        value = value.toString();
        return value.substring().toLowerCase();
    });
    inject('ucfirst', (value) => {
        if (!value) return '';
        value = value.toString();
        return value.substring(0, 1).toUpperCase() + value.substring(1).toLowerCase();
    });
    inject('Kb2Gb', (value) => {
        if (!value) return '';
        return (Math.floor(value / 1024) / 1024 / 1024).toFixed(2) + 'GB';
    });
    inject('Kb2Mb', (value) => {
        if (!value) return '';
        return (Math.floor(value / 1024)).toFixed(2) + 'MB';
    });
    inject('Mb2Gb', (value) => {
        if (!value) return '';
        if (value < 1024) return value + 'MB';
        return Math.round(value / 1024, 2) + 'GB';
    });
    inject('Gb2Tb', (value) => {
        if (!value) return '';
        if (value < 1024) return value + 'GB';
        return Math.round(value / 1024, 2) + 'TB';
    });
    inject('cutstring', (value) => {
        if(value.length > 50) {
            return value.substring(0, 60) + '...';
        }
        return value;
    })
}

