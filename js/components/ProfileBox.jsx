'use strict';

var $ = require('jquery');
var AboutBox = require('./AboutBox.jsx');
var InvestmentButton = require('./InvestmentButton.jsx');
var LinksBox = require('./LinksBox.jsx');
var LocationBox = require('./LocationBox.jsx');
var PictureBox = require('./PictureBox.jsx');
var React = require('react');

var ProfileBox = React.createClass({
  render: function() {
    var investmentButton = '';
    if (this.props.currentUser && this.props.currentUser._id !== this.props.user._id) {
      investmentButton = <InvestmentButton user={this.props.user} currentUser={this.props.currentUser}/>;
    }

    return (
      <div className="profileBox">
        <div className="col-md-2">
          <PictureBox currentUser={this.props.currentUser} user={this.props.user} />
        </div>
        <div className="col-md-3">
          <div className="row">
            <div className="profileUsername">{this.props.user.username}</div>
          </div>
          <div className="row">
            <AboutBox user={this.props.user} currentUser={this.props.currentUser}/>
            <LocationBox user={this.props.user} currentUser={this.props.currentUser}/>
            {investmentButton}
          </div>
        </div>
        <div className="col-md-7">
          <LinksBox currentUser={this.props.currentUser} user={this.props.user} />
        </div>
      </div>
    );
  }
});

module.exports = ProfileBox;
