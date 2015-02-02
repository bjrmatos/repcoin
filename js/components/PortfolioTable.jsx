'use strict';

var $ = require('jquery');
var CategoryDelete = require('./CategoryDelete.jsx');
var CategoryInput = require('./CategoryInput');
var PortfolioHeader = require('./PortfolioHeader.jsx');
var PortfolioItem = require('./PortfolioItem.jsx');
var PubSub = require('pubsub-js');
var React = require('react');
var strings = require('../lib/strings_utils.js');

var PortfolioTable = React.createClass({
  getInitialState: function() {
    return {
      addMode: false,
      editHover: false,
      deleteMode: false,
      showDeleteBox: false,
      categoryToDelete: '',
      message: null,
      error: false,
     };
  },

  resetState: function() {
    this.setState({
      addMode: false,
      editHover: false,
      deleteMode: false,
      showDeleteBox: false,
      categoryToDelete: '',
      message: null,
      error: false,
    });
  },

  componentDidMount: function() {
    $('.dividend-info').popover({ trigger: 'hover focus' });
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.user._id !== this.props.user._id) {
      this.resetState();
    }
  },

  handleMouseOver: function() {
    if (!this.state.showDeleteBox && !this.state.addMode && !this.state.deleteMode) {
      this.setState({ editHover: true });
    }
  },

  handleMouseLeave: function() {
    this.setState({ editHover: false });
  },

  handleAddClick: function() {
    this.setState({ addMode: true, editHover: false, deleteMode: false, showDeleteBox: false, message: null });
  },

  handleDeleteClick: function() {
    this.setState({ deleteMode: true, editHover: false, addMode: false, showDeleteBox: false, message: null });
  },

  handleCancelClick: function() {
    this.setState({ deleteMode: false, addMode: false, showDeleteBox: false, message: null });
  },

  showDeleteBox: function(categoryToDelete) {
    this.setState({ categoryToDelete: categoryToDelete,
                    showDeleteBox: true,
                    message: null });
  },

  closeInputBox: function() {
    this.setState({ addMode: false });
  },

  closeDeleteBox: function() {
    this.setState({ showDeleteBox: false, deleteMode: false });
  },

  deleteInvestorCategory: function(e) {
    e.preventDefault();
    var url = '/api/users/' + this.props.currentUser._id + '/'
      + this.state.categoryToDelete.category + '/investor/delete';
    $.ajax({
      url: url,
      type: 'PUT',
      success: function(user) {
        PubSub.publish('profileupdate');
        this.setState({ deleteMode: false, showDeleteBox: false });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  setMessage: function(message, error) {
    this.setState({ message: message, error: error, addMode: false });
  },

  getPortfolioItems: function(privateFields) {
    var portfolioItems = [];
    var length = this.props.user.portfolio.length;
    for (var i = 0; i < length; i++) {
      var category = this.props.user.portfolio[i];
      portfolioItems.push(
        <PortfolioItem key={category.category} category={category}
          deleteMode={this.state.deleteMode} showDeleteBox={this.showDeleteBox} privateFields={privateFields} />
      );
    }
    return portfolioItems;
  },

  render: function() {
    var isSelf = this.props.currentUser._id === this.props.user._id;
    var message = '';
    if (this.state.message) {
      if (this.state.error) {
        message = <div className="alert alert-danger added-cat-msg" role="alert">{this.state.message}</div>;
      } else {
        message = <div className="alert alert-info added-cat-msg" role="alert">{this.state.message}</div>;
      }
    }

    var edit = '';
    var addCategory = '';
    var deleteCategory = '';
    if (isSelf) {
      if (this.state.editHover) {
        edit = <div className="editCategoriesBtn">
          <a onClick={this.handleAddClick}><span className="pencil glyphicon glyphicon-plus"></span></a>
          <p className="divider"> | </p>
          <a onClick={this.handleDeleteClick}><span className="remove glyphicon glyphicon-remove"></span></a>
        </div>;
       } else if (this.state.addMode || this.state.deleteMode || this.state.showDeleteBox) {
        edit = <div className="editCategoriesBtn">
          <button className="btn btn-default" onClick={this.handleCancelClick}>Cancel</button>
        </div>;
      }

      if (this.state.showDeleteBox) {
        deleteCategory = <CategoryDelete onReset={this.closeDeleteBox} investor={true}
          onDelete={this.deleteInvestorCategory} name={this.state.categoryToDelete.category}/>;
      }

      if (this.state.addMode) {
        addCategory = <CategoryInput user={this.props.user} onReset={this.closeInputBox} expert={false} setMessage={this.setMessage} />;
      }
    }

    // Determine whether to display private or public rows
    var privateFields = false;
    var investmentHeader = '';
    var repsAvailable = -1;
    if (isSelf) {
      repsAvailable = this.props.user.reps;
      privateFields = true;
      investmentHeader =
        <th>
          <div>{strings.INVESTMENTS}</div>
          <div className="subtitle">{strings.USER_AMOUNT_DIVIDEND}
            <span className="dividend-info glyphicon glyphicon-info-sign" data-toggle="popover" data-placement="top" title={strings.DIVIDEND_INFO_TITLE} data-content={strings.DIVIDEND_INFO_CONTENT}></span>
          </div>
        </th>;
    }

    var portfolioRows = this.getPortfolioItems(privateFields);
    var addCategoriesText = '';

    if (this.props.user.portfolio.length === 0) {
      if (isSelf) {
        var text = strings.NOT_AN_INVESTOR_FOR_ANYTHING;
          addCategoriesText =
            <div className="add-category-text">
              {text}
              <button className="no-cat-btn btn btn-primary" onClick={this.handleAddClick}>Add Categories</button>
            </div>;
      } else {
        var text = strings.NOT_AN_INVESTOR_FOR_ANYTHING_IMPERSONAL(this.props.user.username);
        addCategoriesText = <div className="add-category-text">{text}</div>;
      }
    }

    return (
      <div key={this.props.user._id} className="categoriesTable panel panel-default" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave} >
        <PortfolioHeader name={this.props.user.username} reps={repsAvailable} />
        {edit}
        {message}
        {addCategory}
        {deleteCategory}
        <table className="table table-bordered table-striped">
          <tr className="PortfolioHeader">
            <th>Category</th>
            <th>Percentile</th>
            {investmentHeader}
          </tr>
          <tbody>
            {portfolioRows}
          </tbody>
        </table>
        {addCategoriesText}
      </div>
    );
  }
});

module.exports = PortfolioTable;
