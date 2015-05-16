"use strict";

var React          = require("react");
var TeacherStore     = require("../stores/TeacherStore");
var StudentStore     = require("../stores/StudentStore");
var ReactSelect      = require('react-select');
var WebAPIUtils = require('../http/WebAPIUtils');
var _ = require('underscore');

var PrintScheduleModal = React.createClass({

  getInitialState: function() {
    return {
      selected: "all_students",
      selectedStudent: null,
      selectedTeacher: null
    };
  },

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
  },

  renderSelectElement: function(store, selectedValue, onSelect) {
    var allEls = store.all();
    var options = allEls.map(function(data) {
      return {
        label: data.firstname_en + ' ' + data.lastname_en,
        value: '' + data.id
      };
    });
    return (<ReactSelect
        placeholder="誰もない"
        className="PrintScheduleSelect"
        value={selectedValue}
        options={options}
        onChange={onSelect} />)
  },

  _onPrint: function() {
    var data = [{name: 'startDate', value: this.props.startDate.toJSON()}];
    var studentURL = '/print/student', teacherURL = '/print/teacher', url;

    switch (this.state.selected) {
      case "all_students":
      url = studentURL;
      break;
      case "all_teachers":
      url = teacherURL;
      break;
      case "single_student":
      url = studentURL;
      data.push({name: 'userId', value: this.state.selectedStudent});
      break;
      case "single_teacher":
      url = teacherURL;
      data.push({name: 'userId', value: this.state.selectedTeacher});
      break;
      default:
      // no op
    }

    var queryString = _.map(data, function(v) {
      return encodeURIComponent(v.name) + '=' + encodeURIComponent(v.value);
    }).join('&');

    window.open(url + '?' + queryString, '_blank');
    this.props.onClose();
  },

  _onStudentSelect: function(v) {
    var state = _.clone(this.state);
    state.selectedStudent = v;
    this.setState(state);
  },

  _onTeacherSelect: function(v) {
    var state = _.clone(this.state);
    state.selectedTeacher = v;
    this.setState(state);
  },

  _getClickHandler: function(label) {
    return _.bind(function() {
      var state = _.clone(this.state);
      state.selected = label;
      this.setState(state);
    }, this);
  },

  _determineIfChecked: function(label) {
    return this.state.selected === label;
  },

  render: function() {

    var studentSelect = this.renderSelectElement(StudentStore,
      this.state.selectedStudent,
      this._onStudentSelect);

    var teacherSelect = this.renderSelectElement(TeacherStore,
      this.state.selectedTeacher,
      this._onTeacherSelect);

    // TODO: Oh god!  This needs a helper method ASAP!
    return (
      <div className="PrintScheduleModal">
        <h3>Print options</h3>
        <ul>
          <li onClick={this._getClickHandler("all_students")}>
            <input type="radio" name="print_modal" id="print_schedle_modal_all_students" checked={this._determineIfChecked("all_students")} />
            <label for="print_schedle_modal_all_students">All students</label>
          </li>
          <li onClick={this._getClickHandler("all_teachers")}>
            <input type="radio" name="print_modal" id="print_schedle_modal_all_teachers" checked={this._determineIfChecked("all_teachers")} />
            <label for="print_schedle_modal_all_teachers">All teachers</label>
          </li>
          <li onClick={this._getClickHandler("single_student")}>
            <input type="radio" name="print_modal" id="print_schedle_modal_student" checked={this._determineIfChecked("single_student")} />
            <label for="print_schedle_modal_student">Student: </label>{studentSelect}
          </li>
          <li onClick={this._getClickHandler("single_teacher")}>
            <input type="radio" name="print_modal" id="print_schedle_modal_teacher" checked={this._determineIfChecked("single_teacher")} />
            <label for="print_schedle_single_teacher">Teacher: </label>{teacherSelect}
          </li>
        </ul>
        <div className="buttonGroup">
          <button className="btn" onClick={this.props.onClose}>Close</button>
          <button className="btn" onClick={this._onPrint}>Print</button>
        </div>
      </div>
    );
  }
});


module.exports = PrintScheduleModal;