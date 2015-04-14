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

    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: new google.maps.LatLng(-33.8668283734, 151.2064891821),
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

  clearAllMarkers: function() {
    setAllMap(null)
  },

  performSearch: function() {
    var request = {
      bounds: map.getBounds(),
      keyword: 'bar'
    };
    console.log(map);

    service.radarSearch(request, this.callback);
  },

  callback: function(results, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      alert(status);
      return;
    }
    for (var i = 0, result; result = results[i]; i++) {
      this.createMarker(result);
    }
  },

  getInitialState: function() {
    return {
      globalMarkersArray: [],
      route: []
    }
  },

  setAllMap: function(map) {
    console.log(this.state.globalMarkersArray)
    for (var i = 0; i < this.state.globalMarkersArray.length; i++) {
      this.state.globalMarkersArray[i].setMap(map)
    }
  },

  clearMarkers: function() {
    this.setAllMap(null);
  },

  deleteMarkers() {
    this.clearMarkers();
    this.setState({
      globalMarkersArray: [],
      // route: []
    });
  },

  deleteMarkerAtIndex(index) {
    var tempMarkersArray = this.state.globalMarkersArray;
    var tempRouteArray = this.state.route;
    // splice at index (passed up from specific nav button)
    tempMarkersArray.splice(index, 1);
    tempRouteArray.splice(index, 1);
    this.setState({
      globalMarkersArray: tempMarkersArray,
      route: tempRouteArray
    });
  },

  createMarker: function(place) {
    var that = this;

    var tempMarkersArray = this.state.globalMarkersArray;

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

    tempMarkersArray.push(marker);

    this.setState({
      globalMarkersArray: tempMarkersArray
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
  },

  addPlaceToRoute: function(place) {
    var that = this;

    var tempRouteArray = this.state.route;
    var tempMarkersArray = [];

    tempRouteArray.push(place);

    this.setState({
      route: tempRouteArray,
      globalMarkersArray: tempMarkersArray
    }, function(){

      that.calculateDirections();

    });
  },

  calculateDirections: function() {
    var request;
    var wayPointArray = []
    var wayPointsMinusStartAndFinish = this.state.route;
    if (this.state.route.length > 2) {
      // we now have a waypoint between origin and destination

      // var origin = wayPointsMinusStartAndFinish.shift();
      // var destination = wayPointsMinusStartAndFinish.pop();

      wayPointsMinusStartAndFinish.map(function(wayPointString){
        wayPointArray.push({
          location: wayPointString.geometry.location.toString()
        });
      });



      request = {
        origin: origin.geometry.location.toString(),
        destination: destination.geometry.location.toString(),
        waypoints: wayPointArray,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING
      }

    } else {
      var origin = wayPointsMinusStartAndFinish[0];
      var destination = wayPointsMinusStartAndFinish[1];

      request = {
        origin: origin.geometry.location.toString(),
        destination: destination.geometry.location.toString(),
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING
      }
    }

    GoogleDirections.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        // var route = response.routes[0];
        // var summaryPanel = document.getElementById('directions_panel');
        // summaryPanel.innerHTML = '';
        // // For each route, display summary information.
        // for (var i = 0; i < route.legs.length; i++) {
        //   var routeSegment = i + 1;
        //   summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
        //   summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
        //   summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
        //   summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        // }
      }
    });
  },

  render: function() {

    return(
      <div>
        <NavWrapper
          route={this.state.route}
          markers={this.state.globalMarkersArray}
          deleteAllMarkers={this.deleteMarkers}
          deleteMarkerAtIndex={this.deleteMarkerAtIndex} />

        <div id="map-canvas"></div>

      </div>
    );
  },

});

module.exports = MapWrapper;