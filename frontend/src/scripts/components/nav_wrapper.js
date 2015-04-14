'use strict';

var React = require('react/addons');

var NavWrapper = React.createClass({
  persist: function() {
    if (this.props.route.length) {
      console.log('here we ajax up to whatever server');
      console.log('probably something like crawlr.io/creat/NAME+RANDOM');
      console.log('this is the payload:');
      console.log(this.props.route);
    } else {
      console.warn('nothing to persist!')
    }
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
        <p>Nav</p>
        <p>Route Length: {this.props.routeLengthMeters} m ({this.props.routeLengthMeters * 3.28} ft)</p>
        <p onClick={this.props.deleteAllMarkers.bind(null, null)}>Delete all</p>
        <p onClick={this.persist}>Save this Crawl</p>
        
        {routePlaces}
      </div>
    );
  }
});

module.exports = NavWrapper;
