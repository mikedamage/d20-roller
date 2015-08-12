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

var whitespace = {
  ' ': true,
  '\t': true
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

  var source = '';
  var len    = 0;

  this.options        = _.assign({}, DEFAULTS, options);
  this._operators     = operators;
  this._numberStack   = [];
  this._operatorStack = [];
  this._rolls         = [];
  this._source        = null;
  this._pos           = 0;
  this._length        = 0;
  this._lookahead     = '';

  Object.defineProperty(this, '_source', {
    enumerable: true,
    get: function() { return source; },
    set: function(src) { source = src; len = src.length; }
  });

  Object.defineProperty(this, '_length', {
    enumerable: true,
    get: function() { return len; }
  });
};

Parser.prototype.parse = function parse(source) {
  this._reset();

  this._tokenize();
  this._execute();
  this._rolls.reverse();

  return {
    total: this._numberStack[0],
    rolls: this._rolls
  };
};

Parser.prototype._reset = function() {
  this._source        = '';
  this._pos           = 0;
  this._numberStack   = [];
  this._operatorStack = [];
  this._rolls         = [];
};

Parser.prototype._tokenize = function _tokenize() {
  var token, last;

  for ( ; this._pos < this._length; this._pos++ ) {
    this._lookahead = this._source[this._pos];

    if (whitespace.hasOwnProperty(this._lookahead)) {
      continue;
    }

    token = this._nextToken();
  }
};

Parser.prototype._execute = function _execute() {

};

Parser.prototype._nextToken = function _nextToken() {

};

module.exports = Parser;
