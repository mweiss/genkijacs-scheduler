"use strict";

var React          = require("react");
var DataTable      = require("./DataTable.react");
var StudentStore   = require("../stores/StudentStore");
var StudentActions = require("../actions/StudentActions");

var EnrollmentDateList  = {}; // TODO implement this
var ClassesList = {}; // TODO: implement

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
      header: "Enrollment date", // TODO: jp translation
      key: "enrollmentDates",
      renderer: EnrollmentDateList,
      editable: true,
      sortable: true
    },
    {
      header: "授業",
      key: "class",
      renderer: ClassesList,
      sortable: true,
      editable: true
    },
    {
      header: "母国語",
      key: "primary_language",
      sortable: true,
      editable: true
    },
    {
      header: "国籍",
      key: "home_country",
      sortable: true,
      editable: true
    },
    {
      header: "日本語レベル",
      key: "japanese_proficiency",
      sortable: true,
      editable: true
    },
    {
      header: "他の情報", // Get the right japanese translation
      key: "notes",
      editable: true
    }];
}

// TODO: this is very similar to the teacher and classes tab, so I might be able to
// consolidate this logic

// TODO: need to get rid of this and only include what's needed
function getStudentTableState() {
  return {
    students: StudentStore.all()
  };
}

var StudentTab = React.createClass({

  getInitialState: function() {
    return getStudentTableState();
  },

  componentDidMount: function() {
    StudentStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    StudentStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getStudentTableState());
  },

  render: function() {
    return (<div><DataTable data={this.state.students} actions={StudentActions} columns={getColumns()}></DataTable>
            <button onClick={StudentActions.new}>Add student</button></div>)
  }
});


module.exports = StudentTab;