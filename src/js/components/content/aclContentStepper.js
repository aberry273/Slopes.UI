import { mxContent } from '/src/js/mixins/index.js';

export default function (params) {
    return {
        ...mxContent(params),
        // PROPERTIES
        open: [],
        showTooltip: false,
        // INIT
        init() {
            this._mxContent_setValues(params);
            this.render();
        },
        // GETTERS
        // METHODS
        isOpen(i) {
            if (!this.open) return false;
            return this.open.indexOf(i) > -1
        },
        toggle(i) {
            if (!this.open) return;
            const index = this.open.indexOf(i);
            if (index == -1) this.open.push(i);
            else this.open.splice(index, 1);;
        },
        textColourClass(col, i) {
            console.log(!!col.complete)
            if (!!col.complete)
                return 'text-green-600';
            else if (!col.complete)
                return 'text-red-600';
            else
                return 'text-gray-600';
        },
        stepClass(col, i) {
            if (i == this.mxContent_items.length - 1) {
                return ''
            }
            else {
                return `md:w-full w-fit sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`
            }
        },
        render() {
            const html = `
            <ol @mouseover.away="open = []" class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
                <template x-for="(col, i) in mxContent_items || []">
                    <div 
                        class="flex  items-center dark:text-blue-500"
                        :class="stepClass(col, i)">

                        <div class="flex items-center text-left after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">

                            <!--Icon-->
                            <span  class="flex items-center justify-center w-8 h-8">
                                <svg :class="textColourClass(col, i)" class="w-10 h-10" x-data="aclIconsSvg({icon: col.icon })"></svg>
                            </span>

                            <!--Content-->
                            <div @mouseover="toggle(i)" class="flex flex-col min-w-156 pl-1" style="min-width: 120px;" >
                                <div class="flex flex-row">
                                    <p :class="textColourClass(col, i)" x-text="col.title"></p>
                                </div>
                                <div :class="textColourClass(col, i)" class="text-sm" x-text="col.subtitle"></div>
                            </div>
                        </div>

                        <!--Tooltip-->
                        <div role="tooltip" x-show="isOpen(i)" class="absolute z-10 w-56 -my-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-100 tooltip dark:bg-gray-700">
                            <div x-html="col.text">
                        </div>
                    </div>
                </template>
            </ol>  
            `
            this.$nextTick(() => { this.$root.innerHTML = html });
        }
    }
}