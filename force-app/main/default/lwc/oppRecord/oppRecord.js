import { LightningElement, api } from 'lwc';


export default class OppRecord extends LightningElement {
    @api recordId;
    @api mode = 'view';

    handleCancel(event){
        this.dispatchEvent(new CustomEvent('cancel'));

    }

    handleSuccess(event){
        this.dispatchEvent(new CustomEvent('success'));
    }
}