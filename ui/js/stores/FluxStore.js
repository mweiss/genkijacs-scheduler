"use strict";

var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var _ = require("underscore");

var CHANGE_EVENT = "change";

var _id_counter = 0;

function incrementCounter() {
  return _id_counter++;
}

function createStore() {
  var _values = [];
  var _valueMap = {};
  var _idMap = {};

  var store = assign({}, EventEmitter.prototype, {
    all: function() {
      return _values;
    },

    emitChange: function() {
      this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    },

    edit: function(data) {
      var row = _valueMap[data.ui_id];
      if (row) {
        var editData = row.editData || {};
        editData = _.extend(editData, data);
        row.editData = editData;
        this.emitChange();
      }
    },

    save: function(row) {
      var old = _valueMap[row.ui_id];
      if (old) {
        this.removeFromCache(old);
        _.extend(old, old.editData);
        if (old._new) {
          old._new = false;
        }
        if (old.editData) {
          old.editData = null;
        }
        this._updateCaches(old);
        this.emitChange();
      }
    },

    removeFromCache: function() {
      return; // noop
    },

    addToCache: function() {
      return; // noop
    },

    _updateCaches: function(v) {
      _valueMap[v.ui_id] = v;
      if (v.id) {
        _idMap[v.id] = v;
      }
      this.addToCache(v);
    },

    findById: function(id) {
      return _idMap[id];
    },

    setAll: function(values) {
      _values = values;
      _valueMap = {};
      _.each(values, function(t) {
        t.ui_id = incrementCounter();
        this._updateCaches(t);
      }, this);
      this.emitChange();
    },

    initEntity: function() {
      return {};
    },

    append: function() {
      var ui_id = incrementCounter();

      var value = this.initEntity(ui_id);
      value.ui_id = ui_id;
      value._new = true;
      value.editData = {ui_id: ui_id};
      _values.push(value);
      this._updateCaches(value);

      this.emitChange();
    }
  });

  return store;
}

module.exports = {
  createStore: createStore
};