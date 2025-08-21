import { mxContent, mxNavigation, mxForm, mxEvent } from '/src/js/mixins/index.js';
import * as components from '/src/js/components/index.js'


export default function (params) {
    return {
        ...mxContent(params),
        ...mxForm(params),
        ...mxNavigation(params),
        ...mxEvent(params),
        // PROPERTIES 
        items: [], 
        contextStage: null,
        interval: null,
        step: 0,
        maxInterval: 1,
        intervalCount: 0,
        // INIT
        async init() {
            if (!params) return;
            this._mxForm_SetValues(params.form || {});
            this._mxContent_setValues(params.card || {});
            this.setValues(params || {});
            this.render();
            await this.submit();

            this._mxEvent_On(this.form.event, async (params) => {
                if(!!params) this.setValues(params || {});
                await this.submit();
            })

            if (params.items == null) return;
             
            const self = this;
            this.step = this.items.map(x => x.showProgress).indexOf(true);
            if (this.step == -1) this.step = 0; 
            console.log(this.items)
            this.interval = setInterval(async function () {
                // method to be executed;
                self.submit();
                self.intervalCount++;
                if (self.intervalCount == self.maxInterval) {
                    self.cancelTimer();
                    self.items[self.step].showProgress = false;
                    self.items[self.step].success = false;
                }
            }, 2000);

        },
        // GETTERS
        // METHODS

        setValues(params) {
            params = params || {};
            this.items = params.items;
            this.form = params.form;
        },
        cancelTimer() {
            clearInterval(this.interval);
        },
        async submit() {
            this.mxForm_loading = true;
            try {
                var operation = this.items[this.step].title;
                const formData = {
                    operation: operation
                }
                const response = await this.$fetch.PUT(this.form.action, formData);
                const data = response.data;
               
                this.items[this.step].success = data.success;
                this.items[this.step].showProgress = data.showProgress;
           //     if (data.success) this.intervalCount = 0;
              
                this.$dispatch('submit', formData)
            } catch (e) {
                //console.log(e);
            }
            this.mxForm_loading = false;
        },
        setCardContent(data) {
            this.mxContent_title = data.title;
            this.mxContent_subtitle = data.subtitle;
            this.mxContent_text = data.text;
        },
        render() {
            const html = `
                <div x-data="aclContentStepper({items: items})"></div>

            `
            this.$nextTick(() => { this.$root.innerHTML = html });
        }
    }
}