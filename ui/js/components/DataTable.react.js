'use strict';

if (!global.Intl) {
    global.Intl = require('intl');
}

var React     = require('react');
var ReactIntl = require('react-intl');
var _         = require('underscore');
var TextInput = require('./TextInput.react');

var IntlMixin = ReactIntl.IntlMixin;
var FormattedNumber = ReactIntl.FormattedNumber;

var DataTable = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    // TODO: fill this in
  },

  componentWillUnmount: function() {
    // TODO: fill this in
  },

  render: function() {
    var data = this.props.data || [],
        columns = this.props.columns || [],
        headers = columns.map(function(v) { return v.header || ''; });

    var rows = data.map(function(d) {
      var id = 'dtr-' + d.ui_id;
      return (<DataTableRow actions={this.props.actions} key={id} data={d} columns={columns} />);
    }, this);

    return (
      <div><table><DataTableHeader headers={headers} />{rows}</table></div>
    );
  }
});

var DataTableHeader = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    // TODO: fill this in
  },

  componentWillUnmount: function() {
    // TODO: fill this in
  }, 

  render: function() {
    var headers = this.props.headers || [];

    var tableHeaders = headers.map(function(v) {
      return (<th key={v}>{v}</th>);
    });

    return (<tr>{tableHeaders}</tr>);
  }
})

var DataTableRow = React.createClass({

  mixins: [IntlMixin],

  _editValues: null,

  getInitialState: function() {
    var key = null;

    // TODO: move this logic to the so that the data controls what's being edited,
    // and there aren't multiple sources of truth.
    if (this.props.data && this.props.data._new && this.props.columns) {
      var editableColumn = _.find(this.props.columns, function(c) {
        return c.editable;
      });
      if (editableColumn) {
        key = editableColumn.key;
      }
    }

    return {
      editColumnKey : key
    };
  },

  _resetEditValues: function() {
    console.log('reset values');
    if (this.state.editColumnKey) {
      this._initializeEditValues();
    }
    else {
      this._editValues = {};
    }
  },

  componentDidMount: function() {
    this._resetEditValues();
  },

  componentWillUnmount: function() {
    // TODO: fill this in
  }, 

  _resolveFormatter: function(formatter) {
    if (formatter) {
      switch (formatter) {
        case 'number':
          return function(v) {
            return (<FormattedNumber value={v} />);
          };
      }
    }
    return function(v) {
      return '' + v;
    }
  },

  _initializeEditValues: function() {
        console.log('init values');
    var columnsToCopy = _.reduce(this.props.columns, function(arr, c) {
      if (c.editable) {
        arr.push(c.key);
      }
      return arr;
    }, ['id', 'ui_id']);

    this._editValues = _.pick(this.props.data, columnsToCopy);
  },

  _setEditing: function(key) {
    this.setState({editColumnKey: key});
    this._initializeEditValues();
  },

  updateRow: function() {
    if (this.props.actions.save) {
      console.log(this._editValues);
      this.props.actions.save(this._editValues);
      this._resetEditValues();
      this.setState({editColumnKey: null});
    }
  },

  _createCell: function(column) {
    var data = this.props.data,
        v = data[column.key],
        formatter = this._resolveFormatter(column.formatter),
        formattedValue = formatter(v),
        cellValue = formattedValue,
        autoFocus = this.state.editColumnKey === column.key;

    var self = this;
    
    function noop() {
      // do nothing
    };

    var editingFunc = !column.editable ? noop : function() {
      if (!self.state.editColumnKey) {
        self._setEditing(column.key);
      }
    };

    var onSave = function(value) {
      console.log('new value', value);
      self._editValues[column.key] = value;
    };

    var key = 'dtrc-' + data.ui_id + '-' + column.key;

    if (this.state.editColumnKey && column.editable) {
      cellValue = (<TextInput key={key} autoFocus={autoFocus} value={v} onSave={onSave} />);
    }

    return (<td onClick={editingFunc} key={key}>{cellValue}</td>);
  },

  render: function() {
    var columns = this.props.columns,
        cells = columns.map(this._createCell, this);

    var id = 'save';
    if (this.state.editColumnKey) {
      cells.push((<td key={id}><button onClick={this.updateRow}>Save</button></td>));
    }

    return (<tr>{cells}</tr>) ;
  }

});

module.exports = DataTable;