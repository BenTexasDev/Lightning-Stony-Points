import { LightningElement, api, track, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/opportunityController.getOpportunities';
import getPicklistValues from '@salesforce/apex/opportunityController.getPicklistValues';
import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import CLOSE_DATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';



const COLS = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Stage', fieldName: 'StageName', editable: false },
    { label: 'Amount', fieldName: 'Amount', editable: true, type: 'currency' },
    { label: 'Close Date', fieldName: 'CloseDate', editable: true, type: 'date' }
];


export default class OppList extends LightningElement {
    @api recordId;
    @track allOpportunities;
    @api displayedOpportunities;
    @track error;
    @api status = 'All';
    @track dataRetrieved = false; 
    @track iMode = 'Tile';
    @api 
    get mode() {
        return this.iMode;
    }
    set mode(value) {
        this.iMode = value;
        if (value === 'Tile') {
            this.tileMode = true;
        } else {
            this.tileMode = false;
        }
    }
    @track tileMode = true;
    @track columns = COLS;
    @track formattedAmount = 0;
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
    @api totalRecords = 0;
    @wire(getOpportunities, {accountId: '$recordId'})
    wiredOpportunities(value) {
        this.results = value;
        if (this.results.data) {
            this.allOpportunities = this.results.data;
            this.displayedOpportunities = this.results.data;
            this.dataRetrieved = true;
            this.updateList();
        }
        else if (this.results.error){
            this.error = this.results.error;
            this.dataRetrieved = false;
        }
    }

    @wire(getPicklistValues) 
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.picklistValues = data;
            //console.log('picklist values: ' + JSON.stringify(picklistValues)); 
        } else if (error) {
            //console.log('error retrieving picklist values '); 
            //console.log('error: ' + JSON.stringify(error));
            this.error = error;
        }
    }

        handleViewChange(event) {
            const selectedItemValue = event.detail.value;
            switch (selectedItemValue) {
                case 'tile':
                    this.mode = 'Tile';
                    break;
                case 'table':
                        this.mode = 'Table';
                    break;
                default:
            }
        }
        handleChange(event) {
            this.status = event.detail.value;
            this.label = event.detail.label;
            //console.log(this.status);
            this.updateList();
        }
    
        updateList() { 
            var filter = [];
            var k = 0;
            var i;
            var o;
            this.formattedAmount = 0;
            if (this.dataRetrieved) {
                for (i=0; i<this.allOpportunities.length; i++){
                    o = this.allOpportunities[i];
                    if (this.status !== 'All') {
                        if (this.status === 'Open') {
                            if (!o.IsClosed) {
                              filter[k] = o;
                              this.formattedAmount += o.Amount;
                              k++;                              
                             }
                            } else if (this.status === 'Closed') {
                                if (o.IsClosed) {
                                    //this is Closed,so add it to the filter
                                    filter[k] = o;
                                    this.formattedAmount += o.Amount;
                                    k++;
                                }
                            }  else if (this.status === o.StageName) {                    
                                //this is the stage filter
                                filter[k] = o;
                                this.formattedAmount += o.Amount;
                                k++; 
                            } 
                        } else {
                            //total the amount
                            this.formattedAmount += o.Amount;
                            //add the entire list to the filter
                            filter = this.allOpportunities;  
                        }
                    }
                    this.displayedOpportunities = filter;
                    this.totalRecords = this.displayedOpportunities.length;
                }
            }

    handleSave(event) {     

        const fields = {};

        fields['Id'] = event.detail.draftValues[0].Id;
        fields[NAME_FIELD.fieldApiName] = event.detail.draftValues[0].Name;
        fields[AMOUNT_FIELD.fieldApiName] = event.detail.draftValues[0].Amount;
        fields[CLOSE_DATE_FIELD.fieldApiName] = event.detail.draftValues[0].CloseDate;
        fields[STAGE_FIELD.fieldApiName] = event.detail.draftValues[0].StageName;

        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        console.log('calling promise');
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(opps => {
            console.log('in promise');
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Opportunities updated',
                    variant: 'success'
                })
            );
             // Clear all draft values
             this.draftValues = [];
    
             // Display fresh data in the datatable
             console.log('refresh');
             refreshApex(this.results);
             this.updateList();
             console.log('refreshed');
        }).catch(error => {
            // Handle error
        });
    }
}
