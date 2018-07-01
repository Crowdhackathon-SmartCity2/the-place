import { inject } from 'aurelia-framework';
import { State } from '../state';

@inject(State)
export class Collect {
  constructor(state) {
    this.state = state;
    console.log(this.state.ID)
    this.bins = [];
    this.fullThresshold = 60;
    this.interests = [
      {type: 'glass', value: true},
      {type: 'paper', value: true},
      {type: 'metal', value: true},
      {type: 'plastic', value: true}
    ];

    this.map = null;
    this.azureMapUrl = 'https://atlas.microsoft.com/route/directions/json?api-version=1.0';
    this.azureMapOptions = {
      key: 'T1ALU0Q4MVtrUxKb3uxfTS1_H_OVEOV0b-GntYM_2yU',
      routeLayerName: 'routes',
      binLayerName: 'bins',
      truckLayerName: 'trucks',
      query: ''
    };

    this.azureAPIUrl = 'https://crowdhackathon-app.azurewebsites.net';
    this.azureAPIOptions = {
      key: 'jpo15HP54bn6qsd4c1vxypIHjdgWl6giUiWYSl5rXKK5mK0lhdhlMQ==',
      owner: this.state.profile.municipality
    };

    console.log("COLLECT");
    console.dir(this.state);
  }

  attached() {
    this.getBins()
        .then(() => this.getMap())
        .then(() => { 
          this.checkFull();
          this.updatePins();
        });
  }

  getCameraBounds(bins) {
    let result = {
      p1: {},
      p2: {}
    };
    bins.sort((a, b) => a.lon - b.lon);
    result.p1.lon = bins[0].lon;
    result.p2.lon = bins[bins.length - 1].lon;
    bins.sort((a, b) => a.lat - b.lat);
    result.p1.lat = bins[0].lat;
    result.p2.lat = bins[bins.length - 1].lat;
    return result;
  }

  getBins() {
    return new Promise((resolve, reject) => {
      const url = `${this.azureAPIUrl}/api/devices/owner/${this.azureAPIOptions.owner}?code=${this.azureAPIOptions.key}`;
      fetch(url)
        .then(result => result.json())
        .then(data => {
          console.log(data);
          this.bins = data;
          for (let bin of this.bins) {
            bin.full = false;
          }
          resolve(true);
        });
    });
  }

  checkFull() {
    for (let i = 0; i < this.bins.length; i++) {
      this.bins[i].full = false;
      for (let interest of this.interests) {
        if (interest.value && this.bins[i][interest.type] > this.fullThresshold) {
          this.bins[i].full = true;
          break;
        }
      }
    }
  }

  interestChanged() {
    this.removeRouteFromMap();
    this.checkFull();
    this.updatePins();
  }

  updatePins() {
    this.map.removeLayers([this.azureMapOptions.binLayerName]);

    let pins = [];
    for (var i = 0; i < this.bins.length; i++) {
      pins.push(new atlas.data.Feature(new atlas.data.Point([this.bins[i].lon, this.bins[i].lat]), {
          icon: (this.bins[i].full) ? 'pin-round-red' : 'pin-round-blue'
      }));
    }

    this.map.addPins(pins, {
        name: this.azureMapOptions.binLayerName,
        cluster: false //Disable pin clustering as we want the waypoint icons to stay fixed to their location.
    });
  }

  getMap() {
    return new Promise((resolve, reject) => {
      this.map = new atlas.Map('map', {
        'subscription-key': this.azureMapOptions.key
      });

      let bounds = this.getCameraBounds(this.bins);
      this.map.setCameraBounds({
        bounds: [bounds.p1.lon, bounds.p1.lat, bounds.p2.lon, bounds.p2.lat],
        padding: 20
      });

      resolve(true);
    });
  }

  collectBins(fullonly = true) {
    let query = [];
    for (let bin of this.bins) {
      // Careful! Lon-Lat is reversed in Directions API (Why Microsoft??)
      if (fullonly) {
        if (bin.full) {
          query.push(bin.lat + ',' + bin.lon);
        }
      }
      else {
        query.push(bin.lat + ',' + bin.lon);
      }
    }
    query = query.join(':');
    this.calculateRoute(query);
  }

  calculateRoute(query) {
    return new Promise((resolve, reject) => {
      this.removeRouteFromMap();

      //Create request to calculate a route in the order in which the waypoints are provided.
      let azureMapRequestUrl = `https://atlas.microsoft.com/route/directions/json?api-version=1.0&subscription-key=${this.azureMapOptions.key}&query=${query}&routeRepresentation=polyline&travelMode=car&computeBestOrder=true`;

      fetch(azureMapRequestUrl)
        .then(response => response.json())
        .then(data => {
          console.dir(data);
          this.addRouteToMap(data.routes[0]);
          resolve(true);
        });
    }); 
  }

  addRouteToMap(route) {
    let routeCoordinates = [];

    for (let legIndex = 0; legIndex < route.legs.length; legIndex++) {
      let leg = route.legs[legIndex];

      //Convert the route point data into a format that the map control understands.
      let legCoordinates = leg.points.map(point => [point.longitude, point.latitude]);

      //Combine the route point data for each route leg together to form a single path.
      routeCoordinates = routeCoordinates.concat(legCoordinates);
    }

    //Create a LineString from the route path points and add it to the route line layer.
    let routeLinestring = new atlas.data.LineString(routeCoordinates);
    this.map.addLinestrings([new atlas.data.Feature(routeLinestring)], {
        name: this.azureMapOptions.routeLayerName
    });
  }

  removeRouteFromMap() {
    this.map.removeLayers([this.azureMapOptions.routeLayerName]);
    this.map.addLinestrings([], {
      name: this.azureMapOptions.routeLayerName,
      color: 'blue',
      width: 3,
      cap: 'round',
      join: 'round',       //Smooth the joints in the line.
      before: 'labels'     //Have the line render underneath the map labels.
    });
  }
}
