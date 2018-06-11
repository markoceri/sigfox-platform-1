import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {icon, latLng, LatLng, tileLayer} from 'leaflet';
import {FireLoopRef, Geoloc, Message, Property, User} from '../../shared/sdk/models';
import {Subscription} from 'rxjs/Subscription';
import {UserApi} from '../../shared/sdk/services/custom';
import {RealTime} from '../../shared/sdk/services';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('map') mapContainer;
  @ViewChild('inputModal') inputModal;

  private filterQuery = '';

  private user: User;

  private geolocs: Geoloc[] = [];
  private geolocSub: Subscription;
  private geolocRef: FireLoopRef<Geoloc>;

  public messages: Message[] = [];
  private messageSub: Subscription;
  private messageRef: FireLoopRef<Message>;

  // Flags
  public messagesReady = false;

  // Map
  private map: L.Map;

  // Feature groups
  private marker: L.Marker;
  private circle: L.Circle;

  private building: L.LayerGroup = new L.LayerGroup();

  private circle_1: L.CircleMarkerOptions = {
    color: '#000000',
    weight: 1,
    fillColor: '#eeeeea',
    fillOpacity: 0.3
  };

  private circle_2: L.CircleMarkerOptions = {
    color: '#000000',
    weight: 1,
    fillColor: '#58dcd6',
    fillOpacity: 0.3
  };

  private circle_3: L.CircleMarkerOptions = {
    color: '#000000',
    weight: 1,
    fillColor: '#dec21c',
    fillOpacity: 0.3
  };

  private circle_4: L.CircleMarkerOptions = {
    color: '#000000',
    weight: 1,
    fillColor: '#4272ca',
    fillOpacity: 0.3
  };

  private circle_5: L.CircleMarkerOptions = {
    color: '#000000',
    weight: 1,
    fillColor: '#31af23',
    fillOpacity: 0.3
  };

  private markerIconOptions: L.IconOptions = {
    iconUrl: 'assets/img/markers/marker-icon.png',
    shadowUrl: 'assets/img/markers/marker-shadow.png',
    iconSize:     [25, 41], // size of the icon
    iconAnchor:   [13, 41], // point of the icon which will correspond to marker's location
    shadowSize:   [50, 64], // size of the shadow
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-2, -40] // point from which the popup should open relative to the iconAnchor
  };

  public mapOptions = {
    layers: [
      /*tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 21, maxNativeZoom: 18, attribution: '© OpenStreetMap contributors' }),*/
      tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 21,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      })
    ],
    zoom: 20,
    center: latLng(51.480487, -0.440390),
    fullscreenControl: true,
    trackResize: false
  };

  public layersControl = {
    baseLayers: {
      'Building': this.building,
    }
  };

  private beacon_1: any = {
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        [
          [
            1.5111565589904767,
            43.54385890270618
          ],
          [
            1.5110519528388977,
            43.543771414012156
          ],
          [
            1.5111941099166852,
            43.54368392519119
          ],
          [
            1.5112370252609235,
            43.54372280912731
          ],
          [
            1.5111726522445663,
            43.54375974884335
          ],
          [
            1.511228978633879,
            43.543814186278425
          ],
          [
            1.5111565589904767,
            43.54385890270618
          ]
        ]
      ]
    }
  };

  private beacon_2: any = {
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        [
          [
            1.5109768509864807,
            43.54365087382579
          ],
          [
            1.5108749270439148,
            43.54356727323242
          ],
          [
            1.510995626449585,
            43.543495337745306
          ],
          [
            1.5110975503921509,
            43.54358088263924
          ],
          [
            1.5109768509864807,
            43.54365087382579
          ]
        ]
      ]
    }
  };

  private beacon_3: any = {
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        [
          [
            1.511094868183136,
            43.5438938981482
          ],
          [
            1.510995626449585,
            43.54380835369845
          ],
          [
            1.5111994743347166,
            43.54368392519119
          ],
          [
            1.5113013982772827,
            43.543771414012156
          ],
          [
            1.511094868183136,
            43.5438938981482
          ]
        ]
      ]
    }
  };

  private beacon_4: any = {
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        [
          [
            1.5111753344535828,
            43.543845293362104
          ],
          [
            1.511070728302002,
            43.543755860453274
          ],
          [
            1.5112799406051636,
            43.54363143183767
          ],
          [
            1.5113818645477295,
            43.543720864931096
          ],
          [
            1.5111753344535828,
            43.543845293362104
          ]
        ]
      ]
    }
  };

  private beacon_5: any = {
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        [
          [
            1.511094868183136,
            43.5438938981482
          ],
          [
            1.510995626449585,
            43.54380835369845
          ],
          [
            1.5112799406051636,
            43.54363143183767
          ],
          [
            1.5113818645477295,
            43.543720864931096
          ],
          [
            1.511094868183136,
            43.5438938981482
          ]
        ]
      ]
    }
  };

  public deviceId: string;

  constructor(private rt: RealTime,
              private userApi: UserApi) {
    this.deviceId = '19FC14';
  }

  ngOnInit(): void {
    console.log('Demo: ngOnInit');
    // Get the logged in User object
    this.user = this.userApi.getCachedCurrent();

    this.loadMapElements();
  }

  ngAfterViewInit(): void {
    this.inputModal.show();
  }

  track() {
    this.cleanMapLayers();
    this.setup();
    this.inputModal.hide();
  }

  cleanMapLayers() {
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.map.removeLayer(this.circle);
    }

    /*this.map.removeLayer(this.beacon_1);
    this.map.removeLayer(this.beacon_2);
    this.map.removeLayer(this.beacon_3);*/
  }

  setup(): void {
    if (this.geolocRef) this.geolocRef.dispose();
    if (this.geolocSub) this.geolocSub.unsubscribe();

    if (this.messageRef) this.messageRef.dispose();
    if (this.messageSub) this.messageSub.unsubscribe();

    // Get and listen geolocs
    this.geolocRef = this.rt.FireLoop.ref<Geoloc>(Geoloc);
    this.geolocSub = this.geolocRef.on('change',
      {
        limit: 1,
        order: 'createdAt DESC',
        where: {
          and: [
            {type: 'beacon'},
            {deviceId: this.deviceId}
          ]
        },
        include: ['Message']
      }
    ).subscribe((geolocs: Geoloc[]) => {
      console.log(geolocs);
      if (geolocs.length > 0) {
        this.geolocs = geolocs;

        this.cleanMapLayers();

        this.map.flyTo(new LatLng(this.geolocs[0].location.lat, this.geolocs[0].location.lng));
        this.map.setZoom(20);

        const radius = this.geolocs[0].precision;

        this.geolocs[0].Message.data_parsed.forEach((p: Property) => {
          if (p.key === 'beaconId') {
            if (p.value === '0000a') {
              //this.building.addTo(this.map);
              //this.beacon_2.addTo(this.map);
              this.markerIconOptions.iconUrl = 'assets/img/markers/marker-icon-grey.png';
              this.marker = L.marker(new LatLng(this.geolocs[0].location.lat, this.geolocs[0].location.lng), {icon: icon(this.markerIconOptions)}).addTo(this.map);
              this.circle = L.circle(new LatLng(this.geolocs[0].location.lat, this.geolocs[0].location.lng), radius, this.circle_1).addTo(this.map);
              this.marker.bindPopup('You are at level 5 - ' + this.deviceId).openPopup();
            } else if (p.value === '0000b') {
              //this.building.addTo(this.map);
              //this.beacon_1.addTo(this.map);
              this.markerIconOptions.iconUrl = 'assets/img/markers/marker-icon-blue.png';
              this.marker = L.marker(new LatLng(this.geolocs[0].location.lat, this.geolocs[0].location.lng), {icon: icon(this.markerIconOptions)}).addTo(this.map);
              this.circle = L.circle(new LatLng(this.geolocs[0].location.lat, this.geolocs[0].location.lng), radius, this.circle_2).addTo(this.map);
              this.marker.bindPopup('You are at level 3 - ' + this.deviceId).openPopup();
            } else if (p.value === '0000c') {
              //this.building.addTo(this.map);
              //this.beacon_3.addTo(this.map);
              this.markerIconOptions.iconUrl = 'assets/img/markers/marker-icon-yellow.png';
              this.marker = L.marker(new LatLng(this.geolocs[0].location.lat, this.geolocs[0].location.lng), {icon: icon(this.markerIconOptions)}).addTo(this.map);
              this.circle = L.circle(new LatLng(this.geolocs[0].location.lat, this.geolocs[0].location.lng), radius, this.circle_3).addTo(this.map);
              this.marker.bindPopup('You are at level 1 (ground) - ' + this.deviceId).openPopup();
            }/* else if (p.value === '00004') {
              //this.building.addTo(this.map);
              //this.room_3_1.addTo(this.map);
              this.markerIconOptions.iconUrl = 'assets/img/markers/marker-icon-blue.png';
              this.marker = L.marker(new LatLng(this.geolocs[0].location.lat, this.geolocs[0].location.lng), {icon: icon(this.markerIconOptions)}).addTo(this.map);
              this.circle = L.circle(new LatLng(this.geolocs[0].location.lat, this.geolocs[0].location.lng), radius, this.circle_3).addTo(this.map);
              this.marker.bindPopup('Beacon 3 - ' + this.deviceId).openPopup();
            } else if (p.value === '00005') {
              //this.building.addTo(this.map);
              //this.room_4_1.addTo(this.map);
              this.markerIconOptions.iconUrl = 'assets/img/markers/marker-icon-green.png';
              this.marker = L.marker(new LatLng(this.geolocs[0].location.lat, this.geolocs[0].location.lng), {icon: icon(this.markerIconOptions)}).addTo(this.map);
              this.circle = L.circle(new LatLng(this.geolocs[0].location.lat, this.geolocs[0].location.lng), radius, this.circle_4).addTo(this.map);
              this.marker.bindPopup('Beacon 4 - ' + this.deviceId).openPopup();
            }*/
          }
        });
      }
    });

    // Get and listen messages
    this.messageRef = this.rt.FireLoop.ref<Message>(Message);
    this.messageSub = this.messageRef.on('change',
      {
        limit: 10,
        order: 'createdAt DESC',
        where: {
          deviceId: this.deviceId
        },
        include: ['Geolocs']
      }
    ).subscribe((messages: Message[]) => {
      if (messages.length > 0) {
        this.messages = messages;
        this.messagesReady = true;
      }
    });
  }

  loadMapElements() {

    const imageUrl = '../assets/img/buildings/office.png';
    const imageBounds: L.LatLngBoundsExpression = [[51.480659, -0.440732], [51.480297, -0.440000]];
    //const imageBounds: L.LatLngBoundsExpression = [[51.480656, -0.440703], [51.480551, -0.440069], [51.480300, -0.439986], [51.480309, -0.440737]];
    L.imageOverlay(imageUrl, imageBounds).setOpacity(1).addTo(this.building);

    this.beacon_1 = L.geoJSON(this.beacon_1).setStyle({
      'color': '#000000',
      'weight': 2,
      'fillColor': '#e7e35a',
      'fillOpacity': 0.5
    }).bindPopup('Beacon 1');

    this.beacon_2 = L.geoJSON(this.beacon_2).setStyle({
      'color': '#000000',
      'weight': 2,
      'fillColor': '#58dcd6',
      'fillOpacity': 0.5
    }).bindPopup('Beacon 1 - Showroom');

    this.beacon_3 = L.geoJSON(this.beacon_3).setStyle({
      'color': '#000000',
      'weight': 2,
      'fillColor': '#9f29a9',
      'fillOpacity': 0.5
    }).bindPopup('Beacon 2');

    this.beacon_4 = L.geoJSON(this.beacon_4).setStyle({
      'color': '#000000',
      'weight': 2,
      'fillColor': '#4272ca',
      'fillOpacity': 0.5
    }).bindPopup('Beacon 3');

    this.beacon_5 = L.geoJSON(this.beacon_5).setStyle({
      'color': '#000000',
      'weight': 2,
      'fillColor': '#31af23',
      'fillOpacity': 0.5
    }).bindPopup('Beacon 4');
  }

  /**
   * Initialize map and drawing
   */
  onMapReady(map: L.Map): void {
    this.map = map;
    //this.map.locate({setView: true, maxZoom: 16});
    this.map.on('locationfound', (e) => this.onLocationFound(e));
    this.map.on('locationerror', (e) => this.onLocationError(e));

    // Real Time
    if (
      this.rt.connection.isConnected() &&
      this.rt.connection.authenticated
    ) {
      this.rt.onReady().subscribe(() => this.setup());
    } else {
      this.rt.onAuthenticated().subscribe(() => this.setup());
      this.rt.onReady().subscribe();
    }

    // Set office building plans
    this.building.addTo(this.map);

    console.log('Map ready!');
  }

  onLocationFound(e): void {
    const radius = e.accuracy / 2;
    const marker = L.marker(e.latlng, {icon: icon(this.markerIconOptions)}).addTo(this.map);
    L.circle(e.latlng, radius, this.markerIconOptions).addTo(this.map);
    marker.bindPopup('You are within <b>' + radius + '</b> meters from this point').openPopup();
  }

  onLocationError(e): void {
    console.log(e.message);
  }

  ngOnDestroy(): void {
    console.log('Demo: ngOnDestroy');
    if (this.geolocRef) this.geolocRef.dispose();
    if (this.geolocSub) this.geolocSub.unsubscribe();

    if (this.messageRef) this.messageRef.dispose();
    if (this.messageSub) this.messageSub.unsubscribe();
  }

}
