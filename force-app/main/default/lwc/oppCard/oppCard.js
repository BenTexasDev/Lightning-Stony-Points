import { LightningElement, api, track } from 'lwc';
import LANG from '@salesforce/i18n/lang';
import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';

export default class OppCard extends LightningElement {
    @api name;
    @api stage;
    @track formattedDate;
    @track formattedAmount;

    @api
    get closeDate(){
        const dateTimeFormat = new Intl.DateTimeFormat(LANG);
        this.formattedDate = new Date(this.formattedDate);
        return dateTimeFormat.format(this.formattedDate);
    }
    set closeDate(value){
        this.formattedDate=value;
    }
    @api 
    get amount() {
        const numberFormat = new Intl.NumberFormat(LOCALE, {
            style: 'currency',
            currency: CURRENCY,
            currencyDisplay: 'symbol'
        });    
        return numberFormat.format(this.formattedAmount);
    }
    set amount(value) {
        this.formattedAmount = value;
    }

}
