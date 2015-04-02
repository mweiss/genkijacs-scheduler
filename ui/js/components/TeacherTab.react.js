"use strict";

var React          = require('react');
var DataTable      = require('./DataTable.react');
var TeacherStore   = require('../stores/TeacherStore');
var TeacherActions = require('../actions/TeacherActions');

function getColumns() {
  return [
    {
      header: "名前",
      key: "name_jp",
      width: 200,
      editable: true,
      sortable: true
    },
    {
      header: "Name",
      key: "name_en",
      width: 200,
      editable: true,
      sortable: true
    },
    {
      header: "Color",
      key: "color",
      width: 60,
      editable: true,
      sortable: true
    },
    {
      header: "授業時間",
      key: "classHours",
      width: 70,
      formatter: "number",
      sortable: true
    },
    {
      header: "グループ授業時間",
      key: "groupHours",
      width: 130,
      formatter: "number",
      sortable: true
    },
    {
      header: "個人授業時間",
      width: 100,
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
    return (<div><DataTable data={this.state.teachers} actions={TeacherActions} columns={getColumns()}></DataTable>
            <button onClick={TeacherActions.new}>Add teacher</button></div>)
  }
});


module.exports = TeacherTab;