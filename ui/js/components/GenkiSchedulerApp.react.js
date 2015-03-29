var React          = require('react');

var Router = require('react-router'); // or var Router = ReactRouter; in browsers

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var TeacherTab = require('./TeacherTab.react');

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

  render: function() {
     return (
      <div>
        <header>
          <ul>
            <li><Link to="schedule">Schedule</Link></li>
            <li><Link to="classes">Classes</Link></li>
            <li><Link to="teachers">Teachers</Link></li>
            <li><Link to="students">Students</Link></li>
          </ul>
        </header>

        {/* this is the important part */}
        <RouteHandler/>
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
    <Route name="schedule" handler={EmptyTab}/>
    <Route name="classes" handler={EmptyTab}/>
    <Route name="teachers" handler={TeacherTab}/>
    <Route name="students" handler={EmptyTab}/>
    <DefaultRoute handler={TeacherTab}/>
  </Route>
);

module.exports = {
  render: function() {
    Router.run(routes, function (Handler) {
      React.render(<Handler/>, document.body);
    });
  }
};