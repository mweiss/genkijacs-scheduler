'use strict';

if (!global.Intl) {
    global.Intl = require('intl');
}

var React     = require('react');
var ReactIntl = require('react-intl');
var _         = require('underscore');
var DateRangePicker = require('react-daterange-picker');
var ClickOutsideHandlerMixin = require('./ClickOutsideHandlerMixin.react');
var moment = require("moment");

var DateRenderer = React.createClass({

  mixins: [ClickOutsideHandlerMixin],

  getInitialState: function() {
    return {dateRangePickerOpen: false};
  },


  componentWillMount: function() {
    this._onMount();
  },

  componentWillUnmount: function() {
    this._onUnmount();
  },

  // TODO: This sort of bubble up is really frowned upon in React... I should do this in a smarter way by
  // having an action for this!
  handleSelect: function(moment) {
    this.setState({dateRangePickerOpen: false}, this._unbindCloseMenuIfClickedOutside);
    if (this.props.onSave) {
      this.props.onSave(moment.format());
    }
  },

  _onFocus: function(e) {
    e.preventDefault();
    if (!this.state.dateRangePickerOpen) {
      var newState = _.clone(this.state);
      newState.dateRangePickerOpen = true;
      this.setState(newState, this._bindCloseMenuIfClickedOutside);     
    }
  },

  _onBlur: function() {

  },

  // TODO: consolidate this date format logic
  _formatDate: function(date) {
   if (!date) {
      return "";
    }
    var options = {
      year: 'numeric', month: 'numeric', day: 'numeric'
    };
    var date = new Date(date)
    return new Intl.DateTimeFormat('jp', options).format(date);
  },

  render: function() {
    var v = this.props.value;
    var onSave = this.props.onSave;
    var editing = this.props.editing;

    // TODO: consolidate!!!!
    var rangePickerHidden = !this.state.dateRangePickerOpen;
    var rangePickerStyle = {};

    // TODO: Find a way to really remove this instead of just setting the display
    // to none.  I tried just not rendering it, but then I get an error later
    // saying the DateRangePicker is doing something after it's been unmounted.
    if (rangePickerHidden) {
      rangePickerStyle.display = 'none';
    }

    if (editing) {
      var initialDate = new Date("1996-01-01T00:00:00.000Z")
      if (v) {
        initialDate = new Date(v);
      }
      var rangePicker = (
      <div className="dateRangeContainerSingle" style={rangePickerStyle}>
        <DateRangePicker ref="dateRangePicker"
          firstOfWeek={1}
          value={moment(initialDate)}
          selectionType='single'
          numberOfCalendars={1}
          initialFromValue={true}
          onSelect={this.handleSelect} />
      </div>
      );
      return (<div className="TextFieldDateRangePicker" ref="textFieldDateRangePicker">
          <input className="DateRangeField" type="text" onClick={this._onFocus} readOnly onBlur={this._onBlur} value={this._formatDate(v)} />
          {rangePicker}
        </div>)
    }
    else {
      return <div>{this._formatDate(v)}</div>;
    }

  }

});

module.exports = DateRenderer;

