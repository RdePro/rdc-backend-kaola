import Vue from 'vue';

import eventBus from '~/eventbus';
import Layout from './layout';

export default {
    name: 'layout-kaola-advanced',

    type: 'layout',

    async apply(ctx) {
        let layout = null;
        let el = null;

        await ctx.api.layout.register({
            name: 'kaola-advanced',

            mount(node, {
                ctx
            }) {
                if (!layout) {
                    Vue.config.devtools = process.env.NODE_ENV === 'development';

                    layout = new Vue( Layout, {
                        props: {
                            $ctx: ctx
                        }
                    });

                    if ( window.__VUE_DEVTOOLS_GLOBAL_HOOK__ ) {
                        window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = layout.constructor;
                    }

                    eventBus.$on('requestError', (res, catchError) => {
                        ctx.events.emit('layout:requestError', res, catchError);
                    });
                }

                if (el) {
                    node.appendChild(layout.$el);
                } else {
                    el = document.createElement('div');
                    node.appendChild(el);
                    layout.$mount(el);
                }

                setTimeout(() => {
                    const findRelatedComponent = (el) => {
                        while (!el.__vue__ && el.parentElement) {
                          el = el.parentElement;
                        }
                        return el.__vue__;
                    };
                    let parent = findRelatedComponent(layout.$refs.$$mount);
                    const child = layout.$refs.$$mount.firstChild.__vue__;

                    // regular页面
                    if (!child) {
                        return;
                    }

                    while (parent.$options.abstract && parent.$parent) {
                        parent = parent.$parent;
                    }
                    parent.$children.push(child);

                    child.$parent = parent;
                    child.$root = parent ? parent.$root : child;
                }, 0);
            },

            unmount(node) {
                if (!layout) {
                    return;
                }

                if (layout.$el && (layout.$el.parentNode === node)) {
                    node.removeChild(layout.$el);
                }
            },

            update(data = {}) {
                if (!layout) {
                    return;
                }

                if (data.ctx) {
                    layout.$ctx = data.ctx;
                }
                layout.$forceUpdate();
            },

            getMountNode() {
                return layout && layout.$refs.$$mount;
            },
        });
    }
};
