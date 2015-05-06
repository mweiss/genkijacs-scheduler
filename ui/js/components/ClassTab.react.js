"use strict";

var React          = require("react");
var DataTable      = require("./DataTable.react");
var ClassStore   = require("../stores/ClassStore");
var ClassActions = require("../actions/ClassActions");

function getColumns() {
  return [
    {
      header: "名前",
      key: "name_jp",
      width: 20,
      editable: true,
      filterable: true,
      sortable: true
    },
    {
      header: "Name",
      key: "name_en",
      width: 20,
      editable: true,
      filterable: true,
      sortable: true
    },
    {
      header: "Scheduled hours", // TODO: translate
      key: "scheduledHours",
      width: 30,
      formatter: "number",
      sortable: true
    },
    {
      header: "Type", // TODO: translate
      key: "type",
      width: 30,
      sortable: true
    }];
}

// TODO: need to get rid of this and only include what's needed
function getClassTableState() {
  return {
    classes: ClassStore.all()
  };
}

var ClassTab = React.createClass({

  getInitialState: function() {
    return getClassTableState();
  },

  componentDidMount: function() {
    ClassStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ClassStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getClassTableState());
  },

  render: function() {
    return (<div><DataTable data={this.state.classes} entityType="class" actions={ClassActions} columns={getColumns()}></DataTable></div>)
  }
});


module.exports = ClassTab;