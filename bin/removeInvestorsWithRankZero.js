#!/usr/bin/env node

var mongoose = require('mongoose');
var utils = require('./utils.js');
var winston = require('winston');

// Set up the database url
var db = require('../config/db');
if (process.env.NODE_ENV === 'production') {
  winston.log('info', 'Starting to remove investors with rank zero in production environment');
  var mongoURL = db.production_url;
} else {
  winston.log('info', 'Starting to remove investors with rank zero in development environment');
  var mongoURL = db.development_url;
}
mongoose.connect(mongoURL);
mongoose.connection.on('connected', function() {
  utils.removeInvestorsWithRankZero(function(errs) {
    if (errs) {
      winston.log('info', 'Remove investors with rank zero finished with errors.');
    }
    mongoose.connection.close();
    process.exit();
  });
});
