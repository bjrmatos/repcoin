'use strict';

var $ = require('jquery');
var auth = require('../auth.jsx');
var Footer = require('./Footer.jsx');
var Navigation = require('react-router').Navigation;
var React = require('react');
var Toolbar = require('./Toolbar.jsx');

var VerificationPage = React.createClass({
  mixins: [Navigation],

  componentDidMount: function() {
    console.log('Mounted verification page');
    this.verifyUser(this.props.params.token);
  },

  getInitialState: function() {
    return { error: null };
  },

  verifyUser: function(token) {
    console.log('verifying user');
    var data = {verificationToken: token};
    $.ajax({
      url: '/api/verify/',
      type: 'POST',
      data: data,
      success: function(user) {
        console.log(user);
        // A successful verify means the user is already logged in
        // We just need to store the user in the token
        auth.storeCurrentUser(user, function() {
          this.transitionTo('/home');
        }.bind(this));
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(xhr.responseText);
        this.setState({ error: xhr.responseText });
      }.bind(this),
    });
  },

  render: function() {
    var error = this.state.error ? <div className="alert alert-danger" role="alert">{this.state.error}</div> : '';
    return (
      <div className="verificationPage">
        <div className="row">
          <Toolbar />
        </div>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            {error}
          </div>
        </div>
        <div className="row footerrow">
          <Footer />
        </div>
      </div>
    );
  },
});

module.exports = VerificationPage;
