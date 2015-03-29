"use strict";

if (!global.Intl) {
    global.Intl = require('intl');
}

var React          = require('react');
var DataTable      = require('./DataTable.react');
var TeacherStore   = require('../stores/TeacherStore');
var TeacherActions = require('../actions/TeacherActions');

function getColumns() {
  return [
    {
      header: "名前",
      key: "name_jp",
      editable: true,
      sortable: true
    },
    {
      header: "Name",
      key: "name_en",
      editable: true,
      sortable: true
    },
    {
      header: "Color",
      key: "color",
      editable: true,
      sortable: true
    },
    {
      header: "授業時間",
      key: "classHours",
      formatter: "number",
      sortable: true
    },
    {
      header: "グループ授業時間",
      key: "groupHours",
      formatter: "number",
      sortable: true
    },
    {
      header: "個人授業時間",
      key: "privateHours",
      formatter: "number",
      sortable: true
    }];
}

// TODO: need to get rid of this and only include what's needed
function getTeacherTableState() {
  return {
    teachers: TeacherStore.getAllTeachers()
  };
}


var AddTeacherButton = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    // TODO: fill this in
  },

  componentWillUnmount: function() {
    // TODO: fill this in
  },

  _addTeacher: function() {
    TeacherActions.new();
  },

  render: function() {
    return (<button onClick={this._addTeacher}>Add teacher</button>)
  }
});

var TeacherTab = React.createClass({

  getInitialState: function() {
    return {};
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
    return (<div><DataTable data={TeacherStore.getAllTeachers()} actions={TeacherActions} columns={getColumns()}></DataTable>
            <AddTeacherButton></AddTeacherButton></div>)
  }
});


module.exports = TeacherTab;