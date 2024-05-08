import { Component, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapboxComponent } from '../component/mapbox/mapbox.component';
import { ApiServices } from '../services/api-services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
})
export class BookComponent implements OnInit {
  vehiclesAvailable: any;
  loadingPage: boolean = false;
  driverSearchPage: boolean = false;
  openReciept: boolean = true;
  connectingMessage: string = 'Searching For Driver';
  driverDetails: any;
  constructor(
    private api: ApiServices,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    // this.getAvailbleVehicle();
    this.setCurrentAddress();
  }

  bookForm: FormGroup = this.formBuilder.group({
    fullname: ['', Validators.required],
    phone: ['', [Validators.required]],
  });

  @ViewChild('locationPicker') locationPicker?: MapboxComponent;
  pageNo = 1;
  address = {
    text: '',
    subText: '',
    coords: {
      lat: 0,
      lng: 0,
    },
  };
  isLoading = false;
  deliveryAddress = {
    text: '',
    subText: '',
    coords: {
      lat: 0,
      lng: 0,
    },
  };
  storeAddress = {
    text: '',
    subText: '',
    coords: {
      lat: 0,
      lng: 0,
    },
  };

  targetAddressPickOptions = {
    DELIVERY: {
      target: 'delivery',
      buttonText: 'Set as delivery address',
      placeholderText: 'Delivery address',
    },
    Destination: {
      target: 'destination',
      buttonText: 'Set as destination address',
      placeholderText: 'Destination address',
    },
  };

  targetAddressPick = {
    target: '',
    buttonText: '',
    placeholderText: '',
  };

  setCurrentAddress() {
    // Get the current geolocation position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Set the deliveryAddress to the current geolocation position
        // this.deliveryAddress = {
        //   text: 'Current Location', // You can set a default text for the address
        //   subText: '', // Optionally, you can set additional information
        //   coords: {
        //     lat: lat,
        //     lng: lng,
        //   },
        // };

        this.api
          .getMyGeocoder()
          .forward(lat, lng)
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
              this.deliveryAddress.text = splitted[0];
              const subText = (result.formatted_address + '')
                .split(', ')
                .slice(1)
                .join(', ');
              this.deliveryAddress.subText = subText;
              this.deliveryAddress.coords.lat = lat;
              this.deliveryAddress.coords.lng = lng;
            }
          });

        // Optionally, update the map view to the delivery address
        this.locationPicker?.mapBox.setCenter([lng, lat]);
        this.locationPicker?.mapBox.resize();
      },
      (error) => {
        console.error('Error getting geolocation:', error);
      }
    );
  }

  setCurrentLocation() {
    this.setDeliveryAddress();
    this.locationPicker?.getCurrentPositionControl?.click();
  }

  count = 0;

  onAddressChange(data: {
    text: string;
    subText: string;
    coords: {
      lat: number;
      lng: number;
    };
  }) {
    this.count++;
    if (this.count == 1) {
      return;
    }
    this.address = structuredClone(data);
    switch (this.targetAddressPick.target) {
      case 'delivery':
        this.deliveryAddress = structuredClone(data);
        break;

      case 'destination':
        this.storeAddress = structuredClone(data);
        break;
    }
    // this.address = data;
  }

  setDeliveryAddress() {
    this.pageNo = 2;
    this.targetAddressPick = structuredClone(
      this.targetAddressPickOptions.DELIVERY
    );
    this.address = structuredClone(this.deliveryAddress);
    if (this.address.coords.lat != 0) {
      this.locationPicker?.mapBox.setCenter([
        this.address.coords.lng,
        this.address.coords.lat,
      ]);
    }
    setTimeout(() => {
      this.locationPicker?.mapBox.resize();
    });
  }
  setStoreAddress() {
    this.setCurrentLocation();

    this.pageNo = 2;
    this.targetAddressPick = structuredClone(
      this.targetAddressPickOptions.Destination
    );
    this.address = structuredClone(this.storeAddress);
    if (this.address.coords.lat != 0) {
      this.locationPicker?.mapBox.setCenter([
        this.address.coords.lng,
        this.address.coords.lat,
      ]);
    }
    setTimeout(() => {
      this.locationPicker?.mapBox.resize();
    });
  }

  proceedPasuyo() {
    this.pageNo = 3;
    console.log([this.deliveryAddress, this.storeAddress]);
  }

  selectedPautosVehicle: any;
  selectPautosVehicle(vehicle: any) {
    this.selectedPautosVehicle = vehicle;
  }

  proceedBook() {
    this.driverSearchPage = true;
    // this.pageNo = 1;
    console.log(this.selectedPautosVehicle.id);
    this.api
      .findAvailableDriver(
        this.storeAddress.coords.lat + ',' + this.storeAddress.coords.lng,

        this.deliveryAddress.coords.lat + ',' + this.deliveryAddress.coords.lng,

        this.selectedPautosVehicle.id
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.driverDetails = res;
          this.connectingMessage = 'Connecting to Driver';

          // console.log();

          let details = {
            passenger_name: this.bookForm.get('fullname')?.value,
            passenger_phone: this.bookForm.get('phone')?.value,
            driver_id: this.driverDetails.available_driver.id,
            payment_method_id: '1',
            vehicle_type_id: this.selectedPautosVehicle.id,
            pickup: {
              lat: this.deliveryAddress.coords.lat,
              lng: this.deliveryAddress.coords.lng,
              address:
                this.deliveryAddress.text + ' ' + this.deliveryAddress.subText,
            },
            dropoff: {
              lat: this.storeAddress.coords.lat,
              lng: this.storeAddress.coords.lng,
              address: this.storeAddress.text + ' ' + this.storeAddress.subText,
            },
            sub_total: this.driverDetails.pickup_dropoff_subtotal,
            total: this.driverDetails.total,
          };
          console.log(details);

          this.bookOrder(details);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          Swal.fire({
            title: error.error.message,
            icon: 'error',
          });
          this.driverSearchPage = false;
        },
      });

    // this.api
    //   .booking({
    //     passenger_name: this.bookForm.get('fullname')?.value,
    //     passenger_phone: this.bookForm.get('phone')?.value,
    //     driver_id: ,
    //     payment_method_id: '1',
    //     vehicle_type_id: '2',
    //     pickup: {
    //       lat: this.deliveryAddress.coords.lat,
    //       lng: this.deliveryAddress.coords.lng,
    //       address:
    //         this.deliveryAddress.text + ' ' + this.deliveryAddress.subText,
    //     },
    //     dropoff: {
    //       lat: this.storeAddress.coords.lat,
    //       lng: this.storeAddress.coords.lng,
    //       address: this.storeAddress.text + ' ' + this.storeAddress.subText,
    //     },
    //   })
    //   .subscribe({
    //     next: (res) => {
    //       console.log(res);
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       console.log(error.error);
    //     },
    //   });
    // sub_total: subTotal,
    // total: total,
    // discount: checkout.discount,
    // tip: tip,
    // coupon_code: coupon?.code,
    // vehicle_type: selectedWalkInVehicleType.encrypted,
    // pickup_date: checkout.pickupDate,
    // pickup_time: checkout.pickupTime,

    //   "quantity": quantity,
    //       "has_luggage": withLuggage ? "1" : "0",
    //       "driver_id": AuthServices.currentUser.id,
    //       "is_walk_in": "1",
    //       "passenger_name": nameData?.toString() ??
    //           LocalStorageService.prefs.getString("passenger_name"),
    //       "passenger_phone": phoneData?.toString() ??
    //           LocalStorageService.prefs.getString("passenger_phone"),
    //       "payment_method_id": "1",
    //       "vehicle_type_id": selectedWalkInVehicleType.id,
    //       "pickup": {
    //         "lat": pickupLocation.latitude,
    //         "lng": pickupLocation.longitude,
    //         "address": pickupLocation.address,
    //       },
    //       "dropoff": {
    //         "lat": dropoffLocation.latitude,
    //         "lng": dropoffLocation.longitude,
    //         "address": dropoffLocation.address,
    //       },
    //       "sub_total": subTotal,
    //       "total": total,
    //       "discount": checkout.discount,
    //       "tip": tip,
    //       "coupon_code": coupon?.code,
    //       "vehicle_type": selectedWalkInVehicleType.encrypted,
    //       "pickup_date": checkout.pickupDate,
    //       "pickup_time": checkout.pickupTime,
  }

  bookOrder(details: any) {
    this.api.booking(details).subscribe({
      next: (res) => {
        console.log(res);
        this.driverSearchPage = false;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error);
        this.driverSearchPage = false;
      },
    });
  }

  getAvailbleVehicle() {
    this.api.findVehicleTypes('6').subscribe({
      next: (res) => {
        console.log(res);
        this.vehiclesAvailable = res;
        this.loadingPage = false;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
}
