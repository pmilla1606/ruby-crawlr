'use strict';

var React = require('react/addons');
var MapWrapper = require('../../scripts/components/map_wrapper.js');

var ReactTransitionGroup = React.addons.TransitionGroup;

var dummy_creator = {
  name: 'Peter',
  user_name: 'pmilla',
  password: 'hunter2',
  email: 'email@email.com',

};




// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

var CrawlrApp = React.createClass({
  getInitialState: function() {
    return {
      current_waypoint: 0 // index of waypoints array
    }
  },
  componentDidMount: function() {
    console.log('did mount');
  },
  render: function() {
    return (
      <div className='main'>
        <ReactTransitionGroup transitionName="fade">


          <MapWrapper/>

        </ReactTransitionGroup>
      </div>
    );
  }
});
React.render(<CrawlrApp />, document.getElementById('content')); // jshint ignore:line

module.exports = CrawlrApp;
