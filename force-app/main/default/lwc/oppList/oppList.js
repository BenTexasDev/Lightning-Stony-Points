import { LightningElement, wire,api,track } from 'lwc';
import getOpportunities from '@salesforce/apex/opportunityController.getOpportunities';

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