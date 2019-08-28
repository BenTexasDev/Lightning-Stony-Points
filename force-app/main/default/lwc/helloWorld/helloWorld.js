import { LightningElement } from 'lwc';
import GenWatt2 from '@salesforce/resourceUrl/GenWatt2';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class HelloWorld extends LightningElement {
    constructor() {
        super();
        loadStyle(this, GenWatt2)
        .then(() => { /*Callback*/})
    }
}
