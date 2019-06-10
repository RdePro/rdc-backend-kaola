const path = require('path');
const mock = require('./dev-mock');

module.exports = {
    zh: '考拉前端',
    en: 'KAOLAFED',
    host: '0.0.0.0',
    port: 8080,
    layout: 'kaolafed',
    plugins: {
        kaolafed: {
            path: require.resolve('./layout/kaolafed'),
            enable: true
        }
    },
    router: {
        mode: 'history'
    },
    devServer: {
        before: function(app, server) {
            const isProxy = process.argv[2];
            if (isProxy) {
                return;
            }
            mock(app);
        },
        proxy: {
            '/api': 'http://127.0.0.1:7000'
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                vue$: 'vue/dist/vue.esm.js',
                '@@': path.resolve(__dirname, 'layout/kaolafed/common')
            }
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    exclude: [/node_modules/],
                    use: [{
                        loader: 'html-loader'
                    }]
                },
                {
                    test: /\.(js|vue)$/,
                    enforce: 'pre',
                    exclude: [/node_modules/],
                    use: [{
                        loader: 'eslint-loader'
                    }]
                },
                {
                    test: /\.scss$/,
                    enforce: 'pre',
                    use: [
                        {
                            loader: 'style-resources-loader',
                            options: {
                                patterns: [
                                    path.resolve(__dirname, 'layout/kaolafed/styles/mixins/index.scss'),
                                    path.resolve(__dirname, 'layout/kaolafed/styles/var.scss')
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    }
}
