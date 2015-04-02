"use strict";

var React           = require('react');
var DateRangePicker = require('react-daterange-picker');

var TextFieldDateRangePicker = React.createClass({
  getInitialState: function() {
    return {
      dateRangePickerOpen: false
    };
  },

  handleSelect: function(e) {
    console.log(e);
  },

  _onFocus: function(e) {
    this.setState({dateRangePickerOpen: true});
  },

  _onBlur: function(e) {
  },

  render: function() {
    var startDate = this.props.startDate;
    var endDate = this.props.endDate;
    var rangePicker = null;

    if (this.state.dateRangePickerOpen) {
      rangePicker = (
        <div className="dateRangeContainer" >
          <DateRangePicker
            firstOfWeek={1}
            numberOfCalendars={2}
            selectionType='range'
            earliestDate={new Date()} // should be derived from the server
            onSelect={this.handleSelect} />
        </div>
      );
    }

    return  (
            <div>
              <input type="text" onFocus={this._onFocus} onBlur={this._onBlur} value={startDate} />
              <input type="text" onFocus={this._onFocus} onBlur={this._onBlur} value={endDate} />
              {rangePicker}
            </div>
            );
  }

});

module.exports = TextFieldDateRangePicker;