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
    return {
      sortedColumnKey: null,
      ascending: true,
      filterText: null
    };
  },

  _onSort: function(val) {
    // Search for the column via the key
    // If there's a sort function, use it, otherwise use the default sort
    var state = _.clone(this.state);
    if (state.sortedColumnKey === val.key) {
      state.ascending = !state.ascending;
    }
    else {
      state.ascending = true;
      state.sortedColumnKey = val.key;
    }
    this.setState(state);
  },

  _makeDescending: function(f) {
    return function(a, b) {
      return -1 * f(a, b);
    }
  },

  /**
   * Returns the sorted and filtered data.
   */
  formatData: function() {
    var data = this.props.data || [];
    var key = this.state.sortedColumnKey;
    var filterText = this.state.filterText;

    if (filterText) {
      var columnsToCheck = _.filter(this.props.columns, function(c) {
        return c.filterable;
      });

      data = _.filter(data, function(d) {
        for (var i = 0; i < columnsToCheck.length; i += 1) {
          var ckey = columnsToCheck[i].key;
          var val = d[ckey] || "";
          if (val.toLowerCase().indexOf(filterText) !== -1) {
            return true;
          }
        }
        return false;
      }, this);
    }
    if (key) {
      var c = _.find(this.props.columns || [], function(v) {
        return v.key === key;
      });
      var f;
      if (c && c.sortFunction) {
        f = c.sortFunction;
      }
      else {
        f = function(a, b) {
          var vA = a[key],
              vB = b[key];
          if (vA > vB) {
            return 1;
          }
          else if (vA < vB) {
            return -1;
          }
          else {
            return 0;
          }
        };
      }

      if (!this.state.ascending) {
        f = this._makeDescending(f);
      }

      data = _.clone(data).sort(f);
    }
    return data;
  },

  _onFilter: function(v) {
    var state = _.clone(this.state);
    state.filterText = (v || "").toLowerCase();
    this.setState(state);
  },

  render: function() {
    var data = this.formatData(),
        columns = this.props.columns || [],
        headers = columns.map(function(v) { return { key: v.key, header: v.header || '', width: v.width, sortable: v.sortable }; });

    var rows = data.map(function(d, index) {
      var id = 'dtr-' + d.ui_id;
      return (<DataTableRow index={index} actions={this.props.actions} key={id} data={d} columns={columns} />);
    }, this);

    return (
      <div className="DataTable">
      <TextInput className="DataTableFilter" placeholder="検索" onSave={this._onFilter} />
      <table>
        <DataTableHeader
          sortedColumnKey={this.state.sortedColumnKey}
          ascending={this.state.ascending}
          onSort={this._onSort}
          headers={headers} />
        <tbody>
        {rows}
        </tbody>
      </table>
      </div>
    );
  }
});

var DataTableHeader = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    var headers = this.props.headers || [];
    var onSort = this.props.onSort;

    var tableHeaders = headers.map(function(v) {
      var styles = {};
      if (typeof v.width === 'number') {
        styles.width = v.width + "px";
      }
      var onC = null;
      if (v.sortable) {
        onC = _.bind(function(e) {
          if (this.props.onSort) {
            onSort(v);
          }
        }, this);
      }
      var className = "";
      if (v.key === this.props.sortedColumnKey) {
        className = this.props.ascending ? "ascending" : "descending";
      }
      return (<th className={className} style={styles} onClick={onC} key={v.header}>{v.header}</th>);
    }, this);

    return (<tr>{tableHeaders}</tr>);
  }
})

var DataTableRow = React.createClass({

  mixins: [IntlMixin],

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

  _editableData: function() {
    var columnsToCopy = _.reduce(this.props.columns, function(arr, c) {
      if (c.editable) {
        arr.push(c.key);
      }
      return arr;
    }, ['id', 'ui_id']);

    return _.extend({}, this.props.data, _.pick(this.props.data.editData || {}, columnsToCopy));
  },

  _setEditing: function(key) {
    this.setState({editColumnKey: key});
    var rowData = _.pick(this.props.data, ['id', 'ui_id']);
    if (this.props.actions.edit) {
      this.props.actions.edit(rowData);
    }
  },

  updateRow: function() {
    if (this.props.actions.save) {
      this.props.actions.save(_.clone(this.props.data));
      this.setState({editColumnKey: null}); // I may be able to get rid of this
    }
  },

  _isEditing: function() {
    return this.props.data.editData && true;
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
    var data      = this._editableData(),
        v         = data[column.key],
        formatter = this._resolveFormatter(column.formatter),
        Renderer  = column.renderer,
        autoFocus = this.state.editColumnKey === column.key,
        isEditing = this._isEditing(), // TODO: maybe simplify this or abstract it out
        cellValue;
    
    var editingFunc = this.fetchEditingFunction(column);

    var _onSave = _.bind(function(value) {
      var rowData = _.pick(this.props.data, ['id', 'ui_id', 'editData']);
      rowData[column.key] = value;
      if (this.props.actions.edit) {
        this.props.actions.edit(rowData);
      }
    }, this);

    var key = 'dtrc-' + data.ui_id + '-' + column.key;

    if (Renderer) {
      cellValue = <Renderer editing={isEditing} formatter={formatter} key={key}
                            autoFocus={autoFocus} data={data} value={v} onSave={_onSave} />;
    }
    else if (this._isEditing() && column.editable) {
      cellValue = (<TextInput key={key} autoFocus={autoFocus} value={v} onSave={_onSave} />);
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
    if (this._isEditing()) {
      cells.push((<td className="save" key={id}><div><button onClick={this.updateRow}>Save</button></div></td>));
    }

    return (<tr className={this.props.index % 2 === 0 ? 'DataTable__even' : 'DataTable__odd'}>{cells}</tr>) ;
  }

});

module.exports = DataTable;