import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { ApiServices } from '../../services/api-services';
import constants from '../../../constants';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss'],
})
export class MapboxComponent {
  mapBox: mapboxgl.Map;
  @Input() style = 'mapbox://styles/mapbox/streets-v11';
  @Input() fetchOnMove = true;
  @Input() mapboxId = 'mapbox';
  @Output() onAddressChange = new EventEmitter<{
    text: string;
    subText: string;
    coords: {
      lat: number;
      lng: number;
    };
  }>();

  @Output() onFetchingAddress = new EventEmitter<boolean>(false);

  public address = {
    text: '',
    subText: '',
    coords: {
      lat: 0,
      lng: 0,
    },
  };
  onResize = false;
  getCurrentPositionControl: any;
  constructor(private api: ApiServices) {}
  ngOnInit() {
    this.mapBox = new mapboxgl.Map({
      container: this.mapboxId,
      style: this.style,
      trackResize: true,
      zoom: 14,
      center: [118.7472807144652, 9.763661108530336],
      accessToken: constants.mapboxToken,
    });

    navigator.geolocation.getCurrentPosition((position) => {
      new mapboxgl.Marker()
        .setLngLat([position.coords.longitude, position.coords.latitude]) // Example marker coordinates
        .addTo(this.mapBox);
    });
    // this.mapBox.addControl(
    //   new mapboxgl.GeolocateControl({
    //     positionOptions: {
    //       enableHighAccuracy: true,
    //     },
    //     trackUserLocation: true,
    //   })
    // );

    this.getCurrentPositionControl = document.createElement('div');
    this.getCurrentPositionControl.innerHTML =
      '<div class="flex justify-center items-center h-[40px] w-[40px] absolute mylocation bg-white cursor-pointer shadow-highlight rounded-sm"><i class="fas fa-crosshairs fa-fw text-[16px] text-slate-500"></i></div>';

    const zoomPlusControl = document.createElement('div');
    zoomPlusControl.innerHTML =
      '<div class="flex justify-center items-center h-[40px] w-[40px] absolute zoomIn bg-white cursor-pointer shadow-highlight rounded-sm"><i class="fa fa-plus fa-fw text-[16px] text-slate-500"></i></div>';

    const zoomMinusControl = document.createElement('div');
    zoomMinusControl.innerHTML =
      '<div class="flex justify-center items-center h-[40px] w-[40px] absolute zoomOut bg-white cursor-pointer shadow-highlight rounded-sm"><i class="fas fa-minus fa-fw text-[16px] text-slate-500"></i></div>';

    this.getCurrentPositionControl.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.mapBox.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            essential: true,
            zoom: 14,
          });
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    });

    zoomPlusControl.addEventListener('click', () => {
      this.mapBox.zoomIn();
    });
    zoomMinusControl.addEventListener('click', () => {
      this.mapBox.zoomOut();
    });

    this.mapBox.getContainer().appendChild(this.getCurrentPositionControl);
    this.mapBox.getContainer().appendChild(zoomPlusControl);
    this.mapBox.getContainer().appendChild(zoomMinusControl);

    this.getCurrentPositionControl.click();

    this.mapBox.on('load', () => {
      this.mapBox.resize();
    });

    if (this.fetchOnMove) {
      let timeout = 0;

      this.mapBox.on('resize', () => {
        window.clearTimeout(timeout);
      });
      this.mapBox.on('zoom', () => {
        window.clearTimeout(timeout);
      });
      this.mapBox.on('moveend', () => {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          //TODO: fetch location
          this.address.text = '...';
          this.address.subText = 'Fetching location...';
          const center = this.mapBox.getCenter();
          this.address.coords.lat = center.lat;
          this.address.coords.lng = center.lng;
          // const youMarker = new mapboxgl.Marker()
          //   .setLngLat(center)
          //   .addTo(this.mapBox);
          // this.onAddressChange.emit(this.address);
          console.log(center);
          this.onFetchingAddress.emit(true);
          this.api
            .getMyGeocoder()
            .forward(center.lat, center.lng)
            .then((res: any) => {
              const results = res.data;
              if (res.data.length > 0) {
                const result = results[0];
                console.log(result);
                // result.formatted_address = result.formatted_address.replace(
                //   ', Puerto Princesa, Mimaropa, Philippines',
                //   ''
                // );
                const splitted = (result.formatted_address + '').split(', ', 1);
                this.address.text = splitted[0];
                const subText = (result.formatted_address + '')
                  .split(', ')
                  .slice(1)
                  .join(', ');
                this.address.subText = subText;

                this.onAddressChange.emit(this.address);
              }
            })
            .finally(() => {
              this.onFetchingAddress.emit(false);
            });
        }, 100);
      });
    }
  }
}
