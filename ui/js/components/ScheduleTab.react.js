"use strict";

if (!global.Intl) {
    global.Intl = require('intl');
}

var React            = require('react');
var ReactIntl        = require('react-intl');
var FormattedDate    = ReactIntl.FormattedDate;
var _                = require("underscore");
var ClassPeriodStore = require("../stores/ClassPeriodStore");
var RoomStore        = require("../stores/RoomStore");
var ClassStore       = require("../stores/ClassStore");
var TeacherStore     = require("../stores/TeacherStore");
var TextInput        = require('./TextInput.react');
var ReactSelect      = require('react-select');



function createTime(date, hour, minute) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute).toJSON();
}

var DateHeader = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    var startDate = this.props.startDate;
    var endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 5);

    return (
      <div className="DateHeader">
         <h2><FormattedDate value={startDate} /> - <FormattedDate value={endDate} /></h2>
         <div className="dateBtnGroup">
           <button className="btn" onClick={this.props.onPrevious} >&larr;</button>
           <button className="btn" onClick={this.props.onNext}>&rarr;</button>
         </div>
         <div className="actionBtnGroup">
           <button className="btn">Copy last week</button>
           <button className="btn">Print schedules</button>
         </div>
      </div>
    );
  }
});

var ClassPeriodCell = React.createClass({
  getInitialState: function() {
    return {
      classFocused: false,
      teacherFocused: false
    };
  },

  _findClassList: function() {
    return _.map(ClassStore.all(), function(val) {
      return {
        value: "" + val.id,
        label: val.name_jp
      };
    });
  },

  _findTeacherList: function() {
    return _.map(TeacherStore.all(), function(val) {
      return {
        value: "" + val.id,
        label: val.name_jp
      };
    });
  },

  onClassSelect: function(v) {
    var cp = _.clone(this._findClassPeriod());
    cp.classId = v;
    ClassPeriodStore.edit(cp);
    ClassPeriodStore.save(cp);
  },

  onTeacherSelect: function(v) {
    var cp = _.clone(this._findClassPeriod());
    cp.teacherId = v;
    ClassPeriodStore.edit(cp);
    ClassPeriodStore.save(cp);
  },

  _onFocus: function(lbl) {
    return _.bind(function(e) {
      var state = _.clone(this.state);
      state[lbl] = true;
      this.setState(state);
    }, this);
  },

  _onBlur: function(lbl) {
    return _.bind(function(e) {
      var state = _.clone(this.state);
      state[lbl] = false;
      this.setState(state);
    }, this);
  },

  _findClassPeriod: function() {
    var interval = this.props.interval;
    var date = this.props.date;
    var roomId = this.props.roomId;

    var days = ClassPeriodStore.findByDay(date) || {};
    var classPeriods = days[roomId] || [];

    var classPeriod = _.find(classPeriods, function(v) {
      var startDate = new Date(v.startDate);
      var hour = startDate.getHours();
      var minutes = startDate.getMinutes();
      return hour === interval.hour && minutes === interval.minute;
    }, this);

    var intervalStart = createTime(date, interval.hour, interval.minute);
    var intervalEnd = createTime(date, interval.hour + interval.length, interval.minute + interval.length);

    classPeriod = classPeriod || {startDate: intervalStart, endDate: intervalEnd, roomId: roomId};

    return classPeriod;
  },

  render: function() {
    var classPeriod = this._findClassPeriod();
    var cid = classPeriod.classId || null;
    var tid = classPeriod.teacherId || null;
    var classPlaceholder = "何もない";
    var teacherPlaceholder = "誰もない";

    var classInput;
    var teacherInput;

    var csNames = ["ClassList"];
    var tsNames = ["TeacherList"];

    if (cid) {
      csNames.push("ListSelected");
    }
    if (tid) {
      tsNames.push("ListSelected");
    }

    if (this.state.classFocused) {
      classInput = (<ReactSelect
          placeholder={classPlaceholder}
          className={csNames.join(" ")}
          clearable={false}
          value={cid}
          options={this._findClassList()}
          onChange={this.onClassSelect}
          autoFocus={true}
          onBlur={this._onBlur("classFocused")}
        />)
    }
    else {
      var c = ClassStore.findById(cid);
      classInput = (<input className={csNames.join(" ")} onFocus={this._onFocus("classFocused")} readOnly={true} value={c ? c.name_jp : classPlaceholder} />)
    }


    if (this.state.teacherFocused) {
      teacherInput = (<ReactSelect
          placeholder={teacherPlaceholder}
          className={tsNames.join(" ")}
          clearable={false}
          value={tid}
          autoFocus={true}
          onBlur={this._onBlur("teacherFocused")}
          options={this._findTeacherList()}
          onChange={this.onTeacherSelect}
        />);
    }
    else {
      var t = TeacherStore.findById(tid);
      teacherInput = (<input className={tsNames.join(" ")} onFocus={this._onFocus("teacherFocused")} readOnly={true} value={t ? t.name_jp : teacherPlaceholder} />)
    }
    var classNames = ["ClassPeriodCell"];
    if (this.props.lastCell) {
      classNames.push("ClassPeriodLastCell");
    }
    if (this.props.firstCell) {
      classNames.push("ClassPeriodFirstCell");
    }

    return (
      <div className={classNames.join(" ")}>
        {classInput}{teacherInput}
      </div>
    );
  }
});

var RoomCell = React.createClass({
  getInitialState: function() {
    return {};
  },

  onEdit: function(columnName) {
    return _.bind(function(e) {
      var obj = {};
      obj[columnName] = e;
      obj.ui_id = this.props.room.ui_id;
      RoomStore.edit(obj);
    }, this);
  },

  onStartEdit: function() {
    RoomStore.edit(this.props.room);
  },

  onSave: function() {
    RoomStore.save(this.props.room);
  },

  render: function() {
    var room = this.props.room;
    var clickHandler = null;
    var roomCellContents;
    // Render a room cell
    if (room.editData) {
      roomCellContents = (
        <form>
          <ul>
            <li><label name="name_jp">名前</label><TextInput onSave={this.onEdit("name_jp")} name="name_jp" type="text" value={room.name_jp} /></li>
            <li><label name="name_en">Name</label><TextInput onSave={this.onEdit("name_en")} name="name_en" type="text" value={room.name_en} /></li>
            <li><label name="capacity">Capacity</label><TextInput onSave={this.onEdit("capacity")} name="capacity" type="text" value={room.capacity} /></li>
            <button onClick={this.onSave}>Save</button>
          </ul>
        </form>
        );
    }
    else {
      roomCellContents = (<div className="RoomCellOuter"><span className="RoomCellInner">{room.name_jp}</span></div>);
      clickHandler = this.onStartEdit;
    }

    return (<div onClick={clickHandler} className="RoomCell">{roomCellContents}</div>);
  }
});

var RoomRow = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    var room          = this.props.room;
    var intervals     = this.props.intervals;
    var totalInterval = this.props.totalInterval;
    var date          = this.props.date;

    var roomCell = (<RoomCell room={room} />);

    var intervalCells = _.map(intervals, function(interval, i) {
      return (<ClassPeriodCell interval={interval}
                 roomId={room.id}
                 lastCell={(i + 1) === intervals.length}
                 firstCell={i === 0}
                 date={date} />);
    }, this);

    var classNames = ["RoomRow"];
    if (this.props.lastRow) {
      classNames.push("RoomRowLast");
    }
    // Render a room row
    return (<div className={classNames.join(" ")}>{roomCell}{intervalCells}</div>);
  }
});

// TODO: need the class periods sorted by day, then by room, e.g:
// day -> room -> [class periods, sorted by date]
var DaySchedule = React.createClass({

  getInitialState: function() {
    // TODO: make this meaningful?
    return {i : 0};
  },

  renderHeader: function() {
    var intervals = this.props.intervals;
    return null; // TODO: implement me!
  },

  componentDidMount: function() {
    RoomStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    RoomStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({i : this.state.i + 1});
  },

  renderBody: function() {
    var date = this.props.date;
    var data = ClassPeriodStore.findByDay(date);
    var rooms = RoomStore.all();
    var intervals = this.props.intervals;
    var totalInterval = this.props.totalInterval;

    var roomRows = _.map(rooms, function(room, i) {
      var classPeriods = data[room.id];
      // TODO: remove for correct logic last row logic
      return (<RoomRow lastRow={(i + 1) === rooms.length} date={date} intervals={intervals} totalInterval={this.props.totalInterval} classPeriods={classPeriods} room={room}/>);
    }, this);

    var intervals = _.map(intervals, function(interval) {
      function two(v) {
        if (v < 10) { return '0' + v; }
        else        { return '' + v; }
      }

      var start = two(interval.hour) + ':' + two(interval.minute);
      var hUp = interval.hour + Math.floor((interval.minute + interval.length) / 60);
      var mUp = (interval.minute + interval.length) % 60;
      var end = two(hUp) + ':' + two(mUp);

      return (<div className="DayScheduleInterval"><span>{start + ' - ' + end}</span></div>);
    }, this);

    return (
      <div className="DaySchedule">
        <h3 className="DayScheduleHeader"><FormattedDate value={date}/></h3>
        <div className="DayScheduleIntervals">{intervals}</div>
        {roomRows}
      </div>
    );
  },

  render: function() {
    var date = this.props.date;
    var intervals = this.props.intervals;

    var header = this.renderHeader();
    var body   = this.renderBody();

    // TODO: add add/remove room logic
    return (
      <div>
        {header}
        {body}
      </div>);
  }
});


var schedulableIntervals = [
  {hour: 9, minute: 30, length: 50},
  {hour: 10, minute: 25, length: 50},
  {hour: 12, minute: 10, length: 50},
  {hour: 13, minute: 5, length: 50},
  {hour: 14, minute: 5, length: 50},
  {hour: 15, minute: 0, length: 50},
  {hour: 16, minute: 0, length: 50},
  {hour: 17, minute: 0, length: 50}
];

var ScheduleTab = React.createClass({

  _calculateInitialStartDate: function() {
    var today = new Date();
    var todayDay = today.getDay();
    var closestMondayInPast = (today.getDate() - todayDay) + 1;
    return new Date(today.getFullYear(), today.getMonth(), closestMondayInPast);
  },

  getInitialState: function() {
    return {
      startDate: this._calculateInitialStartDate(),
      intervals: schedulableIntervals
    };
  },

  _changeStartDate: function(days) {
    var newState = _.clone(this.state);
    var sd = this.state.startDate;
    newState.startDate = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate() + days);
    this.setState(newState);
  },

  onPrevious: function() {
    this._changeStartDate(-7);
  },

  onNext: function() {
    this._changeStartDate(7);
  },

  render: function() {
    // find the current state
    var startDate = this.state.startDate;
    var daySchedules = [];

    // TODO: make this adjustable (via server)
    var totalInterval = {start: {hour: 9, minute: 30}, end: {hour: 18, minute: 0}};

    for (var date = startDate;
         date.getDay() <= 5;  // Monday to Friday 
         date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))
    {
      daySchedules.push((<DaySchedule date={date} totalInterval={totalInterval} intervals={this.state.intervals} />));
    }
    // for each day in the week from monday to friday, add a DaySchedule

    return (
      <div>
         <DateHeader onPrevious={this.onPrevious} onNext={this.onNext} startDate={startDate}/>
         {daySchedules}
      </div>
    );
  }
});

module.exports = ScheduleTab;