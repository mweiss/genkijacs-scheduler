"use strict";

var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var _ = require("underscore");

var CHANGE_EVENT = "change";

var _id_counter = 0;

// TODO: Actually make rules for how the store should treat it's arguments!!!!  Right now it's very
// inconsistent!

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

    del: function(data, silenceChange) {
      var old = _valueMap[data.ui_id];

      if (old) {
        this.removeFromCache(old);
        // TODO: This is super inefficient!  Do I need to keep this around?
        _values = _.filter(_values, function(v) {
          return v.ui_id !== data.ui_id;
        });

        delete _valueMap[data.ui_id];

        if (!silenceChange) {
          this.emitChange();
        }
      }


    },

    save: function(row, silenceChange) {
      var v = _valueMap[row.ui_id];
      if (v) {
        this.removeFromCache(v);
        _.extend(v, v.editData);

      }
      else {
        v = row;
        if (!v.ui_id) {
          v.ui_id = incrementCounter();
        }
        _values.push(v);
      }

      if (v._new) {
        v._new = false;
      }
      if (v.editData) {
        v.editData = null;
      }
      this._updateCaches(v);
      if (!silenceChange) {
        this.emitChange();
      }
      console.log(_values);
      console.log(_valueMap);
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