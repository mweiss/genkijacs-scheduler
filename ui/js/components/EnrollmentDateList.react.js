'use strict';


var React = require('react');
var _ = require('underscore');
var TextFieldDateRangePicker = require('./TextFieldDateRangePicker.react');
var DataTableListMixin = require('./DataTableListMixin.react');

var EnrollmentDateList = React.createClass({

  mixins: [DataTableListMixin],

  // DataTableListMixin required methods

  renderReadListItem: function(v) {
    return [this.formattedDate(v.start), (<span> - </span>), this.formattedDate(v.end)]
  },

  renderEditListItem: function(obj) {
    var v = obj.value;
    return <TextFieldDateRangePicker key={obj.i}
                                     onSelect={obj.onSelect}
                                     autoFocus={obj.autoFocus}
                                     startDate={this.parseDate(v.start)}
                                     endDate={this.parseDate(v.end)} />
  },

  emptyItem: function() {
    return {start: "", end: ""};
  },

  showDeleteButton: function(v) {
    return v.start && true;
  },

  editValue: function(oldValue, value) {
    return {start: value.start.format(), end: value.end.format()};
  }

});

module.exports = EnrollmentDateList;

