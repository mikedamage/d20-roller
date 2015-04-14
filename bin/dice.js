/**
 * d20 Roller
 * by Mike Green
 */

/* jshint node: true */

'use strict';

var _       = require('lodash');
var path    = require('path');
var Roller  = require(path.join(__dirname, '..', 'index.js'));
var argv    = require('yargs').argv;

console.log(argv);
