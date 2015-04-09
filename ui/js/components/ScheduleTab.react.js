"use strict";

var React          = require("react");
var _ = require("underscore");

var DateHeader = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <div>
         <h2>Date header</h2>
         <button>previous</button>
         <button>next</button>
      </div>
    );
  }
});

var ClassPeriodCell = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    // Render a class period cell
    return null;
  }
});

var RoomCell = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    // Render a room cell
    return null;
  }
});

var RoomRow = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    // Render a room row
    return null;
  }
});

// TODO: need the class periods sorted by day, then by room, e.g:
// day -> room -> [class periods, sorted by date]
var DaySchedule = React.createClass({

  getInitialState: function() {
    return {};
  },

  renderHeader: function() {
    var intervals = this.props.intervals;
    return null; // TODO: implement me!
  },

  renderBody: function() {
    var data = this.props.data;
    // loop through each room and create a row for it
    // Add out rooms as needed

    return null;
  },

  render: function() {
    var date = this.props.date;
    var intervals = this.props.intervals;

    var header = renderHeader();
    var body =   renderBody();
    return (<div>
      <div>Day</div>
      <button>Add room</button>
      {header}
      {body}
    </div>);
  }
});

var ScheduleTab = React.createClass({

  getInitialState: function() {
    return {};
  },

  render: function() {
    // find the current state

    // for each day in the week from monday to friday, add a DaySchedule

    return (
      <div>
         <DateHeader />
         <button>Copy last week</button>
         <button>Print schedules</button>
      </div>
    );
  }
});

module.exports = ScheduleTab;