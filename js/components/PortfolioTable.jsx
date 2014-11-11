"use strict";

var CategoryInput = require('./CategoryInput');
var PortfolioHeader = require('./PortfolioHeader.jsx');
var PortfolioItem = require('./PortfolioItem.jsx');
var React = require('react');

var PortfolioTable = React.createClass({
  getInitialState: function() {
    return { showInput: false,
             showAddPortfolio: false,
             error: null };
  },

  handleMouseOver: function() {
    if (!this.state.showInput) {
      this.setState({ showAddPortfolio: true });
    }
  },

  handleMouseLeave: function() {
    this.setState({ showAddPortfolio: false });
  },

  handleClick: function() {
    this.setState({ showInput: true, error: null });
  },

  closeInputBox: function() {
    this.setState({ showInput: false });
  },

  setError: function(error) {
    this.setState({ error: error });
  },

  render: function() {
    var error = this.state.error ? <div className="alert alert-info" role="alert">{this.state.error}</div> : '';
    var edit = '';
    var addCategory = '';
    if (this.props.currentUser._id === this.props.user._id) {
      if (this.state.showAddPortfolio) {
        edit = <div className="editBox" onClick={this.handleClick}>
                 <button className="btn btn-default btn-small">
                   <span className="glyphicon glyphicon-plus"></span>
                 </button>
               </div>;
      }
      
      if (this.state.showInput) {
        addCategory = <CategoryInput user={this.props.user} onReset={this.closeInputBox} expert={false} setError={this.setError} />;
      }
    }

    return (
      <div className="categoriesTable panel panel-default" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave} >
        <PortfolioHeader />
        {edit}
        {error}
        {addCategory}
        <table className="table table-bordered table-striped">
          <tr className="PortfolioHeader">
            <th>Category</th>
            <th>Reps Available</th>
            <th>
              <div>Investments</div>
              <div className="subtitle">User / Amount / Valuation</div>
            </th>
          </tr>
          <tbody>
          {this.props.user.portfolio.map(function(category) {
            return <PortfolioItem key={category.category} category={category} />;
          })}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = PortfolioTable;
