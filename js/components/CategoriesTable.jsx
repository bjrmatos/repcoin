"use strict";

var auth = require('../auth.jsx');
var CategoryInput = require('./CategoryInput');
var React = require('react');
var CategoriesItem = require('./CategoriesItem');
var CategoriesHeader = require('./CategoriesHeader');
var $ = require('jquery');

var CategoriesTable = React.createClass({
  getInitialState: function() {
    return { showInput: false, showAddCategory: false };
  },

  handleMouseOver: function() {
    if (!this.state.showInput) {
      this.setState({ showAddCategory: true });
    }
  },

  handleMouseLeave: function() {
    this.setState({ showAddCategory: false });
  },

  handleClick: function() {
    this.setState({ showInput: true });
  },

  closeInputBox: function() {
    this.setState({ showInput: false });
  },

  render: function() {
    var edit = '';
    var addCategory = '';
    
    if (this.props.currentUser._id === this.props.user._id) {
      if (this.state.showAddCategory) {
        edit = <div className="editBox" onClick={this.handleClick}>
                 <button className="btn btn-default btn-small">
                   <span className="glyphicon glyphicon-plus"></span>
                 </button>
               </div>;
      }
      
      if (this.state.showInput) {
        addCategory = <CategoryInput/>;
      }
    }

    var toIncludeReps = false;
    var repsHeader = '';
    if (this.props.currentUser.username === this.props.user.username) {
        toIncludeReps = true;
        repsHeader = <th>Reps</th>;
    }

    return (
      <div className="categoriesTable panel panel-default" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}>
        <CategoriesHeader user={this.props.user} />
        {edit}
        {addCategory}
        <table className="table table-bordered table-striped">
          <tr>
            <th>Category</th>
            <th>Direct Rep</th>
            <th>Crowd Rep</th>
            {repsHeader}
          </tr>
          <tbody>
          {this.props.user.categories.map(function(category) {
            if (toIncludeReps) {
              return <CategoriesItem key={category.id} category={category.name} directRep={category.directScore} prevDirectRep={category.previousDirectScore} crowdRep={category.crowdScore} reps={category.reps} />;
            } else {
              return <CategoriesItem key={category.id} category={category.name} directRep={category.directScore} prevDirectRep={category.previousDirectScore} crowdRep={category.crowdScore} />;
            }
          })}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = CategoriesTable;
