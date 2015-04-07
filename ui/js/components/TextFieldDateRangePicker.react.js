"use strict";

if (!global.Intl) {
    global.Intl = require('intl');
}

var React           = require('react');
var DateRangePicker = require('react-daterange-picker');
var _ = require('underscore');

var TextFieldDateRangePicker = React.createClass({
  getInitialState: function() {
    return {
      dateRangePickerOpen: false
    };
  },

  // TODO: This sort of bubble up is really frowned upon in React... I should do this in a smarter way by
  // having an action for this!
  handleSelect: function(dateRange) {
    this.setState({dateRangePickerOpen: false});
    if (this.props.onSelect) {
      this.props.onSelect(dateRange);
    }
  },

  _onFocus: function(e) {
    var newState = _.clone(this.state);
    newState.dateRangePickerOpen = true;
    this.setState(newState);
  },

  _onBlur: function(e) {
  },

  _formatDate: function(date) {
    if (!date) {
      return "";
    }
    var options = {
      year: 'numeric', month: 'numeric', day: 'numeric'
    };
    return new Intl.DateTimeFormat('jp', options).format(date);
  },

  onChange: function() {
    // TODO: I need to fill this in for react best practices
  },

  render: function() {
    var startDate = this.props.startDate;
    var endDate = this.props.endDate;
    var autoFocus = this.props.autoFocus;
    var rangePickerHidden = !this.state.dateRangePickerOpen;
    var rangePickerStyle = {};

    // TODO: Find a way to really remove this instead of just setting the display
    // to none.  I tried just not rendering it, but then I get an error later
    // saying the DateRangePicker is doing something after it's been unmounted.
    if (rangePickerHidden) {
      rangePickerStyle.display = 'none';
    }

    var rangePicker = (
      <div className="dateRangeContainer" style={rangePickerStyle}>
        <DateRangePicker
          firstOfWeek={1}
          numberOfCalendars={2}
          selectionType='range'
          earliestDate={new Date()} // should be derived from the server
          onSelect={this.handleSelect} />
      </div>
    );
    return  (
            <div className="TextFieldDateRangePicker">
              <input type="text" autoFocus={autoFocus} onFocus={this._onFocus} readOnly onBlur={this._onBlur} value={this._formatDate(startDate)} />
              <input type="text" onFocus={this._onFocus} onBlur={this._onBlur} readOnly value={this._formatDate(endDate)} />
              {rangePicker}
            </div>
            );
  }

});

module.exports = TextFieldDateRangePicker;