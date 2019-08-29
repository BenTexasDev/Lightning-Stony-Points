import { LightningElement, wire,api,track } from 'lwc';
import getOpportunities from '@salesforce/apex/opportunityController.getOpportunities';
//import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import getPicklistValues from '@salesforce/apex/opportunityController.getPicklistValues';

const COLS = [//Added columns here
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Stage', fieldName: 'StageName', editable: false },
    { label: 'Amount', fieldName: 'Amount', editable: true, type: 'currency' },
    { label: 'Close Date', fieldName: 'CloseDate', editable: true, type: 'date' }
];

export default class OppList extends LightningElement 
{
    @api recordId;
    @track allOpportunities;
    @api displayedOpportunities; //captures filter
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
    @track columns = COLS;//Added columns here
    @track formattedAmount = 0;
    @api totalRecords = 0;

    //Start wire
    @wire(getOpportunities,{accountId:'$recordId'})
    wiredOpportunities(value)
    {
        this.results = value;
        if(this.results.data)
        {//if there is actually data there
            this.allOpportunities = this.results.data;
            this.displayedOpportunities = this.results.data;
            this.dataRetrieved =true;
        } else if (this.results.error)
        { //else if there is an error
            this.error = this.results.error;
            this.dataRetrieved = false;
        }

    }
    //another wire for picklist values
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
    //This is where we add the options to our tile.
    handleViewChange(event)
    {
        const selectedItemValue = event.detail.value;
        switch(selectedItemValue){
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

    updateList(){
        var filter = [];
        var k = 0;
        var i;
        var o;
        this.formattedAmount = 0;
        if (this.dataRetrieved){
            for (i=0; i<this.allOpportunities.length;i++){
                o = this.allOpportunities[i];
                if(this.status !== 'All'){
                    if(this.status === 'Open'){
                        if (!o.IsClosed){
                            filter[k] = o;
                            this.formattedAmount += o.Amount;
                            k++;
                        }
                    }else if (this.status === 'Closed') {
                        if (o.IsClosed) {
                        //this is Closed,so add it to the filter
                        filter[k] = o;
                        this.formattedAmount += o.Amount;
                        k++;
                        }
                    }else if (this.status === o.StageName) {                    
                     //this is the stage filter
                        filter[k] = o;
                        this.formattedAmount += o.Amount;
                    k++; 
                    }
                    }else {
                        //total the amount
                        this.formattedAmount += o.Amount;
                        //add the entire list to the filter
                        filter = this.allOpportunities;  
                }
 
            }

            this.displayedOpportunities = filter;
            this.totalRecords = this.displayedOpportunities.length;//getting the number of elements.
        }
    }
}
