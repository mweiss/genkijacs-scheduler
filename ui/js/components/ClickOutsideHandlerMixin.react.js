'use strict';

if (!global.Intl) {
    global.Intl = require('intl');
}
var React           = require('react');
var _ = require('underscore');

var ClickOutsideHandlerMixin = {
  
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

  _onMount: function() {
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

  _onUnmount: function() {
    clearTimeout(this._blurTimeout);
    clearTimeout(this._focusTimeout);

    if (this.state.isOpen) {
      this._unbindCloseMenuIfClickedOutside();
    }
  }
}

module.exports = ClickOutsideHandlerMixin;
