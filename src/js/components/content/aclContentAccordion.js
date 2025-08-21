import { mxContent } from '/src/js/mixins/index.js';

export default function (params) {
    return {
        ...mxContent(params),
        // PROPERTIES
        open: [],
        // INIT
        init() {
            this._mxContent_setValues(params);
            this.render();
        },
        // GETTERS
        // METHODS
        _mxContent_setValues2(params) {
            this.mxContent_btn = params.btn;
            this.mxContent_img = params.img;
            this.mxContent_title = params.title;
            this.mxContent_subtitle = params.subtitle;
            this.mxContent_text = params.text;
            this.mxContent_subtext = params.subtext;
        },
        isOpen(i) {
            if (!this.open) return false;
            return this.open.indexOf(i) > -1
        },
        toggleIcon(i) {
            if (!this.open) return 'chevronDown';
            return this.open.indexOf(i) ? 'chevronDown' : 'chevronUp'
        },
        toggle(i) {
            if (!this.open) return;
            const index = this.open.indexOf(i);
            if (index == -1) this.open.push(i);
            else this.open.splice(index, 1);;
        },
        render() {
            const html = ` 
            <div class="relative flex flex-col w-full h-full lg:my-0">
                <template x-for="(col, i) in mxContent_items || []">
                    <div id="accordion-arrow-icon" data-accordion="open" @click="toggle(i)">
                      <h2 id="accordion-arrow-icon-heading-1">
                        <button type="button" class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-900 bg-gray-100 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-arrow-icon-body-1" aria-expanded="true" aria-controls="accordion-arrow-icon-body-1">
                            <span class="flex items-center">
                                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" x-data="aclIconsSvg({icon: col.icon })"></svg>
                                <span class="mx-2" x-text="col.title"></span>
                            </span>
                          
                          <span class="justify-end">
                            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" x-data="aclIconsSvg({icon: toggleIcon(i) })"></svg>
                          </span>
                        </button>
                      </h2>
                      <div x-show="isOpen(i)" id="accordion-arrow-icon-body-1" aria-labelledby="accordion-arrow-icon-heading-1">
                        <div  x-html="col.text" class="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
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