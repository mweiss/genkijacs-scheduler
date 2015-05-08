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
var ReactSelect = require('react-select');

var ClassRegistrationList = React.createClass({

  mixins: [DataTableListMixin],

  // DataTableListMixin required methods
  // TODO:  create ClassStore.findById
  // Generalize how data is determined in the DataTableListMixin or just set up the data so that
  // class registrations are visible on the data we're passing.
  _findClassName: function(v) {
    var c = ClassStore.findById(v.classId);
    if (c) {
      return (<span className="ClassRegistration_ClassName">{c.name_jp}</span>); // TODO: for now let's use the english name,
                        // although I may change this to be an object with several locales
    }
  },

  _findClassList: function() {
    function keepIds(v) {
      return (v.id && true);
    }

    function transform(v) {
      return { 
        value: (v.id + ""), // need to convert this to a string because select doesn't recognize it otherwise
        label: v.name_jp
      };
    }

    var rVal = _.map(_.filter(ClassStore.all(), keepIds), transform);
    return rVal;
  },

  _onSelectChange: function(v) {
    console.log('change select', v);
    var realValue = +v;

    obj.onSelect({

    })
  },

  _formatDateValue: function(value, oldValue, label) {
    var v = value[label] || oldValue[label];

    if (v && v.format) {
      return v.format();
    }
    else {
      return v || "";
    }
  },

  editValue: function(oldValue, value) {
    var oldValue = _.clone(oldValue || {});

    // one or the other may not be set, this is sort of janky, so I should set this up so
    // that it's possible to separate it.
    if (typeof value === 'string') {
      value = +value;
    }

    if (value.start) {
      oldValue.start = this._formatDateValue(value, oldValue, "start");
      oldValue.end = this._formatDateValue(value, oldValue, "end");
    }
    else {
      oldValue.classId = value || oldValue.classId || "";
    }
    oldValue.studentId = this.props.data.id;

    return oldValue
  },

  renderReadListItem: function(v) {
    return [this._findClassName(v), this.formattedDate(v.start), (<span> - </span>), this.formattedDate(v.end)]
  },

  renderEditListItem: function(obj) {
    var v = obj.value;
    var cid = v.classId + ""; // Converted toa  string because select doesn't recognize it the other way

    return ([
      <ReactSelect
          className="ClassRegistrationList"
          name="form-field-name"
          clearable={false}
          value={cid}
          options={this._findClassList()}
          onChange={obj.onSelect}
      />,
      <TextFieldDateRangePicker key={obj.i}
                                     onSelect={obj.onSelect}
                                     autoFocus={obj.autoFocus}
                                     startDate={this.parseDate(v.start)}
                                     endDate={this.parseDate(v.end)} />]);
  },

  emptyItem: function() {
    return {start: "", end: "", classId: "", studentId: this.props.data.id};
  },

  showDeleteButton: function(v) {
    return v.start && true;
  }

  // Other methods,  TODO: consolidate or move this somewhere so that I don't repeat



});

module.exports = ClassRegistrationList;

