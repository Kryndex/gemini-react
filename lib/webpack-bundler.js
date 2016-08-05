'use strict';
const webpack = require('webpack');
const webpackMiddleware = require('koa-webpack-dev-middleware');

function readWebpackLoaders(filepath) {
    const config = require(filepath);
    if (typeof config === 'function') {
        return config();
    }
    return config.module.loaders;
}

class WebpackBundler {
    constructor(options) {
        this._webpackConfig = {
            module: {
                loaders: readWebpackLoaders(options.webpackConfig)
            },
            entry: {},
            output: {
                path: '/',
                filename: '[name]'
            }
        };
    }

    bundle(chunkName, jsFilePath) {
        this._webpackConfig.entry[chunkName] = [jsFilePath];
    }

    /**
     * @param {String} mountUrl
     */
    buildMiddlewhare(mountUrl) {
        this._webpackConfig.output.publicPath = mountUrl;
        return webpackMiddleware(webpack(this._webpackConfig), {
            publicPath: mountUrl,
            quiet: true
        });
    }
}

module.exports = WebpackBundler;