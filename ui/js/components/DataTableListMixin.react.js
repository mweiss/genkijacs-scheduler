'use strict';

if (!global.Intl) {
    global.Intl = require('intl');
}
var React           = require('react');
var ReactIntl = require('react-intl');
var FormattedDate = ReactIntl.FormattedDate;
var _ = require('underscore');

// Required methods to implement:  renderReadListItem(v), renderEditListItem(obj), emptyItem, showDeleteButton
var DataTableListMixin = {

  getInitialState: function() {
    return {};
  },

  renderList: function() {
    var elements = _.map(this.props.value, function(v) {
      return (<li>{this.renderReadListItem(v)}</li>);
    }, this);

    return (<ul>{elements}</ul>);
  },

  renderEditList: function() {
    var editListElements = (this.props.value || []).concat(this.emptyItem());
    var elements = _.map(editListElements, function(v, i) {
      var autoFocus = false;
      if (this.props.autoFocus && editListElements.length === 1 ) {
        autoFocus = true;
      }

      var _onSelect = function(value) {
        var values = _.clone(this.props.value);
        values[i] = {start: value.start.format(), end: value.end.format()};
        if (this.props.onSave) {
          this.props.onSave(values);
        }
      };

      var _onDelete = function(value) {
        var values = _.clone(this.props.value);
        values.splice(i, 1);
        if (this.props.onSave) {
          this.props.onSave(values);
        }
      };

      _onSelect = _.bind(_onSelect, this);
      _onDelete = _.bind(_onDelete, this);
      var renderedItem = this.renderEditListItem({value: v, onSelect: _onSelect, onDelete: _onDelete, autoFocus: autoFocus});
      var deleteButton = this.showDeleteButton(v) ? (<button onClick={_onDelete}>X</button>) : null;
      return (<li>{[renderedItem, deleteButton]}</li>);
    }, this);

    return (<ul>{elements}</ul>);
  },

  render: function() {
    var components = [];
    if (this.props.editing) {
      components = this.renderEditList();
    }
    else {
      components = this.renderList();
    }

    return (<div>{components}</div>);
  },


  formattedDate: function(s) {
    var d = new Date(s);
    return (<FormattedDate value= {d} day="numeric"
              month="numeric"
              year="numeric" />);
  },

  parseDate: function(d) {
    if (d) {
      return new Date(d);
    }
    else {
      return null;
    }
  }
};

module.exports = DataTableListMixin;
