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
        iteration: 0,
        maxInterval: 20,
        intervalCount: 0,
        successIcon: 'checkCircle',
        failedIcon: 'xCircle',
        inProgressIcon: 'ellipsisHorizontalCircle',
        // INIT
        async init() {
            if (!params) return;
            const self = this;
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
             
            this.iteration = this.items.map(x => x.showProgress).indexOf(true);
            if (this.iteration == -1) {
                this.iteration = 0;
                // Set the first vlaue to be in progress by default
                this.items[0].showProgress = true;
            }
            this.interval = setInterval(async function () {
                // method to be executed;
                self.submit();
                self.intervalCount++;
                if (self.intervalCount == self.maxInterval) {
                    self.cancelTimer();
                    self.setStageNoResponse(self.items[self.iteration]);
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
        setStageNoResponse(step) {
            step.showProgress = false;
            step.success = null;
            step.icon = 'exclamationCircle';
            step.text = 'No update from server';
            step.title += '*';
        },
        setStageFromResponse(step, data) {
            step.success = data.success;
            step.subtitle = data.substatus;
            if (step.success === null) return;
            step.showProgress = false;
            var icon = (step.success == true) ? 'checkCircle' : 'xCircle'
            step.icon = icon;
        },
        setStageFailed() {

        },
        async submit() {
            this.mxForm_loading = true;
            try {
                var operation = this.items[this.iteration].title;
                const formData = {
                    operation: operation
                }
                const response = await this.$fetch.PUT(this.form.action, formData);
                const data = response.data;
                this.setStageFromResponse(this.items[this.iteration], data);
                if (data.success == true) {
                    this.iteration++;
                    this.items[this.iteration].showProgress = true
                    this.intervalCount = 0;
                }
                if (data.success === false) {
                    this.cancelTimer();
                }
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