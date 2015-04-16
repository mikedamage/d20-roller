/**
 * Die-roll notation parser
 * Heavily inspired by https://gist.github.com/Zirak/1761880
 */

/* jshint node: true */

'use strict';

var _      = require('lodash');
var Random = require('random-js');

var DEFAULTS = {
  engine: Random.engines.nativeMath
};

var operators = {
  '+': {
    precedence: 1,
    exec: function(a, b) {
      return a + b;
    }
  },

  '-': {
    precedence: 1,
    exec: function(a, b) {
      return a - b;
    }
  },

  '*': {
    precedence: 2,
    exec: function(a, b) {
      return a * b;
    }
  },

  '/': {
    precedence: 2,
    exec: function(a, b) {
      if (b === 0) {
        throw new Error('Division by 0');
      }
      return a / b;
    }
  },

  'd': {
    precedence: 3,
    exec: function(rolls, sides, carry) {
      var roll;
      var ret = { results: [], total: 0 };

      while (rolls--) {
        roll = Random.dice(sides, 1)(this.options.engine);
        carry.push(roll);
        ret.total += roll;
      }
    }
  }
};

var Parser = function Parser(options) {
  if (!options || !_.isObject(options)) {
    options = {};
  }

  this.options = _.assign({}, DEFAULTS, options);
  this._operators = operators;
};

module.exports = Parser;
