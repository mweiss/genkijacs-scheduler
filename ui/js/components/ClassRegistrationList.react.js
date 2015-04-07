'use strict';

if (!global.Intl) {
    global.Intl = require('intl');
}

var React = require('react');
var ReactIntl = require('react-intl');
var _ = require('underscore');
var TextFieldDateRangePicker = require('./TextFieldDateRangePicker.react');
var DataTableListMixin = require('./DataTableListMixin.react');
var ClassStore = require('../stores/ClassStore');

var ClassRegistrationList = React.createClass({

  mixins: [DataTableListMixin],

  // DataTableListMixin required methods
  // TODO:  create ClassStore.findById
  // Generalize how data is determined in the DataTableListMixin or just set up the data so that
  // class registrations are visible on the data we're passing.
  _findClassName: function(v) {
    var c = ClassStore.findById(v.classId);
    if (c) {
      return c.name_en; // TODO: for now let's use the english name,
                        // although I may change this to be an object with several locales
    }
  },

  renderReadListItem: function(v) {
    return [this._findClassName(v), this.formattedDate(v.start), (<span> - </span>), this.formattedDate(v.end)]
  },

  renderEditListItem: function(obj) {
    var v = obj.value;
    // TODO: add class drop down=
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

  // Other methods,  TODO: consolidate or move this somewhere so that I don't repeat



});

module.exports = ClassRegistrationList;

