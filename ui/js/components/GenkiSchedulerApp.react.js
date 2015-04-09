Object.assign = require('object-assign');

var React          = require('react');

var Router = require('react-router'); // or var Router = ReactRouter; in browsers

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var TeacherTab = require('./TeacherTab.react');
var StudentTab = require('./StudentTab.react');
var ClassTab = require('./ClassTab.react');
var ScheduleTab = require('./ScheduleTab.react');

var AppActions = require('../actions/AppActions');

var GenkiSchedulerApp = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    // TODO: fill this in
  },

  componentWillUnmount: function() {
    // TODO: fill this in
  },

  _onClick: function() {
    AppActions.click();
  },

  render: function() {
     return (
      <div onClick={this._onClick}className="GenkiScheduler">
        <header>
          <ul>
            <li><Link to="schedule">Schedule</Link></li>
            <li><Link to="classes">Classes</Link></li>
            <li><Link to="teachers">Teachers</Link></li>
            <li><Link to="students">Students</Link></li>
          </ul>
        </header>

        {/* this is the important part */}
        <div className="main">
        <RouteHandler/>
        </div>
      </div>
    );
  }
});

var EmptyTab = React.createClass({
  render: function() {
    return (<div>Empty</div>);
  }
});

var routes = (
  <Route name="app" path="/" handler={GenkiSchedulerApp}>
    <Route name="schedule" handler={ScheduleTab}/>
    <Route name="classes" handler={ClassTab}/>
    <Route name="teachers" handler={TeacherTab}/>
    <Route name="students" handler={StudentTab}/>
    <DefaultRoute handler={ScheduleTab}/>
  </Route>
);

module.exports = {
  render: function() {
    Router.run(routes, function (Handler) {
      React.render(<Handler/>, document.body);
    });
  }
};