/** @jsx React.DOM */
"use strict";

var React = require('react');
var ModalMixin = require('../mixins/BootstrapModalMixin.jsx');
var auth = require('../auth.jsx');
var PubSub = require('pubsub-js');
var $ = require('jquery');

var Modal = React.createClass({
  mixins: [ModalMixin],

  getInitialState: function() {
    return { error: "" };
  },

  validateAndCreateTransaction: function(categoryName, reps) {
    var transactionCategory;
    for (var i = 0; i < this.props.user.categories.length; i++) {
      var currentCategory = this.props.user.categories[i];
      if (currentCategory.name === categoryName) {
        transactionCategory = currentCategory;
      }
    }
    if (!transactionCategory || transactionCategory.reps < reps) {
      this.setState({error: true});
    } else {
      this.setState({error: false});
      this.createTransaction(this.props.user, this.props.currentUser, categoryName, reps);
    }
  },

  createTransaction: function(toUser, fromUser, category, amount) {
    var to = { "name": toUser.username, "id": toUser._id };
    var from = { "name": fromUser.username, "id": fromUser._id };
    $.ajax({
      url: '/api/transactions',
      type: 'POST',
      data: {
        to: to,
        from: from,
        category: category,
        amount: amount,
      },
      success: function(transaction) {
        $.ajax({
          url: '/api/users/' + fromUser._id,
          type: 'GET',
          success: function(user) {
            auth.storeCurrentUser(user, function(user) {
              return user;
            });
            PubSub.publish('profileupdate');
            this.hide();
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(status, err.toString());
          },
        });

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  handleSubmit: function(event) {
    event.preventDefault();
    var reps = Number(this.refs.amount.getDOMNode().value);
    var categoryName = this.refs.category.getDOMNode().value;
    this.validateAndCreateTransaction(categoryName, reps);
  },

  render: function() {
    var modalStyleOverride = {
      'zIndex': 1050,
    };

    var error = this.state.error ? 'You don\'t have that many reps in that category':'';
    var currentUserPortfolio = this.props.currentUser.portfolio;
    var categories = this.props.user.categories.map(function(category) {
      console.log(category.name);
      for (var i = 0; i < currentUserPortfolio.length; i++) {
        console.log(currentUserPortfolio[i]);
        if (currentUserPortfolio[i].category === category.name && currentUserPortfolio[i].repsAvailable > 0) {
          console.log("Match");
          return <option key={category.id} value={category.name}>{category.name} ({currentUserPortfolio[i].repsAvailable})</option>;
        }
      }
    });
    return (
      <div className="modal">
        <div className="modal-dialog" style={modalStyleOverride}>
          <div className="modal-content">
            <div className="modal-header">
              {this.renderCloseButton()}
              <span><h3> {this.props.user.username} </h3></span>
            </div>
            <form onSubmit={this.handleSubmit} className="navbar-form">
            <div className="modal-body container">
                <div className="give-revoke-dropwdown">
                  <select ref="giveOrRevoke" className="form-control">
                    <option value="give">Give</option>
                    <option value="revoke">Revoke</option>
                  </select>
                </div>
                <div className="categories-dropdown">
                  <strong className="reps_form-label">Categories:</strong>
                  <select ref="category" className="form-control">
                    {categories}
                  </select>
                </div>
                <div>
                  {error}
                </div>
                <div className="reps_padder">
                  <strong className="reps_form-label">Amount:</strong><input type="text" placeholder="10" className="form-control reps_text-input" ref="amount"></input>
                </div>
                <div>
                  <button type="submit" className="btn btn-lg btn-primary reps_invest-button">Invest</button>
                </div>
            </div>
            </form>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Modal;
