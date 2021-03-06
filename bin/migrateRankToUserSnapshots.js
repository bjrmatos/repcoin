#!/usr/bin/env node

var mongoose = require('mongoose');
var utils = require('./utils.js');
var winston = require('winston');

// Set up the database url
var db = require('../config/db');
if (process.env.NODE_ENV === 'production') {
  winston.log('info', 'Starting migrateRankToUserSnapshots in production environment');
  var mongoURL = db.production_url;
} else {
  winston.log('info', 'Starting migrateRankToUserSnapshots in development environment');
  var mongoURL = db.development_url;
}
mongoose.connect(mongoURL);
mongoose.connection.on('connected', function() {
  utils.migrateRankToUserSnapshots(function(errs) {
    if (errs) {
      winston.log('info', 'Migrate ranks to user snapshots finished with errors.');
    }
    winston.log('info', 'Exiting from migrating rank to user snapshots and closing connection');
    mongoose.connection.close();
    process.exit();
  });
});
