import { LightningElement, wire,api,track } from 'lwc';
import getOpportunities from '@salesforce/apex/opportunityController.getOpportunities';
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
}