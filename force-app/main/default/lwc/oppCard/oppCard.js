/* eslint-disable no-unused-vars */
import {
    LightningElement,
    api,
    track
} from "lwc";
import LANG from "@salesforce/i18n/lang";
import LOCALE from "@salesforce/i18n/locale";
import CURRENCY from "@salesforce/i18n/currency";
import {NavigationMixin} from "lightning/navigation";
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class OppCard extends NavigationMixin(LightningElement) {
    @api name;
    @api stage;
    @track formattedDate;
    @track formattedAmount;
    @api oppId;
    @track openmodel = false;

    @api getcloseDate() {
        const dateTimeFormat = new Intl.DateTimeFormat(LANG);
        this.formattedDate = new Date(this.formattedDate);
        return dateTimeFormat.format(this.formattedDate);
    }
    setcloseDate(value) {
        this.formattedDate = value;
    }

    @api getamount() {
        const numberFormat = new Intl.NumberFormat(LOCALE, {
            style: "currency",
            currency: CURRENCY,
            currencyDisplay: "symbol"
        });
        return numberFormat.format(this.formattedAmount);
    }
    setamount(value) {
        this.formattedAmount = value;
    }

    openmodal() {
        this.openmodel = true
    }
    closeModal() {
        this.openmodel = false
    }

    viewRecord() {
        //console.log(this.oppId);
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: this.oppId,
                actionName: "view"
            }
        });
    }

    handleSuccess(event) {
        //console.log("handleSuccess oppCard");
        this.closeModal();
        this.dispatchEvent(new CustomEvent("success"));
    }
    handleCancel(event) {
        //console.log('handleCancel oppCard');
        this.closeModal();
        this.dispatchEvent(new CustomEvent('cancel'));
    }
    deleteRecord() {
        deleteRecord(this.oppId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Is  Deleted',
                        variant: 'success',
                    }),
                );
                this.dispatchEvent(new CustomEvent('delete'));
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error While Deleting record',
                        message: error.message,
                        variant: 'error',
                    }),
                );
            });
    }

}
