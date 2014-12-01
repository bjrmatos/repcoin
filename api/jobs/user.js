var User = require('../models/User.js');
module.exports = function(agenda) {
  agenda.define('incrementUserReps', function(job, done) {
    var i = 0;
    User.find(function(err, users) {
      users.forEach(function(user) {
        user.portfolio.forEach(function(category) {
          category.reps += 5;
        });
        user.save();
      });
      console.log("Incrementing %d users' reps by 5.", users.length);
    });
  });

  agenda.define('setPreviousPercentileToCurrent', function(job, done) {
    var i = 0;
    User.find(function(err, users) {
      users.forEach(function(user) {
        user.categories.forEach(function(category) {
          category.previousPercentile = category.percentile;
        });
        user.save();
      });
      console.log("Updating %d users' previous percentiles.", users.length);
    });
  });

  agenda.every('0 0 * * *', 'incrementUserReps');
  agenda.now('setPreviousPercentileToCurrent');
};
