'use strict';

Object.assign = require('object-assign');
if (!global.Intl) {
    global.Intl = require('intl');
}

var React           = require('react');
var ReactIntl = require('react-intl');
var _ = require('underscore');
var FormattedDate = ReactIntl.FormattedDate;
var TextFieldDateRangePicker = require('./TextFieldDateRangePicker.react');

var EnrollmentDateList = React.createClass({

  getInitialState: function() {
    return {
      values: this.props.value
    };
  },

  formattedDate: function(s) {
    var d = new Date(s);
    return (<FormattedDate value= {d} day="numeric"
              month="numeric"
              year="numeric" />);
  },

  renderList: function() {
    var elements = _.map(this.state.values, function(v) {
      return (<li>{[this.formattedDate(v.start), (<span> - </span>), this.formattedDate(v.end)]}</li>);
    }, this);

    return (<ul>{elements}</ul>);
  },


  renderEditList: function() {
    var elements = _.map(this.state.values, function(v, i) {
      var autoFocus = false;
      if (this.props.autoFocus && this.state.values.length === 1) {
        autoFocus = true;
      }

      var _onSelect = function(value) {
        // TODO: Do I need to clone this?
        var values = _.clone(this.state.values);
        values[i] = {start: value.start.format(), end: value.end.format()};
        this.setState({values: values});
        if (this.props.onSave) {
          this.props.onSave(values);
        }
      }

      _onSelect = _.bind(_onSelect, this);

      return (<li><TextFieldDateRangePicker onSelect={_onSelect} autoFocus={autoFocus} startDate={new Date(v.start)} endDate={new Date(v.end)} /></li>);
    }, this);

    return (<ul>{elements}</ul>);
  },

  render: function() {
    // Let's layout the UI as follows
    // for each date have [start date] [end date]

    // When the row becomes editable, each [start date] [end date]
    // field needs to become two text fields that are only editable via
    // the calendar app for

    var components = [];
    if (this.props.editing) {
      components = this.renderEditList();
    }
    else {
      components = this.renderList();
    }

    return (<div>{components}</div>);
  }

});

module.exports = EnrollmentDateList;

