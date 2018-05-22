// I referenced this example to code this file
// https://github.com/mdn/webextensions-examples/blob/master/react-es6-popup/webpack.config.js

// import * as path from "path";
const path = require('path');
// import * as webpack from "webpack";
const webpack = require('webpack');

module.exports = {

    mode: "production",

    entry: {
        launcher: './src/launcher.js',
        storage: './src/storage.js'
    },
    output: {
        // webpage-sidebar/ext/src/name.js
        path: path.join(path.resolve(__dirname), 'extension', 'src'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['js'],
        modules: [
            'src',
            'node_modules',
        ]
    },
    devtool: 'sourcemap'
};