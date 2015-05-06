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
      filterText: null,
      columnGroupIndex: 0
    };
  },

  _getColumns: function() {
    if (this.props.columns) {
      return this.props.columns;
    }
    else if (this.props.columnGroups) {
      return this.props.columnGroups  [this.state.columnGroupIndex].columns;
    }
    else {
      return [];
    }
  },

  _onSort: function(val) {
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
    var columns = this._getColumns();

    if (filterText) {
      var columnsToCheck = _.filter(columns, function(c) {
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
      var c = _.find(columns || [], function(v) {
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

  renderColumnGroups: function() {
    var columnGroups = null;
    if (this.props.columnGroups) {
      var links = _.map(this.props.columnGroups, function(cg, i) {
        var oC = _.bind(function(e) {
          if (e.preventDefault) {
            e.preventDefault();
          }
          var state = _.clone(this.state);
          state.columnGroupIndex = i;
          this.setState(state);
        }, this);
        var classNames = [];
        if (this.state.columnGroupIndex === i) {
          classNames.push("selected");
        }
        if (i === 0) {
          classNames.push("first")
        }
        return (<a href="#" className={classNames.join(" ")} onClick={oC}>{cg.header}</a>);
      }, this);

      columnGroups = (<div className="columnGroups">{links}</div>);
    }
    return columnGroups;    
  },

  saveAll: function() {
    if (this.props.actions.save) {
      this.props.actions.save();
    }
  },

  discardAll: function() {
    if (this.props.actions.discard) {
      this.props.actions.discard();
    }
  },

  newRow: function() {
    if (this.props.actions.newRow) {
      this.props.actions.newRow();
    }
  },

  renderEditButtons: function(data) {
    var unsavedChangesExist = _.filter(data, function(d) {
      return d.editData && true;
    }).length > 0;

    var onSave = null,
        onDiscard = null,
        onNew = this.newRow,
        classNames = ["btn"];
    if (unsavedChangesExist) {
      onSave = this.saveAll;
      onDiscard = this.discardAll;
    }
    else {
      classNames.push("disabled");
    }

    return (<div className="EditButtons">
              <button className="btn AddButton" onClick={onNew}>New {this.props.entityType}</button>
              <button className={classNames.join(" ")} onClick={onSave}>Save</button>
              <button className={classNames.join(" ")} onClick={onDiscard}>Discard</button>
            </div>);
  },

  render: function() {
    var data = this.formatData(),
        columns = this._getColumns(),
        headers = columns.map(function(v) { return { key: v.key, header: v.header || '', width: v.width, sortable: v.sortable }; });

    var rows = data.map(function(d, index) {
      var id = 'dtr-' + d.ui_id;
      return (<DataTableRow lastRow={index === data.length - 1} index={index} actions={this.props.actions} key={id} data={d} columns={columns} />);
    }, this);

    var columnGroups = this.renderColumnGroups();
    var editButtons  = this.renderEditButtons(data);

    return (
      <div className="DataTable">
        <div className="DataTableTools">
          <TextInput className="DataTableFilter" placeholder="検索" onSave={this._onFilter} />
          {editButtons}
          {columnGroups}
        </div>
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
        {editButtons}
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
        styles.width = v.width + "%";
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

    if (this._isEditing() && this.props.data && this.props.data._new && this.props.columns) {
      var editableColumn = _.find(this.props.columns, function(c) {
        return c.editable;
      });
      if (editableColumn) {
        key = editableColumn.key;
      }
    }

    return {
      editColumnKey: key,
      error: false
    };
  },

  _resolveFormatter: function(formatter) {
    if (typeof formatter === 'function') {
      return formatter;
    }
    else if (formatter) {
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

  _isEditing: function() {
    return this.props.data.editData && true;
  },

  fetchEditingFunction: function(column) {
    var editingFunc = null;
    if (column.editable && !this._isEditing()) {
      editingFunc = _.bind(function() {
        this._setEditing(column.key);
      }, this);
    }
    return editingFunc;
  },

  _createCell: function(column, i) {
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
      cellValue = formatter(v, data);
    }

    var className = "";
    if (i === 0) {
      className = "FirstCell";
    }
    else if (i === this.props.columns.length - 1) {
      className = "LastCell";
    }

    return (<td className={className} onClick={editingFunc} key={key}><div>{cellValue}</div></td>);
  },

  render: function() {
    var columns = this.props.columns,
        cells = columns.map(this._createCell, this);

    var classNames = [this.props.index % 2 === 0 ? 'DataTable__even' : 'DataTable__odd'];
    if (this.props.data.errors && this.props.data.errors.length > 0) {
      classNames.push("DataTable__error");
    }
    if (this.props.lastRow) {
      classNames.push("DataTable__lastRow");
    }
    return (<tr className={classNames.join(" ")}>{cells}</tr>) ;
  }

});

module.exports = DataTable;