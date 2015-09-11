import React from 'react';
import _ from 'lodash';

var SearchFilter = React.createClass({
  scheduleChange: _.debounce(function () {
    this.handleFilterChange();
  }, 300),
  
  handleFilterChange: function() {
    var value = React.findDOMNode(this).value;
    this.props.updateFilter(value);
  },
  
  render: function() {
    return <input type="text" ref="filterInput" onChange={this.scheduleChange.bind(null, this)} placeholder="Start typing..." />;
  }
});

module.exports = SearchFilter;