import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import constants from '../../constants';
import { ActivatedRoute } from '@angular/router';
import * as googlePolyline from '@mapbox/polyline';
import { ApiServices } from '../services/api-services';
import { FirebaseService } from '../services/firebase.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrl: './view-booking.component.scss',
})
export class ViewBookingComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private api: ApiServices,
    private fb: FirebaseService,
    public datePipe: DatePipe
  ) {}
  details: any = {};
  loadingPage: boolean = true;
  mapbox: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  pickupMarker: mapboxgl.Marker;
  dropoffMarker: mapboxgl.Marker;
  driverMarker: mapboxgl.Marker;
  bookingId: number;
  bookingCode: string;
  isFirst = true;
  isFirstListener = true;
  preparingPolylineFetched = false;
  enroutePolylineFetched = false;
  lastStatus = '';
  syncBookingInterval = 0;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const code = params['code'] as string;
      this.bookingId = parseInt(code.split('-')[0]);
      this.bookingCode = code.split('-')[1];
    });
    this.mapbox = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 14,
      center: [118.7472807144652, 9.763661108530336],
      accessToken: constants.mapboxToken,
    });

    this.fb.getAuth().onAuthStateChanged((user: any) => {
      if (user) {
        this.fb
          .getFirestore()
          .collection('orders')
          .doc(this.bookingCode)
          .onSnapshot((snap: { exists: any }) => {
            if (snap.exists) {
              this.syncBooking();
            }
          });
      } else {
        this.fb.getAuth().signInAnonymously();
      }
    });
  }
  convertToNumber(number: string) {
    // console.log(
    //   this.details?.taxi_order?.trip_details?.pickup_dropoff_subtotal ?? 0,
    //   number
    // );
    if (number == '') {
      return 0;
    }
    return Number(number);
  }

  syncBooking(isInterval = false) {
    this.api
      .getBooking(this.bookingId + '-' + this.bookingCode)
      .then((data: any) => {
        this.details = data.data.booking;
        this.loadingPage = false;
        console.log(data);
        if (
          this.details.status != 'delivered' &&
          this.details.status != 'cancelled'
        ) {
          window.clearInterval(this.syncBookingInterval);
          console.log('syncing', this.details.status);
          this.syncBookingInterval = window.setInterval(() => {
            this.syncBooking(true);
          }, 10 * 1000);
        } else {
          window.clearInterval(this.syncBookingInterval);
        }
        // this.viewTemporaryReceipt()
        const pickupPopup = new mapboxgl.Popup().setText('Pickup');
        const dropoffPopup = new mapboxgl.Popup().setText('Destination');
        const driverPopup = new mapboxgl.Popup().setText('Driver');

        if (this.isFirst || this.lastStatus != this.details?.status) {
          this.mapbox.fitBounds(
            [
              [
                parseFloat(this.details.taxi_order.pickup_longitude),
                parseFloat(this.details.taxi_order.pickup_latitude),
              ],
              [
                parseFloat(this.details.taxi_order.dropoff_longitude),
                parseFloat(this.details.taxi_order.dropoff_latitude),
              ],
            ],
            {
              padding: 50,
            }
          );
          this.isFirst = false;
        }
        this.lastStatus = this.details?.status;
        console.log('this is enroute', this.enroutePolylineFetched);
        switch (this.details.status) {
          case 'ready':
            if (!this.enroutePolylineFetched) {
              this.api
                .getPolyline(
                  this.details.taxi_order.pickup_latitude +
                    ',' +
                    this.details.taxi_order.pickup_longitude,
                  this.details.taxi_order.dropoff_latitude +
                    ',' +
                    this.details.taxi_order.dropoff_longitude
                )
                .then((res: any) => {
                  this.enroutePolylineFetched = true;
                  const line = res.data;
                  console.log(line);

                  const decodedCoordinates = googlePolyline
                    .decode(line)
                    .map((coord) => [coord[1], coord[0]]);

                  console.log(decodedCoordinates);

                  const geojson: any = {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: decodedCoordinates,
                    },
                  };

                  if (
                    !this.mapbox.getSource('polyline_' + this.details?.status)
                  ) {
                    this.mapbox.addSource('polyline_' + this.details?.status, {
                      type: 'geojson',
                      data: geojson,
                    });

                    this.mapbox.addLayer({
                      id: 'polyline_' + this.details?.status,
                      type: 'line',
                      source: 'polyline_' + this.details?.status,
                      layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                      },
                      paint: {
                        'line-color': '#4c6c33', // Customize the line color
                        'line-width': 4, // Customize the line width
                      },
                    });

                    const coordinates = geojson.geometry.coordinates.concat([
                      [
                        parseFloat(this.details.taxi_order.pickup_longitude),
                        parseFloat(this.details.taxi_order.pickup_latitude),
                      ],
                      [
                        parseFloat(this.details.taxi_order.dropoff_longitude),
                        parseFloat(this.details.taxi_order.dropoff_latitude),
                      ],
                      [
                        parseFloat(
                          this.details.taxi_order.driver_accept_latitude
                        ),
                        parseFloat(
                          this.details.taxi_order.driver_accept_longitude
                        ),
                      ],
                    ]);

                    // Calculate the bounding box
                    const bbox = coordinates.reduce(
                      (box: any, coord: any) => {
                        return [
                          Math.min(box[0], coord[0]),
                          Math.min(box[1], coord[1]),
                          Math.max(box[2], coord[0]),
                          Math.max(box[3], coord[1]),
                        ];
                      },
                      [Infinity, Infinity, -Infinity, -Infinity]
                    );

                    // Set the map viewport to fit the bounding box with some padding
                    try {
                      this.mapbox.fitBounds(bbox, {
                        padding: 50, // You can adjust the padding as needed
                      });
                    } catch (e) {}
                  }
                });
            }
            break;

          case 'pending':
            break;

          case 'preparing':
          case 'cancelled':
            if (!this.preparingPolylineFetched) {
              this.api
                .getPolyline(
                  this.details.taxi_order.driver_accept_latlng,
                  this.details.taxi_order.pickup_latitude +
                    ',' +
                    this.details.taxi_order.pickup_longitude
                )
                .then((res: any) => {
                  this.preparingPolylineFetched = true;
                  const line = res.data;
                  const decodedCoordinates = googlePolyline
                    .decode(line)
                    .map((coord) => [coord[1], coord[0]]);

                  console.log(decodedCoordinates);

                  const geojson: any = {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: decodedCoordinates,
                    },
                  };

                  if (
                    this.mapbox.getSource('polyline_' + this.details?.status) !=
                    null
                  ) {
                  } else {
                    console.log('painting line');
                    this.mapbox.addSource('polyline_' + this.details?.status, {
                      type: 'geojson',
                      data: geojson,
                    });

                    this.mapbox.addLayer({
                      id: 'polyline_' + this.details?.status,
                      type: 'line',
                      source: 'polyline_' + this.details?.status,
                      layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                      },
                      paint: {
                        'line-color': '#4c6c33', // Customize the line color
                        'line-width': 4, // Customize the line width
                      },
                    });

                    let coordinates = geojson.geometry.coordinates.concat([
                      [
                        parseFloat(
                          this.details.taxi_order.driver_accept_longitude
                        ),
                        parseFloat(
                          this.details.taxi_order.driver_accept_latitude
                        ),
                      ],
                      [
                        parseFloat(this.details.taxi_order.pickup_longitude),
                        parseFloat(this.details.taxi_order.pickup_latitude),
                      ],
                    ]);

                    if (this.details.status == 'cancelled') {
                      coordinates = geojson.geometry.coordinates.concat([
                        [
                          parseFloat(
                            this.details.taxi_order.driver_accept_longitude
                          ),
                          parseFloat(
                            this.details.taxi_order.driver_accept_latitude
                          ),
                        ],
                        [
                          parseFloat(this.details.taxi_order.pickup_longitude),
                          parseFloat(this.details.taxi_order.pickup_latitude),
                        ],
                        [
                          parseFloat(this.details.taxi_order.dropoff_longitude),
                          parseFloat(this.details.taxi_order.dropoff_latitude),
                        ],
                      ]);
                    }

                    // Calculate the bounding box
                    const bbox = coordinates.reduce(
                      (box: any, coord: any) => {
                        return [
                          Math.min(box[0], coord[0]),
                          Math.min(box[1], coord[1]),
                          Math.max(box[2], coord[0]),
                          Math.max(box[3], coord[1]),
                        ];
                      },
                      [Infinity, Infinity, -Infinity, -Infinity]
                    );

                    // Set the map viewport to fit the bounding box with some padding
                    this.mapbox.fitBounds(bbox, {
                      padding: 50, // You can adjust the padding as needed
                    });
                  }
                });
            }

            break;
          case 'arrived':
            break;
          case 'enroute':
          case 'delivered':
            if (
              (this.details.status == 'enroute' &&
                !this.enroutePolylineFetched) ||
              this.details.status == 'delivered'
            ) {
              this.api
                .getPolyline(
                  this.details.taxi_order.pickup_latitude +
                    ',' +
                    this.details.taxi_order.pickup_longitude,
                  this.details.taxi_order.dropoff_latitude +
                    ',' +
                    this.details.taxi_order.dropoff_longitude
                )
                .then((res: any) => {
                  this.enroutePolylineFetched = true;
                  const line = res.data;
                  console.log(line);

                  const decodedCoordinates = googlePolyline
                    .decode(line)
                    .map((coord) => [coord[1], coord[0]]);

                  console.log(decodedCoordinates);

                  const geojson: any = {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: decodedCoordinates,
                    },
                  };

                  if (
                    !this.mapbox.getSource('polyline_' + this.details?.status)
                  ) {
                    this.mapbox.addSource('polyline_' + this.details?.status, {
                      type: 'geojson',
                      data: geojson,
                    });

                    this.mapbox.addLayer({
                      id: 'polyline_' + this.details?.status,
                      type: 'line',
                      source: 'polyline_' + this.details?.status,
                      layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                      },
                      paint: {
                        'line-color': '#4c6c33', // Customize the line color
                        'line-width': 4, // Customize the line width
                      },
                    });

                    const coordinates = geojson.geometry.coordinates.concat([
                      [
                        parseFloat(this.details.taxi_order.pickup_longitude),
                        parseFloat(this.details.taxi_order.pickup_latitude),
                      ],
                      [
                        parseFloat(this.details.taxi_order.dropoff_longitude),
                        parseFloat(this.details.taxi_order.dropoff_latitude),
                      ],
                      [
                        parseFloat(
                          this.details.taxi_order.driver_accept_latitude
                        ),
                        parseFloat(
                          this.details.taxi_order.driver_accept_longitude
                        ),
                      ],
                    ]);

                    // Calculate the bounding box
                    const bbox = coordinates.reduce(
                      (box: any, coord: any) => {
                        return [
                          Math.min(box[0], coord[0]),
                          Math.min(box[1], coord[1]),
                          Math.max(box[2], coord[0]),
                          Math.max(box[3], coord[1]),
                        ];
                      },
                      [Infinity, Infinity, -Infinity, -Infinity]
                    );

                    // Set the map viewport to fit the bounding box with some padding
                    try {
                      this.mapbox.fitBounds(bbox, {
                        padding: 50, // You can adjust the padding as needed
                      });
                    } catch (e) {}
                  }
                });
            }
            break;
        }
        //TODO: remove later after mocking Pautos booking
        // data.data.booking.is_pautos = true;
        this.details = data.data.booking;
        if (this.details.is_pautos) {
          //TODO: uncomment later
          // this.sendBudgetPopup.fire();
          //TODO: comment later
          // this.showSendBudget = true;
          //TODO: comment later
          // this.swalInsufficientBudget.fire();

          if (this.isFirstListener) {
            this.isFirstListener = false;

            // setTimeout(() => {
            //   const div = this.bottomSheet.nativeElement as HTMLDivElement;
            //   const { swipeArea, updateOptions } = SwipeEventListener({
            //     swipeArea: div,
            //   });

            //   swipeArea.addEventListener('swipeDown', () => {
            //     this.swipeState = 'minimized';
            //   });
            //   swipeArea.addEventListener('swipeUp', () => {
            //     console.log('swipe up');
            //     this.swipeState = 'fullScreen';
            //   });
            // }, 500);
          }
        }
        const pickupElement = document.createElement('div');
        pickupElement.className = 'marker pickup_marker';

        const dropoffElement = document.createElement('div');
        dropoffElement.className = 'marker dropoff_marker';

        const driverElement = document.createElement('div');
        driverElement.className = 'marker logo_marker';
        if (!this.pickupMarker) {
          this.pickupMarker = new mapboxgl.Marker(pickupElement)
            .setLngLat([
              parseFloat(this.details.taxi_order.pickup_longitude),
              parseFloat(this.details.taxi_order.pickup_latitude),
            ])
            .setPopup(pickupPopup);

          pickupPopup.on('open', () => {
            this.mapbox.panTo(this.pickupMarker.getLngLat());
          });

          this.pickupMarker.addTo(this.mapbox);
        }

        if (
          (!this.dropoffMarker && !this.details.taxi_order.is_quick_book) ||
          (this.details.taxi_order.is_quick_book &&
            (this.details.status == 'delivered' ||
              this.details.status == 'cancelled'))
        ) {
          this.dropoffMarker = new mapboxgl.Marker(dropoffElement)
            .setLngLat([
              parseFloat(this.details.taxi_order.dropoff_longitude),
              parseFloat(this.details.taxi_order.dropoff_latitude),
            ])
            .setPopup(dropoffPopup);

          dropoffPopup.on('open', () => {
            this.mapbox.panTo(this.dropoffMarker.getLngLat());
          });

          this.dropoffMarker.addTo(this.mapbox);
        }

        if (!this.driverMarker) {
          this.driverMarker = new mapboxgl.Marker(driverElement)
            .setLngLat([this.details.driver.lng, this.details.driver.lat])
            .setPopup(driverPopup);

          if (
            (this.details?.status == 'delivered' ||
              this.details?.status == 'cancelled') &&
            this.details.taxi_order.driver_accept_latitude !== ''
          ) {
            this.driverMarker.setLngLat([
              parseFloat(this.details.taxi_order.driver_accept_longitude),
              parseFloat(this.details.taxi_order.driver_accept_latitude),
            ]);
          }

          driverPopup.on('open', () => {
            this.mapbox.panTo(this.driverMarker.getLngLat());
          });

          this.driverMarker.addTo(this.mapbox);
        }

        if (
          (this.details.status == 'delivered' ||
            this.details?.status == 'cancelled') &&
          this.details.taxi_order.driver_accept_latitude !== ''
        ) {
          this.driverMarker.setLngLat([
            parseFloat(this.details.taxi_order.driver_accept_longitude),
            parseFloat(this.details.taxi_order.driver_accept_latitude),
          ]);

          this.api
            .getPolyline(
              this.details.taxi_order.driver_accept_latlng,
              this.details.taxi_order.pickup_latitude +
                ',' +
                this.details.taxi_order.pickup_longitude
            )
            .then((res: any) => {
              const line = res.data;
              const decodedCoordinates = googlePolyline
                .decode(line)
                .map((coord) => [coord[1], coord[0]]);

              console.log(decodedCoordinates);

              const geojson: any = {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: decodedCoordinates,
                },
              };

              if (this.mapbox.getSource('polyline_' + 'preparing') != null) {
              } else {
                console.log('make line');
                this.mapbox.addSource('polyline_' + 'preparing', {
                  type: 'geojson',
                  data: geojson,
                });

                this.mapbox.addLayer({
                  id: 'polyline_' + 'preparing',
                  type: 'line',
                  source: 'polyline_' + 'preparing',
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                  },
                  paint: {
                    'line-color': '#7cae41', // Customize the line color
                    'line-width': 4, // Customize the line width
                  },
                });

                const coordinates = geojson.geometry.coordinates.concat([
                  [
                    parseFloat(
                      this.details.taxi_order.driver_accept_longitude ??
                        this.details.driver.lng
                    ),
                    parseFloat(
                      this.details.taxi_order.driver_accept_latitude ??
                        this.details.driver.lat
                    ),
                  ],
                  [
                    parseFloat(this.details.taxi_order.pickup_longitude),
                    parseFloat(this.details.taxi_order.pickup_latitude),
                  ],
                ]);

                // Calculate the bounding box
                const bbox = coordinates.reduce(
                  (box: any, coord: any) => {
                    return [
                      Math.min(box[0], coord[0]),
                      Math.min(box[1], coord[1]),
                      Math.max(box[2], coord[0]),
                      Math.max(box[3], coord[1]),
                    ];
                  },
                  [Infinity, Infinity, -Infinity, -Infinity]
                );
              }
            });
        } else {
          this.driverMarker.setLngLat([
            this.details.driver.lng,
            this.details.driver.lat,
          ]);
        }

        this.pickupMarker.setLngLat([
          parseFloat(this.details.taxi_order.pickup_longitude),
          parseFloat(this.details.taxi_order.pickup_latitude),
        ]);

        this.dropoffMarker?.setLngLat([
          parseFloat(this.details.taxi_order.dropoff_longitude),
          parseFloat(this.details.taxi_order.dropoff_latitude),
        ]);
      });
  }
}
