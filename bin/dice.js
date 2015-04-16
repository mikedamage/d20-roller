#!/usr/bin/env node
/**
 * d20 Roller
 * by Mike Green
 */

/* jshint node: true */

'use strict';

var _       = require('lodash');
var path    = require('path');
var pkg     = require(path.join(__dirname, '..', 'package.json'));
var chalk   = require('chalk');
var align   = require('space-align');
var Roller  = require(path.join(__dirname, '..', 'index'));
var argv    = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('roll', 'Roll NdN dice')
  .command('ability', 'Generate a single ability score')
  .command('abilities', 'Generate 6 random ability scores')
  .command('bonus', 'Calculate the bonus granted by an ability score')
  .option('s', {
    description: 'Show results of each die roll',
    alias: 'show-results'
  })
  .help('help')
  .version(pkg.version, 'version', 'display version information')
  .example('$0 roll 4d6+4')
  .argv;

var roller, command, args;

var resultsTemplate = _.template('[ <%= results.join(", ") %> ]');

var commands = {
  roll: function() {
    var dice, result, data;

    if (!args.length) {
      console.log(chalk.magenta('Please specify some dice to roll'));
      process.exit(1);
    }

    dice   = args.join('');
    result = roller.roll(dice);

    if (argv.showResults) {
      data = align([
        [ resultsTemplate({ results: result.results }), '=', result.total ]
      ])[0];
    } else {
      data = result.total;
    }

    console.log(data);
  },
  ability: function() {
    var result, data;

    result = roller.abilityScore();

    if (argv.showResults) {
      data = align([
        [ resultsTemplate({ results: result.results }), '=', result.total ]
      ])[0];
    } else {
      data = result.total;
    }

    console.log(data);
  },
  abilities: function() {
    var result, data;

    result = roller.abilityScores();

    if (argv.showResults) {
      data = align(_.map(result, function(res) {
        return [ resultsTemplate({ results: res.results }), '=', res.total ];
      }));
    } else {
      data = _.map(result, 'total');
    }

    _.forEach(data, function(score) {
      console.log(score);
    });
  },
  bonus: function() {
    var result;

    if (!args.length) {
      console.log(chalk.magenta('Please specify a score'));
      process.exit(1);
    }

    result = roller.bonus(args[0])

    if (result > -1) {
      console.log('+' + result);
    } else {
      console.log(result);
    }
  }
};

if (!argv._.length) {
  console.log(chalk.bold.red('Please specify a command: ') + 'See --help for usage.');
  process.exit();
}

command = argv._[0];
args    = _.rest(argv._);

if (!commands.hasOwnProperty(command)) {
  console.log(chalk.bold(chalk.red('Invalid command: ')) + 'See --help for available commands.');
  process.exit();
}

roller = new Roller();

commands[command].call(this);
