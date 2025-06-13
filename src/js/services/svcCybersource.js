const Flex = window.Flex
const cleaveZen = window.cleaveZen
const {
    formatCreditCard,
    getCreditCardType,
    registerCursorTracker,
    DefaultCreditCardDelimiter,
    unformatCreditCard,
} = cleaveZen
//import flex from './flex-sdk-web.min.js';
import { mxEvent, mxFetch, mxService, mxToast } from '/src/js/mixins/index.js';
//https://developer.cybersource.com/api/developer-guides/dita-flex/SAFlexibleToken/FlexMicroform.html
//https://developer.cybersource.com/docs/cybs/en-us/digital-accept-flex-api/developer/ctv/rest/flex-api/microform-integ-v2/api-reference-v2.html
//https://developer.cybersource.com/docs/cybs/en-us/digital-accept-flex-api/developer/ctv/rest/flex-api/microform-integ-v2/api-reference-v2/class-microform-v2.html
export default function (settings) {
    return {
        ...mxEvent(settings),
        ...mxFetch(settings),
        ...mxService(settings),
        ...mxToast(settings),
        // PROPERTIES
        jwkJson: null,
        microform: null,
        numberField: null,
        securityCodeField: null,
        routingNumberField: null,
        accountNumberField: null,
        confirmAccountNumberField: null,
        self: null,
        async init() {
            this.self = this;
        },
        // GETTERS
        // METHODS
        loadForm(type = "card", captureContext) {
            // Styles
            //https://developer.cybersource.com/docs/cybs/en-us/digital-accept-flex-api/developer/all/so/flex-api/microform-integ-v2/styling-v2.html
            var myStyles = {
                'input': {
                    'font-size': '20px',
                    'line-height': '28px',
                    'padding': '16px'
                },
                /*
                'input': {
                    'font-size': '14px',
                    'font-family': 'helvetica, tahoma, calibri, sans-serif',
                    'color': '#555',
                    'line-height': '38px'
                },
                ':focus': { 'color': 'blue' },
                'valid': { 'color': '#3c763d' },
                */
                ':disabled': { 'cursor': 'not-allowed' },
                'invalid': { 'color': '#ef4444' }
            };
            // Setup
            var flex = new Flex(captureContext);
            this.microform = flex.microform(type, { styles: myStyles });
        },
        createField(name, data) {
            return this.microform.createField(name, data);
        },
        //Card number
        createNumberField() {
            if (this.numberField != null) return this.numberField;
            this.numberField = this.createField('number', { placeholder: 'Enter card number' });
            return this.numberField;
        },
        loadNumberField(elementId) {
            this.createNumberField();
            this.numberField.load(`#${elementId}`);
        },
        //Card Security
        createSecurityField() {
            if (this.securityCodeField != null) return this.securityCodeField;
            this.securityCodeField = this.createField('securityCode', { placeholder: '•••' });
            return this.securityCodeField;
        },
        loadSecurityField(elementId) {
            this.createSecurityField();
            this.securityCodeField.load(`#${elementId}`);
        },
        // Bank Routing Number
        createRoutingNumberField() {
            if (this.routingNumberField != null) return this.routingNumberField;
            this.routingNumberField = this.createField('routingNumber', { placeholder: '•••' });
            return this.routingNumberField;
        },
        loadRoutingNumberField(elementId) {
            this.createRoutingNumberField();
            this.routingNumberField.load(`#${elementId}`);
        },
        // Bank Number
        createAccountNumberField() {
            if (this.accountNumberField != null) return this.accountNumberField;
            this.accountNumberField = this.createField('accountNumber', { placeholder: '•••' });
            return this.accountNumberField;
        },
        loadAccountNumberField(elementId) {
            this.createAccountNumberField();
            this.accountNumberField.load(`#${elementId}`);
        },
        // Bank Number Confirm
        createConfirmAccountNumberField() {
            if (this.confirmAccountNumberField != null) return this.confirmAccountNumberField;
            this.confirmAccountNumberField = this.createField('accountNumberConfirm', { placeholder: '•••' });
            return this.confirmAccountNumberField;
        },
        loadConfirmAccountNumberField(elementId) {
            this.createConfirmAccountNumberField();
            this.confirmAccountNumberField.load(`#${elementId}`);
        },
        async createToken(options, cb) {
            await this.microform.createToken(options, cb);
        },
    }
}