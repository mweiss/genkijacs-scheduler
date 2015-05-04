"use strict";

var React          = require("react");
var DataTable      = require("./DataTable.react");
var EnrollmentDateList  = require('./EnrollmentDateList.react');
var ClassRegistrationList = require('./ClassRegistrationList.react');
var StudentStore   = require("../stores/StudentStore");
var ClassRegistrationStore = require("../stores/ClassRegistrationStore");
var StudentActions = require("../actions/StudentActions");
var _ = require('underscore');

var ClassesList = {}; // TODO: implement

function getColumnGroups() {
  return [
    {header: "Classes", columns: getColumns("classes")},
    {header: "Student Info", columns: getColumns("studentInfo")}
  ];
}

function getColumns(type) {
  // Common columns
  var columns = [
    {
      header: "名前",
      key: "name_jp",
      width: 20,
      filterable: true,
      editable: true,
      sortable: true
    },
    {
      header: "Name",
      key: "name_en",
      width: 20,
      editable: true,
      filterable: true,
      sortable: true
    }];

  if (type === 'classes') {
    columns = columns.concat([
      {
        header: "授業",
        key: "classes",
        renderer: ClassRegistrationList,
        width: 60,
        sortable: true,
        editable: true
      }]);
  }
  else if (type === 'studentInfo') {
    columns = columns.concat([{
      header: "年齢",
      key: "age",
      width: 12,
      editable: false,
      sortable: true
    },
    {
      header: "生年月日",
      key: "birthday",
      width: 12,
      editable: false,
      sortable: true
    },
    {
      header: "母国語",
      key: "primary_language",
      width: 12,
      sortable: true,
      editable: true
    },
    {
      header: "国籍",
      key: "home_country",
      width: 12,
      sortable: true,
      editable: true
    },
    {
      header: "日本語レベル",
      key: "japanese_proficiency",
      width: 12,
      sortable: true,
      editable: true
    }]);
  }

  return columns;
}

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
    var students = _.map(this.state.students, function(v) {
      var cloned = _.clone(v);
      cloned.classes = ClassRegistrationStore.findByStudentId(v.id) || [];
      return cloned;
    });

    return (<div><DataTable data={students} entityType="student" actions={StudentActions} columnGroups={getColumnGroups()}></DataTable></div>)
  }
});


module.exports = StudentTab;