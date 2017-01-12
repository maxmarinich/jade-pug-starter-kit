'use strict';

import fs from 'fs';
import path from 'path';
import { createInterface } from 'readline';

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// assets folders
var JADE_DIR = path.join(__dirname, 'assets/template/partitial/');
var SASS_DIR = path.join(__dirname, 'assets/sass/');
var rl = createInterface(process.stdin, process.stdout);
var couter = 1;

// default content for files
var fileSources = {
    jade: `mixin {blockName}()\n    .{blockName}\n        .{blockName}__`,
    sass: `.{blockName}\n  display block\n  `
};

// get arguments
var blockName = process.argv[2];
var folderType = blockName.split('-')[0];
var folderName = (function () {
    switch (folderType) {
        case 'b':
            return 'blocks';
        case 's':
            fileSources.jade = `mixin {blockName}()\n    section.{blockName}\n        .container`;
            return 'sections';
        case 'modal':
            fileSources.jade = `mixin {blockName}()\n    section.{blockName}\n        .{blockName}__inner`;
            return 'modal';
        case 'pr':
            return 'previews';
        case 'f':
            fileSources.jade = `mixin {blockName}()\n    form.{blockName}.f-default\n        .f-default__row\n            input.f-default__field(type='text' placeholder='')`;
            return 'forms';
        case 'l':
            return 'lists';
        case 'm':
            fileSources.jade = `mixin {blockName}()\n    ul.{blockName}\n        li.{blockName}__li\n            a.{blockName}__link(href='#') `;
            return 'menus';
        case 'i':
            return 'i';
        case 't':
            return 'tables';
        default:
            console.log('Update script or create folder');
            rl.close();
    }
})();

function readWriteAsync(folderName, blockName) {
    fs.readFile('assets/sass/import/' + folderName + '.sass', 'utf-8', function (err, data) {
        if (err) {throw err; }
        var newValue = data + '\n@import "' + '../' + folderName + '/' + blockName + '"';
        fs.writeFile('assets/sass/import/' + folderName + '.sass', newValue, 'utf-8', function (err) {
            if (err) throw err;
            console.log(couter + '. sass import file updated');
            couter++;
        });
    });
    fs.readFile('assets/template/partitial/mixins/' + folderName + '.jade', 'utf-8', function (err, data) {
        if (err) {throw err; }
        var newValue = data + '\ninclude ' + '../' + folderName + '/' + blockName;
        fs.writeFile('assets/template/partitial/mixins/' + folderName + '.jade', newValue, 'utf-8', function (err) {
            if (err) {throw err; }
            console.log(couter + '. Jade mixin file updated');
            couter++;
        });
    });
}

function isFileExist(folderName, blockName) {
    var promises = [];
    Object.keys(fileSources).forEach(ext => {
        var filePath = ext === 'jade'
            ? JADE_DIR + folderName + '\\' + blockName + '.jade'
            : SASS_DIR + folderName + '\\' + blockName + '.sass';
        promises.push(
            new Promise((resolve, reject) => {
                fs.stat(filePath, function (err, stat) {
                    if (err === null) {
                        console.log(couter + '. WARNING: ' + ext.capitalizeFirstLetter() + ' file already exists!');
                        couter++;
                        rl.close();
                    } else {
                        console.log(couter + '. ' + ext.capitalizeFirstLetter() + ' file not exists');
                        couter++;
                        resolve();
                    }
                });
            })
        );
    });
    return Promise.all(promises);
}

function createFiles(folderName, blockName) {
    var promises = [];
    Object.keys(fileSources).forEach(ext => {
        var blockPath = ext === 'jade' ? JADE_DIR + folderName : SASS_DIR + folderName;
        var fileSource = fileSources[ext].replace(/\{blockName}/g, blockName);
        var filename = `${blockName}.${ext}`;
        var filePath = path.join(blockPath, filename);
        promises.push(
            new Promise((resolve, reject) => {
                fs.writeFile(filePath, fileSource, 'utf8', err => {
                    if (err) {
                        reject(`WARNING: Failed to create a file '${filePath}'`);
                    } else {
                        resolve();
                    }
                });
            })
        );
    });
    readWriteAsync(folderName, blockName);
    return Promise.all(promises);
}

function initMakeBlock(blockName, folderName) {
    return isFileExist(folderName, blockName)
        .then(() => createFiles(folderName, blockName))
        .then(() => {
            console.log(couter + '. ' + blockName + ' files created');
            couter++;
            rl.close();
        });
}

if (blockName !== '') {
    initMakeBlock(blockName, folderName).catch(function printErrorMessage(errText) {
        console.log(errText);
        rl.close();
    });
}
