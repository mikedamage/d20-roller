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

var commands = {
  roll: function() {
    var dice, result, data;

    if (!args.length) {
      console.log(chalk.magenta('Please specify some dice to roll'));
      process.exit();
    }

    dice   = args.join('');
    result = roller.roll(dice);

    if (argv.showResults) {
      data = align([
        [ '[ ' + result.results.join(', ') + ' ]', '=', result.total ]
      ])[0];
    } else {
      data = result.total;
    }

    console.log(data);
  },
  ability: function() {

  },
  abilities: function() {

  },
  bonus: function() {

  }
};

if (!argv._.length) {
  console.log(chalk.bold(chalk.red('Please specify a command: ')) + 'See --help for usage.');
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
