/* jshint node: true */

// [todo] - Allow for more complex expressions, i.e. "5d6 + 4d8 + 32"

'use strict';

var _      = require('lodash');
var Random = require('random-js');

var NDN_PATTERN = /(\d+)[dD](\d+)\s*\+?\s*(\d+)?/;
var DEFAULTS    = {
  pattern: NDN_PATTERN,
  engine:  Random.engines.nativeMath
};

var Roller = function Roller(opts) {

  if (!_.isObject(opts)) {
    opts = {};
  }

  this.options = _.assign({}, DEFAULTS, opts);
};

Roller.prototype._rollDice = function _rollDice(dice, sides, rerollOnes) {
  var results = Random.dice(sides, dice)(this.options.engine);

  if (rerollOnes === true && _.includes(results, 1)) {
    var filtered = _.reject(results, function(n) { return n === 1; });
    var diff     = results.length - filtered.length;
    var newInts  = this._rollDice(diff, sides, true);
    results      = filtered.concat(newInts);
  }

  return results;
};

Roller.prototype.roll = function roll(diceString) {
  var matches = diceString.match(this.options.pattern);

  if (!matches) {
    throw new Error('Invalid dice string. Must be in the form of "NdN [+ N]"');
  }

  if (matches.length === 4) {
    var dice    = matches[1];
    var sides   = matches[2];
    var bonus   = _.isNumber(matches[3]) ? matches[3] : 0;
    var results = this._rollDice(dice, sides);

    return {
      results: results,
      total: _.sum(results)
    };
  }

  throw new Error('Parse error');
};

Roller.prototype.abilityScore = function() {
  var results = this._rollDice(4, 6, true);

  results.sort().shift();

  return {
    results: results,
    total: _.sum(results)
  };
};

Roller.prototype.abilityScores = function() {
  var i;
  var results = [];

  for (i = 0; i < 6; i++) {
    results.push(this.abilityScore());
  }

  return results;
};

Roller.prototype.bonus = function bonus(score) {
  return Math.floor(bonus / 2) - 5;
};


module.exports = Roller;
