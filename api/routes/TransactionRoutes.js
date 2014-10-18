// api/routes/TransactionRoutes.js

var Transaction = require('../models/Transaction.js');

// Routes that end in /transactions
// TODO : ADD AUTHENTICATION INTO EACH ROUTE!!
module.exports = function(router, isAuthenticated) {
  router.route('/transactions')
    // Get all the transactions
    .get(function(req, res) {
      Transaction.find(function(err, transactions) {
        if (err) {
          res.send(err);
        } else {
          res.json(transactions);
        }
      });
    })

    // Create a new transaction
    .post(function(req, res) {

      // Check that there is a user logged in
      if (!req.user) {
        res.status(400).send("No user logged in");
        return;
      }

      // Check that the user is the same as from
      if (req.user._id != req.body.from.id) {
        res.status(400).send("Incorrect user");
        return;
      }
      var transaction = new Transaction({
        to          : req.body.to,
        from        : req.body.from,
        amount      : req.body.amount,
        category    : req.body.category
      });
      transaction.save( function(err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.send(transaction);
        }
      });  
    });

///////// Routes that have /transcations/:transaction_id ////////
  router.route('/transactions/:transaction_id')
    // Get the transaction with this id
    .get(function(req, res) {
      Transaction.findById(req.params.transaction_id, function(err, transaction) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.send(transaction);
        }
      });
    })

    // Update the transaction with this id
    .put( function(req, res) {
      Transaction.findById(req.params.transaction_id, function(err, transaction) {
        if (err) {
          res.status(400).send(err);
        } else {
          transaction.to          = req.body.to;
          transaction.from        = req.body.from;
          transaction.amount      = req.body.amount;
          transaction.category    = req.body.category;
          transaction.save(function(err) {
            if (err) {
              res.status(400).send(err);
            } else {
              res.send(transaction);
            }
          });
        }
      });
    })      

   // Delete the transaction with this id
   .delete(function(req, res) {
      // Remove the transaction
      Transaction.remove({ _id: req.params.transaction_id }, function(err, transaction) {
        if (err) {
          res.send(err);
        } else {
          res.send('Successfully deleted transaction');
        }
      });
   });

  router.route('/transactions/users/:userId/all')
    // Get all of the transactions to or from a given user
    .get(function(req, res) {
      Transaction.findByUserIdAll(req.params.userId, function(err, transactions) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.send(transactions);
        }
      });
    });

  router.route('/transactions/users/:userId/all/public')
    // Get all of the public transactions to or from a given user
    .get(function(req, res) {
      Transaction.findByUserIdAllPublic(req.params.userId, function(err, transactions) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.send(transactions);
        }
      });
    });


  // Get all of the transactions to a given user
  router.route('/transactions/users/:userId/to/public')
    .get(function(req, res) {
      Transaction.findByUserIdTo(req.params.userId, function(err, transactions) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.send(transactions);
        }
      });
    });
 
  // Get all of the transactions from a given user
  router.route('/transactions/users/:userId/from')
    .get(function(req, res) {
      Transaction.findByUserIdFrom(req.params.userId, function(err, transactions) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.send(transactions);
        }
      });
    });

  // Get all of the public transactions from a given user
  router.route('/transactions/users/:userId/from/public')
    .get(function(req, res) {
      Transaction.findByUserIdFromPublic(req.params.userId, function(err, transactions) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.send(transactions);
        }
      });
    });
 
  // Get all of the public transactions between users
  router.route('/transactions/users/:userId/us/public')
    .get(function(req, res) {
      Transaction.findByUserIdUsPublic(req.params.userId, req.user._id, function(err, transactions) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.send(transactions);
        }
      });
    });
};