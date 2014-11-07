"use strict";

var $ = require('jquery');
var React = require('react');
var Router = require('react-router');
var SearchItem = require('./SearchItem.jsx');

var Link = Router.Link;

var CategorySearchDisplayTable = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    this.setState({
      index: 0,
      maxindex: this.props.data.length - 1
    });
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({
      index: 0,
      maxIndex: newProps.data.length - 1
    });
  },

  handleKeyDown: function(event) {
    switch (event.keyCode) {
      case 38: // up
        if (this.state.index === 0) {
          $(".categorySearchBarInput").focus();
        }

        else if (this.state.index > 0) {
          var i = this.state.index-1;
          this.setState({ index: i });
          $(".categorySearchItem-" + i).focus();
        }
      break;
      
      case 40: // down
        if (this.state.index < this.state.maxIndex) {
          var i = this.state.index+1;
          this.setState({ index: i });
          $(".categorySearchItem-" + i).focus();
        }
      break;
      
      default: return;
    }
    event.preventDefault();
  },

  handleClick: function(event) {
    event.preventDefault();
    var name = $(event.currentTarget).attr('href');
  },

  render: function() {
    var i = 0;
    return (
      <div className="searchDisplayTable">
        <ul className="list-group">
          {this.props.data.map(function(datum) {
            var name = "categorySearchItem-" + i;
            i += 1;
            return <li key={datum._id} className="list-group-item"> 
              <a href={datum.name} onClick={this.handleClick} onKeyDown={this.handleKeyDown} className={name}>
                <SearchItem name={datum.name} index={i-1}/>
              </a>
              </li>;
          }.bind(this))}
        </ul> 
      </div>
    );
  } 
});

module.exports = CategorySearchDisplayTable;
