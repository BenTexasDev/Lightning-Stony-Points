import { LightningElement, wire,api,track } from 'lwc';
import getOpportunities from '@salesforce/apex/opportunityController.getOpportunities';

export default class OppList extends LightningElement 
{
    @api recordId;
    @track allOpportunities;
    @api displayedOpportunities; //captures filter
    @track error;

    //Start wire
    @wire(getOpportunities,{accountId:'$recordId'})
    wiredOpportunities(value)
    {
        this.results = value;
        if(this.results.data)
        {//if there is actually data there
            this.allOpportunities = this.results.data;
            this.displayedOpportunities = this.results.data;
        } else if (this.results.error)
        { //else if there is an error
            this.error = this.results.error;
        }

    }
}