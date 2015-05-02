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

  clickedOutsideElement: function(element, event) {
    var eventTarget = (event.target) ? event.target : event.srcElement;
    while (eventTarget != null) {
      if (eventTarget === element) {
        return false;
      }
      eventTarget = eventTarget.parentNode;
    }
    return true;
  },

  componentWillMount: function() {

    this._closeMenuIfClickedOutside = _.bind(function(event) {
      if (!this.state.dateRangePickerOpen) {
        return;
      }
      var container = this.refs.textFieldDateRangePicker.getDOMNode();

      var eventOccuredOutside = this.clickedOutsideElement(container, event);

      // Hide dropdown menu if click occurred outside of menu
      if (eventOccuredOutside) {
        this.setState({
          dateRangePickerOpen: false
        }, this._unbindCloseMenuIfClickedOutside);
      }
    }, this);

    this._bindCloseMenuIfClickedOutside = function() {
      document.addEventListener('click', this._closeMenuIfClickedOutside);
    };

    this._unbindCloseMenuIfClickedOutside = function() {
      document.removeEventListener('click', this._closeMenuIfClickedOutside);
    };
  },

  componentWillUnmount: function() {
    clearTimeout(this._blurTimeout);
    clearTimeout(this._focusTimeout);

    if(this.state.isOpen) {
      this._unbindCloseMenuIfClickedOutside();
    }
  },

  // TODO: This sort of bubble up is really frowned upon in React... I should do this in a smarter way by
  // having an action for this!
  handleSelect: function(dateRange) {
    this.setState({dateRangePickerOpen: false}, this._unbindCloseMenuIfClickedOutside);
    if (this.props.onSelect) {
      this.props.onSelect(dateRange);
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
        <DateRangePicker ref="dateRangePicker"
          firstOfWeek={1}
          numberOfCalendars={2}
          selectionType='range'
          earliestDate={new Date()} // should be derived from the server
          onSelect={this.handleSelect} />
      </div>
    );
    return  (
            <div className="TextFieldDateRangePicker" ref="textFieldDateRangePicker">
              <input type="text" onClick={this._onFocus} readOnly onBlur={this._onBlur} value={this._formatDate(startDate)} />
              <input type="text" onClick={this._onFocus} onBlur={this._onBlur} readOnly value={this._formatDate(endDate)} />
              {rangePicker}
            </div>
            );
  }

});

module.exports = TextFieldDateRangePicker;