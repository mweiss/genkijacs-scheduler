'use strict';

if (!global.Intl) {
    global.Intl = require('intl');
}

var React     = require('react');
var ReactIntl = require('react-intl');

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
      return (<DataTableRow actions={this.props.actions} key={d.id} data={d} columns={columns} />);
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
    return {
      editColumn: null
    };
  },

  _resetEditValues: function() {
    this._editValues = {};
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

  _setEditing: function(key) {
    this.setState({editColumnKey: key});
  },

  updateRow: function() {
    console.log('update row', this._editValues);
    if (this.props.actions && this.props.actions.update) {
      this._editValues.id = this.props.data.id;
      this.props.actions.update(this._editValues);
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
    
    var editingFunc = function() {
      self._setEditing(column.key);
    };

    var onSave = function(value) {
      self._editValues[column.key] = value;
    };

    var key = '' + data.id + column.key;

    if (this.state.editColumnKey) {
      cellValue = (<TextInput autoFocus={autoFocus} value={v} onSave={onSave} />);
    }

    return (<td onClick={editingFunc} key={key}>{cellValue}</td>);
  },

  render: function() {
    var columns = this.props.columns,
        cells = columns.map(this._createCell, this);

    if (this.state.editColumnKey) {
      cells.push((<td><button onClick={this.updateRow}>Save</button></td>));
    }

    return (<tr>{cells}</tr>) ;
  }

});

module.exports = DataTable;