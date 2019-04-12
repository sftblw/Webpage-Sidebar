// https://github.com/masonz/parcel-vue-ts/blob/master/packages/template/vue.config.js
// https://cli.vuejs.org/config/#vue-config-js

var TypeScriptAsset = require('parcel-bundler/src/assets/TypeScriptAsset.js')
var autoprefixer = require('autoprefixer')

module.exports = {
    // extractCSS: process.env.NODE_ENV === 'production',
    postcss: [autoprefixer()],
    customCompilers: {
        ts: function (content, cb, compiler, filePath) {
            let ts = new TypeScriptAsset(filePath, {}, { rootDir: filePath })
            ts.contents = content
            ts.process().then(res => {
                cb(null, res.js)
            })
        }
    }
}