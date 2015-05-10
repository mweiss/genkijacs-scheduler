Object.assign = require('object-assign');

var React          = require('react');

var Router = require('react-router'); // or var Router = ReactRouter; in browsers

var _ = require("underscore");

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var TeacherTab = require('./TeacherTab.react');
var StudentTab = require('./StudentTab.react');
var ClassTab = require('./ClassTab.react');
var ScheduleTab = require('./ScheduleTab.react');

var AppActions = require('../actions/AppActions');

var ClassPeriodStore = require('../stores/ClassPeriodStore');
var ClassRegistrationStore = require('../stores/ClassRegistrationStore');
var ClassStore = require('../stores/ClassStore');
var RoomStore = require('../stores/RoomStore');
var StudentStore = require('../stores/StudentStore');
var TeacherStore = require('../stores/TeacherStore');

var stores = [ClassPeriodStore, ClassRegistrationStore, ClassStore, RoomStore, StudentStore, TeacherStore];

var GenkiSchedulerApp = React.createClass({
  getInitialState: function() {
    return {
      error: false,
      loaded: false
    };
  },

  _onChange: function() {
    var error = false;
    var loaded = true;

    _.each(stores, function(store) {
      error = error || store.isLoadError();
      loaded = loaded && store.isLoaded();
    });

    this.setState({
      error: error,
      loaded: loaded
    });
  },

  componentDidMount: function() {
    _.each(stores, function(store) {
      store.addChangeListener(this._onChange);
    }, this);
    AppActions.load();
  },

  componentWillUnmount: function() {
    _.each(stores, function(store) {
      store.removeChangeListener(this._onChange);
    }, this);
  },

  render: function() {
     if (this.state.loaded) {
      return (
        <div onClick={this._onClick}className="GenkiScheduler">
          <header>
            <div className="TabHeaderBar">
              <ul>
                <li><Link to="schedule">Schedule</Link></li>
                <li><Link to="classes">Classes</Link></li>
                <li><Link to="teachers">Teachers</Link></li>
                <li><Link to="students">Students</Link></li>
              </ul>
            </div>
          </header>

          {/* this is the important part */}
          <div className="main">
          <RouteHandler/>
          </div>
        </div>
      );
     }
     else if (this.state.error) {
       // TODO: replace with a friendly error message
       return (<div>Error</div>);
     }
     else {
       // TODO: replace with a friendly loading message
       return (<div>Loading...</div>);
     }

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