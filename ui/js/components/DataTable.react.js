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
        headers = columns.map(function(v) { return { header: v.header || '', width: v.width }; });

    var rows = data.map(function(d, index) {
      var id = 'dtr-' + d.ui_id;
      return (<DataTableRow index={index} actions={this.props.actions} key={id} data={d} columns={columns} />);
    }, this);

    return (
      <div className="DataTable"><table><DataTableHeader headers={headers} />{rows}</table></div>
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
      var styles = {};
      if (typeof v.width === 'number') {
        styles.width = v.width + "px";
      }
      return (<th style={styles} key={v.header}>{v.header}</th>);
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
      this.props.actions.save(this._editValues);
      this._resetEditValues();
      this.setState({editColumnKey: null});
    }
  },

  fetchEditingFunction: function(column) {
    var editingFunc = null;
    if (column.editable && !this.state.editColumnKey) {
      editingFunc = _.bind(function() {
        this._setEditing(column.key);
      }, this);
    }
    return editingFunc;
  },

  _createCell: function(column) {
    var data      = this.props.data,
        v         = data[column.key],
        formatter = this._resolveFormatter(column.formatter),
        Renderer  = column.renderer,
        autoFocus = this.state.editColumnKey === column.key,
        isEditing = this.state.editColumnKey,
        cellValue;
    
    var editingFunc = this.fetchEditingFunction(column);

    var onSave = _.bind(function(value) {
      this._editValues[column.key] = value;
    }, this);

    var key = 'dtrc-' + data.ui_id + '-' + column.key;

    if (Renderer) {
      cellValue = <Renderer editing={isEditing} formatter={formatter} key={key} autoFocus={autoFocus} data={data} value={v} onSave={onSave} />;
    }
    else if (this.state.editColumnKey && column.editable) {
      cellValue = (<TextInput key={key} autoFocus={autoFocus} value={v} onSave={onSave} />);
    }
    else {
      cellValue = formatter(v);
    }

    return (<td onClick={editingFunc} key={key}><div>{cellValue}</div></td>);
  },

  render: function() {
    var columns = this.props.columns,
        cells = columns.map(this._createCell, this);

    var id = 'save';
    if (this.state.editColumnKey) {
      cells.push((<td className="save" key={id}><div><button onClick={this.updateRow}>Save</button></div></td>));
    }

    return (<tr className={this.props.index % 2 === 0 ? 'DataTable__even' : 'DataTable__odd'}>{cells}</tr>) ;
  }

});

module.exports = DataTable;