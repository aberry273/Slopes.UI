const cleaveZen = window.cleaveZen
const {
    formatCreditCard,
    getCreditCardType,
    registerCursorTracker,
    DefaultCreditCardDelimiter,
    unformatCreditCard,
} = cleaveZen

import { mxEvent, mxFetch, mxService, mxToast } from '/src/js/mixins/index.js';

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
        numberFieldContainerId: 'number-container',
        securityCodeFieldContainerId: 'securityCode-container',
        numberField: null,
        securityCodeField: null,
        self: null,
        async init() {
            this.self = this; 
        },
        // GETTERS
        // METHODS
        loadForm(captureContext) {
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
            this.microform = flex.microform({ styles: myStyles });
        },
        createField(name, data) {
            return this.microform.createField(name, data);
        },
        createNumberField() {
            if (this.numberField != null) return this.numberField;
            this.numberField = this.createField('number', { placeholder: 'Enter card number' });
            return this.numberField;
        },
        loadNumberField() {
            this.numberField.load('#' + this.numberFieldContainerId);
        },
        createSecurityField() {
            if (this.securityCodeField != null) return this.securityCodeField;
            this.securityCodeField = this.createField('securityCode', { placeholder: '•••' });
            return this.securityCodeField;
        },
        loadSecurityField() {
            this.securityCodeField.load('#' + this.securityCodeFieldContainerId);
        },
        async createToken(options, cb) {
            await this.microform.createToken(options, cb);
        },
    }
}