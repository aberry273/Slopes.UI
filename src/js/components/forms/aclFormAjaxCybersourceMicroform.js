import { mxContent, mxForm, mxFetch, mxCommon, mxField } from '/src/js/mixins/index.js';

export default function (params) {
    return {
        ...mxContent(params),
        ...mxForm(params),
        ...mxField(params),
        ...mxFetch(params),
        ...mxCommon(params),
        // PROPERTIES
        header: '',
        formData: {},
        secureCardData: {
            Name: null,
            Number: null,
            ExpMonth: null,
            ExpYear: null,
            SecurityCode: null,
        },
        numberFieldContainerId: 'cardNumberContainer',
        securityCodeFieldContainerId: 'securityCodeContainer',
        accountNumberFieldContainerId: 'accountNumberContainer',
        confirmAccountNumberFieldContainerId: 'confirmAccountNumberContainer',
        routingNumberFieldContainerId: 'routingNumberContainer',
        cardFields: [],
        bankFields: [],
        cardDataValid: false,
        paymentMethod: "card", //check
        jwkJson: null,
        loading: false,
        // INIT
        //https://github.com/CyberSource/cybersource-flex-samples-node/blob/master/express-microform/views/index.ejs
        //https://github.com/CyberSource/cybersource-flex-samples-node
        async init() {
            //override submit button
            //get values from card number, security code, expMonth and year
            //send to hidden fields
            //generate token
            //display errors
            this.formData = params;
            this.jwkJson = params.jwkJson;//JSON.parse(params.jwkJson);
            this.bankFields = params.bankFields;
            this.cardFields = params.cardFields;
            this._mxFetch_setValues(params);
            this.formData.submit = this.onSubmit;
            this.render();
        },
        // GETTERS
        // METHODS 
        onFieldChange(ev) {
            const field = ev.detail;
            switch (field.name) {
                // Update this to retrieve the fieldvalue from cybersource values
                case "Name":
                    this.secureCardData[field.name] = field.value;
                    break;
                case "Number":
                    this.secureCardData[field.name] = field.value;
                    this.$store.svcCybersource.setNumberField(field.value);
                    break;
                case "ExpMonth":
                    this.secureCardData[field.name] = field.value;
                    break;
                case "ExpYear":
                    this.secureCardData[field.name] = field.value;
                    break;
                case "SecurityCode":
                    this.secureCardData[field.name] = field.value;
                    break;
                case "Payment Method":
                    const pm = (field.value == 'Card')
                        ? 'card'
                        : 'check'
                    this._mxCommon_UpdateRouteParam("pm", pm)
                    window.location.reload();
                    break;
                default:
                    return;
            }
        },
        async onSubmit(data) {
            this.loading = true;
            await this.createToken(data, this.formData);
        },
        async loadForm(jwk) {
            this.$store.svcCybersource.loadForm(this.paymentMethod, jwk);
        }, 
        //https://stackoverflow.com/questions/61501493/send-add-cvv-cvn-field-on-cybersource-flex-microform
        //https://developer.cybersource.com/docs/cybs/en-us/digital-accept-flex-api/developer/ctv/rest/flex-api/microform-integ-v2/api-reference-v2.html
               
        async createToken(submittedData, formData) { 
            try {
                /*
                this._mxEvent_On(this.$store.wssSvcPosts.getMessageEvent(), (result) => {
                    const data = result.data.data;
                    this.mxSocial_postItems.push(data);
                })
                */
                var errorsOutput = document.querySelector('#errors-output');
                const self = this;
                var options = {
                    //type: 'mastercard'
                    expirationMonth: this.secureCardData.ExpMonth,
                    expirationYear: this.secureCardData.ExpYear
                };
                //https://developer.cybersource.com/docs/cybs/en-us/digital-accept-flex-api/developer/ctv/rest/flex-api/microform-integ-v2/api-reference-v2/class-microform-v2.html

                this.$store.svcCybersource.createToken(options, async function (err, token) {
                    if (err) {
                        // handle error
                        console.error(err);
                    } else { 
                        await self.saveToken(token, submittedData, formData);
                    }
                }); 
            } catch (e) {
                console.log(e);
                this.loading = false;
            } 
        },

        async saveToken(token, submittedData, formData) {
            // else
            this.loading = true;
            try {
                submittedData.token = token;
                submittedData.captureContext = this.jwkJson;
               
                const result = await this.$fetch.POST(formData.action, submittedData);

                if (result != null && result.status == 200) {
                    if (this.mxForm_event) {
                        this.$dispatch(this.mxForm_event, result)
                    }
                    this.$dispatch(this.localEvent, result)
                }
                else {
                    let message = result.message;
                    if (result.errors) {
                        let joinedMessage = "";
                        var keys = Object.keys(result.errors);
                        for (let i = 0; i < keys.length; i++) {
                            joinedMessage += `${result.errors[keys[i]].propertyMessage}\n`;
                        }
                        this.mxForm_response = joinedMessage;
                    }
                    else {
                        this.mxForm_response = result.message || 'Update failed';
                    }
                }
                
            } catch (e) {
                console.log(e);
            }
            this.loading = false;
        },
        overrideSubmit(e) {
            e.preventDefault();
            return;
        },
        render() {
            const html = `
                <style>
                    #number-container, #securityCode-container {
                        height: 38px;
                    }

                    .flex-microform-focused {
                        background-color: #fff;
                        border-color: #80bdff;
                        outline: 0;
                        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
                    }
                    flex-microform {
                      height: 20px;
                      background: #ffffff;
                      -webkit-transition: background 200ms;
                      transition: background 200ms;
                    }

                    /* different styling for a specifc container */
                    #securityCode-container.flex-microform {
                      line-height: 28px;
                      padding: 16px;
                      padding-inline-start: 40px;
                      padding-inline-end: 40px;
                      font-size: 20px;
                    }
                    #number-container.flex-microform {
                      line-height: 28px;
                      padding: 16px;
                      padding-inline-start: 40px;
                      padding-inline-end: 40px;
                      font-size: 20px;
                    }
                </style>

                <div>
                    <div
                        :class="mxForm_class"
                        x-show="loading"
                        x-data="aclCommonProgress({})"></div>

                    <div x-data="aclFormAjax(formData)" @onfieldchange="onFieldChange"></div>

                    <!--Response message-->
                    <div id="errors-output" role="alert"></div>
                    <template x-if="mxForm_response">
                        <p :class="mxForm_responseClass" x-html="mxForm_response"></p>
                    </template>

                    <span x-data="{ init() { this.loadForm(this.jwkJson) } }"></span>
                    <!--
                     <div class="form-group">
                        <label for="cardholderName">Name</label>
                        <input id="cardholderName" class="form-control" name="cardholderName" placeholder="Name on the card">
                        <label id="cardNumber-label">Card Number</label>
                        <div id="number-container" class="form-control"></div>
                        <label for="securityCode-container">Security Code</label>
                        <div id="securityCode-container" class="form-control"></div>
                    </div>
                    -->
                    <!--Hidden PCI Compliant fields-->
                    <div class="form-group" x-show="false">
                       
                        <input type="hidden" id="flexresponse" name="flexresponse">
                    </div>

                 
                </div>
            `
            this.$nextTick(() => { this.$root.innerHTML = html });
        },
    }
}