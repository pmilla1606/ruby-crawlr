'use strict';

var React = require('react/addons');
var $ = require('jquery');

var NavWrapper = React.createClass({
  persist: function() {
    var that = this;

    if (this.props.route.length) {
      
      var waypointsArray = '';

      that.props.route.map(function(waypoint, index){

        waypointsArray += waypoint.geometry.location.toString();

        if ( Number(index+1) === that.props.route.length ) {
          $.ajax({
            method: 'POST',
            url: '/routes',
            data: {
              waypoints: waypointsArray,
              creator: 'ADMIN__TESTING',
              updated_at: null,
              name: that.refs.routeName.getDOMNode().value || 'Unnamed'
            }
          }).done(function( msg ) {

            alert('Saved route ' + msg.name + ' with ID: ' + msg.id)
            console.log('Done on Create New Route ajax ',msg)
          });
        }

      });

    
      // console.log('here we ajax up to whatever server');
      // console.log('probably something like crawlr.io/creat/NAME+RANDOM');
      // console.log('this is the payload:');
    } else {
      alert('Please create a route first!')
      console.warn('nothing to persist!')
    }
  },

  fetchOne: function() {
    var that = this;
    var requestedRoute = this.refs.routeId.getDOMNode().value;
    if (requestedRoute) {
      $.ajax({
        method: 'GET',
        url: '/routes/'+requestedRoute,
        success: function(data) {
          that.props.populateMapFromDb(data);
        }
      });
    }
  },
  fetchAll: function() {
    $.ajax({
      method: 'GET',
      url: '/routes',
      success: function(data) {
        console.log('retrieved all', data)
      }
    });
  },
  render: function() {
    var that = this;
    var routePlaces;

    if (this.props.route) {

      routePlaces = this.props.route.map(function(place, index){
        return(
          <div className="route-waypoint" onMouseEnter={that.props.hoverOnMarker.bind(null, index)} key={index}>
            <span className="waypoint-position">{index + 1}</span>
            <span className="heading waypoint-name">{place.name}</span>

            <div className="waypoint-options animated-transition">
              <a onClick={that.props.deleteMarkerAtIndex.bind(null, index)} href="#">Delete Waypoint</a>
            </div>
          </div>
        );
      });

    }

    return (
      <div className="nav-wrapper">
        <p>Crawlr.io</p>
        <p>Route Length: {this.props.routeLengthMeters} m ({this.props.routeLengthMeters * 3.28} ft)</p>
        
        <h2>Create Route</h2>
        <input type="text" placeholder="Route Name" ref="routeName" />
        <p onClick={this.props.deleteAllMarkers.bind(null, null)}>Delete all</p>
        <p onClick={this.persist}>Save this Crawl</p>
        <hr />
        <h2>Fetch Route</h2>
        <input type="text" placeholder="Route ID" ref="routeId" />
        <p onClick={this.fetchOne}>Fetch One</p>
        <hr />
        <p onClick={this.fetchAll}>Fetch All</p>
        
        {routePlaces}
      </div>
    );
  }
});

module.exports = NavWrapper;
