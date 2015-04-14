/* jshint node: true */

'use strict';

var _ = require('lodash');

var NDN_PATTERN = /(\d+)[dD](\d+)\+?(\d+)?/;
var DEFAULTS    = {
  pattern: NDN_PATTERN
};

var Roller = function Roller(opts) {

  if (!_.isObject(opts)) {
    opts = {};
  }

  this.options = _.assign({}, DEFAULTS, opts);

  this.prototype.roll = function roll(diceString) {
    var matches = diceString.match(this.options.pattern);
  };

};

module.exports = Roller;
