import { mxContent, mxNavigation, mxForm, mxEvent } from '/src/js/mixins/index.js';
import * as components from '/src/js/components/index.js'


export default function (params) {
    return {
        ...mxContent(params),
        ...mxForm(params),
        ...mxNavigation(params),
        ...mxEvent(params),
        // PROPERTIES
        component: 'aclCommonSpinner',
        componentData: {},
        navigationData: {},
        form: {},
        titleClass: 'mx-auto my-auto text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl',
        containerClass: 'flex flex-row items-center justify-between flex flex-row py-2 mb-4 border-b border-gray-200 md:mb-6 ',
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
        },
        // GETTERS
        // METHODS
        setValues(params) {
            params = params || {};
            this.form = params.form;
        },
        async submit() {
            this.mxForm_loading = true;
            try {
                const formData = this._mxForm_GetFormData(this.form);
                const response = await this.$fetch.POST(this.form.action, formData);

                this.setCardContent(response);
                if (response.status == 200) {
                    this.clearFields();
                } else {
                    console.log('error creating post');
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
                <div class="mb-4 grid gap-4 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 sm:gap-8 lg:gap-16">
                    <div class="flex flex-col overflow-x-none flex-1 mt-4 w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 lg:px-8 md:px-4 sm:px-2 xs:px-2 py-2">
                        <div class="absolute" x-show="mxForm_loading" x-data="aclCommonProgress({})"></div>

                        <div class="relative flex flex-col w-full h-full lg:my-0">
                            <div class="flex flex-col items-start tracking-tight w-full">
                                <div class="blur-2xl relative text-start w-full">
                                    <div class="xs:text-1xl sm:text-2xl md:text-4xl lg:text-4xl xl:text-4xl break-all mb-4 font-bold text-gray-900 xl:text-6xl" x-html="mxContent_title"></div>
                                    <div class="mb-4 text-gray-600 uppercase " x-html="mxContent_subtitle" :class="mxForm_loading ? 'blur-2xl' : ''"></div>
                                    <div x-html="mxContent_text"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
            this.$nextTick(() => { this.$root.innerHTML = html });
        }
    }
}