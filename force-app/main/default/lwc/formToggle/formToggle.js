import { LightningElement, track, api } from 'lwc';

export default class FormToggle extends LightningElement {
    @track editMode = false;
    @api recordId;

    handleChange(event){
        this.editMode = !this.editMode;
    }

    handleCancel(event){
        this.editMode = false;
    }

    handleSave(event){
        this.editMode = false; // switch back to false so that it will re-render.
    }
}