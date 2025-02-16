'use strict';
const fs = require('fs');
const upath = require('upath');
const pug = require('pug');
const sh = require('shelljs');
const prettier = require('prettier');

module.exports = function renderPug(filePath) {
    const verifyFileSrc = upath.resolve(upath.dirname(__filename), '../src/verify-admitad.txt');
    const verifyFileDest = upath.resolve(upath.dirname(__filename), '../dist/verify-admitad.txt');

    if (fs.existsSync(verifyFileSrc)) {
        fs.copyFileSync(verifyFileSrc, verifyFileDest);
        console.log(`### INFO: Copied verify-admitad.txt to dist/`);
    } else {
        console.log(`### INFO: not copy verify-admitad.txt to dist/`);
    }

    const destPath = filePath.replace(/src\/pug\//, 'dist/').replace(/\.pug$/, '.html');
    const srcPath = upath.resolve(upath.dirname(__filename), '../src');

    console.log(`### INFO: Rendering ${filePath} to ${destPath}`);
    const html = pug.renderFile(filePath, {
        doctype: 'html',
        filename: filePath,
        basedir: srcPath
    });

    const destPathDirname = upath.dirname(destPath);
    if (!sh.test('-e', destPathDirname)) {
        sh.mkdir('-p', destPathDirname);
    }

    const prettified = prettier.format(html, {
        printWidth: 1000,
        tabWidth: 4,
        singleQuote: true,
        proseWrap: 'preserve',
        endOfLine: 'lf',
        parser: 'html',
        htmlWhitespaceSensitivity: 'ignore'
    });

    fs.writeFileSync(destPath, prettified);
};
