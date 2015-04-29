'use strict';

var React = require('react/addons');
var NavWrapper = require('../../scripts/components/nav_wrapper.js');
var google = window.google;
var GoogleMapsAPI = window.google.maps;
var GoogleDirections = new GoogleMapsAPI.DirectionsService();

var $ = require('jquery');

var map;
var infoWindow;
var service;
var directionsDisplay;

var MapWrapper = React.createClass({

  componentDidMount: function() {
    this.initialize();
  },
  initialize: function() {
    var that = this;

    directionsDisplay = new google.maps.DirectionsRenderer();

    if ("geolocation" in navigator) {
      /* geolocation is available */
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position)
        that.initNewMap(position.coords.latitude, position.coords.longitude)
      });
    } else {
      /* geolocation IS NOT available */
      that.initNewMap(-33.8668283734, 151.2064891821);
    }

  },
  initNewMap: function (lat, lng){
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: new google.maps.LatLng(lat, lng),
      zoom: 15
    });

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    google.maps.event.addListener(map, 'click', function(event) {
      that.performSearch()
    });

    google.maps.event.addListenerOnce(map, 'bounds_changed', this.performSearch);
    directionsDisplay.setMap(map);
  },
  getInitialState: function() {
    return {
      route: [],
      markers: [],
      routeLength: 0
    }
  },

  // perform radar search
  performSearch: function() {
    var request = {
      bounds: map.getBounds(),
      keyword: 'bar'
    };
    service.radarSearch(request, this.searchCallback);
  },

  searchCallback: function(results, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      alert(status);
      return;
    }
    for (var i = 0, result; result = results[i]; i++) {
      this.createMarker(result);
    }
  },

  // create markers (results from radar search)
  createMarker: function(place) {
    var that = this;
    var tempMarkersArray = this.state.markers;

    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: {
        path: 'M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z',
        fillColor: '#ffff00',
        fillOpacity: 1,
        scale: 1,
        strokeColor: '#bd8d2c',
        strokeWeight: 1
      }
    });

    google.maps.event.addListener(marker, 'click', function() {
      service.getDetails(place, function(result, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          alert(status);
          return;
        }

        var content=document.createElement('div');
        var button;

        content.innerHTML='<h1>'+ result.name +'</h1>';
        button=content.appendChild(document.createElement('input'));
        button.type='button';
        button.value='Add ' + result.name + ' to this crawl'

        google.maps.event.addDomListener(button,'click', function(){
          that.addPlaceToRoute(result);
        });

        infoWindow.setContent(content);

        infoWindow.open(map, marker);
      });
    });

    tempMarkersArray.push(marker);

    this.setState({
      markers: tempMarkersArray
    });
  },

  addPlaceToRoute: function(place) {
    var that = this;

    var tempMarkersArray = []; // empty after adding because we want to clear
    var tempRouteArray = this.state.route || [];

    tempRouteArray.push(place);

    this.replaceState({
      route: tempRouteArray,
      markers: tempMarkersArray
    }, function() {
      that.calculateDirections();
    });
  },

  calculateDirections: function(fromDb) {
    // if route.length === 1 => ignore
    // if route.length === 2 => directions without waypoints
    // if route.length > 2 => directions as usual

    var that = this;
    var waypointsArray = this.state.route;
    var waypointsArrayMiddleOnly = [];
    var origin = waypointsArray[0];
    var destination = waypointsArray[waypointsArray.length - 1];

    var request = {
      origin: origin.geometry.location.toString(),
      destination: destination.geometry.location.toString(),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
    };

    if (waypointsArray.length > 2) {

      waypointsArray.map(function(waypointObj){
        waypointsArrayMiddleOnly.push({
          location: waypointObj.geometry.location.toString()
        });
      });

      waypointsArrayMiddleOnly.pop();
      waypointsArrayMiddleOnly.shift();

      request.waypoints = waypointsArrayMiddleOnly;

    }
    else if (waypointsArray.length === 2) {

    }
    else if (waypointsArray.length === 1) {
      return false
    } else {
      return false;
    }

    GoogleDirections.route(request, function(response, status) {
      var tempRouteLength = 0;

      if (status == google.maps.DirectionsStatus.OK) {

        directionsDisplay.setDirections(response);
        
        response.routes[0].legs.map(function(distance) {
          tempRouteLength += distance.distance.value
        });
        
        that.setState({
          routeLength: tempRouteLength 
        });
      }
    });

  },

  populateMapFromDb: function(data) {
    var waypointsFromDb = data.waypoints.split(')(');

    this.replaceState({
      route: waypointsFromDb
    });
  },

  hoverOnMarker: function(marker) {
    var newCenter = new google.maps.LatLng(this.state.route[marker].geometry.location.lat(), this.state.route[marker].geometry.location.lng());
    console.log(newCenter)
    map.setCenter(newCenter);
  },

  // marker helpers
  clearAllMarkers: function() {
    this.setAllMap(null);
  },
  deleteMarkers() {
    this.clearAllMarkers();
    this.replaceState({
      markers: [],
      // route: []
    });
    directionsDisplay.setDirections({routes: []});
  },
  setAllMap: function(map) {
    this.state.markers.map(function(map) {
      map.setMap(map);
    });
  },
  deleteMarkerAtIndex(index) {
    var tempMarkersArray = this.state.markers;
    var tempRouteArray = this.state.route;
    var placesTempArray = [];

    tempMarkersArray.splice(index, 1);
    tempRouteArray.splice(index, 1);

    this.replaceState({
      markers: tempMarkersArray,
      route: tempRouteArray
    });
  },


  render: function() {
    return(
      <div>
        <NavWrapper
          populateMapFromDb={this.populateMapFromDb}
          route={this.state.route}
          markers={this.state.globalMarkersArray}
          deleteAllMarkers={this.deleteMarkers}
          deleteMarkerAtIndex={this.deleteMarkerAtIndex}
          routeLengthMeters={this.state.routeLength}
          hoverOnMarker={this.hoverOnMarker}
           />

        <div id="map-canvas">
          <div className="spinner__wrapper">
            <div className="spinner__inner">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
          </div>
        </div>

      </div>
    );
  },
});

module.exports = MapWrapper;