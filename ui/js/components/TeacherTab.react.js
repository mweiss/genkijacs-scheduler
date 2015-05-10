"use strict";

var React          = require('react');
var DataTable      = require('./DataTable.react');
var TeacherStore   = require('../stores/TeacherStore');
var TeacherActions = require('../actions/TeacherActions');

function getColumns() {
  return [
    {
      header: "名",
      key: "firstname_jp",
      width: 10,
      filterable: true,
      editable: true,
      sortable: true
    },
    {
      header: "苗字",
      key: "lastname_jp",
      width: 10,
      filterable: true,
      editable: true,
      sortable: true
    },
    {
      header: "First name",
      key: "firstname_en",
      width: 10,
      editable: true,
      filterable: true,
      sortable: true
    },
    {
      header: "Last name",
      key: "lastname_en",
      width: 10,
      editable: true,
      filterable: true,
      sortable: true
    },
    {
      header: "Color",
      key: "color",
      width: 15,
      editable: true,
      sortable: true
    },
    {
      header: "授業時間",
      key: "classHours",
      width: 15,
      formatter: "number",
      sortable: true
    },
    {
      header: "グループ授業時間",
      key: "groupHours",
      width: 20,
      formatter: "number",
      sortable: true
    },
    {
      header: "個人授業時間",
      width: 20,
      key: "privateHours",
      formatter: "number",
      sortable: true
    }];
}

// TODO: need to get rid of this and only include what's needed
function getTeacherTableState() {
  return {
    teachers: TeacherStore.all()
  };
}

var TeacherTab = React.createClass({

  getInitialState: function() {
    return getTeacherTableState();
  },

  componentDidMount: function() {
    TeacherStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TeacherStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getTeacherTableState());
  },

  render: function() {
    return (<div><DataTable data={this.state.teachers} entityType="teacher" actions={TeacherActions} columns={getColumns()}></DataTable></div>)
  }
});


module.exports = TeacherTab;