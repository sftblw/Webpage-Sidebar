const { src, dest, series, parallel } = require('gulp');
const del = require('del');

function clean(cb) {
  return del(['extension']);
}

function build(cb) {
  cb();
}


function manifest_copy(cb) {
  return src(['src_workaround/manifest.json'])
    .pipe(dest('extension/'))
}

function sidebar_copy(cb) {
  return src(['src/sidebar/**/*'])
    .pipe(dest('extension/sidebar'))
}

exports.clean = clean;
exports.manifest_copy = manifest_copy;
exports.sidebar_copy = sidebar_copy;

exports.default = series(clean, build, manifest_copy, sidebar_copy);