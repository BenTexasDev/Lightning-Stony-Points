import { LightningElement, track,api } from 'lwc';
import LANG from '@salesforce/i18n/lang';
import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';
import { NavigationMixin } from 'lightning/navigation';


export default class OppCard extends NavigationMixin(LightningElement)
{
    @api name;
    @api stage;
    @track formattedDate;
    @track formattedAmount;
    @api oppId;
    @track openmodal = false;
   
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

    openModal(){
        this.openmodal = true
    }

    closeModal(){
        this.openmodal = false
    }
    //We start to see buttons
    viewRecord() {
        //console.log(this.oppId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.oppId,
                actionName: 'view',
            },
        });
    }

}
