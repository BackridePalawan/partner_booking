import { Component, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapboxComponent } from '../component/mapbox/mapbox.component';
import { ApiServices } from '../services/api-services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { error } from 'console';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
})
export class BookComponent implements OnInit {
  imageUrl = 'assets/images/camera.jpg';
  title: string = '';
  commission: any;
  vehiclesAvailable: any;
  bookorder: any;
  book_order_details: any;
  loadingPage: boolean = true;
  driverSearchPage: boolean = false;
  visible: boolean = false;
  connectingToDriver: boolean = false;
  openReciept: boolean = false;
  connectingMessage: string = 'Searching For Driver';
  driverDetails: any;
  notes: string = '';
  withLuggage: boolean = false;
  rideCover: boolean = false;
  showerCap: boolean = false;
  pollingSubscription: Subscription;
  uploadedImage: File;
  subtotal: number = 0;
  total: number = 0;
  constructor(
    private api: ApiServices,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.getAffiliateCommission();

    this.setCurrentAddress();
  }

  ngOnDestroy(): void {
    // Stop polling when the component is destroyed
    this.stopPolling();
  }

  bookForm: FormGroup = this.formBuilder.group({
    fullname: ['', Validators.required],
    phone: ['', [Validators.required]],
    passenger_photo: ['', [Validators.required]],
    email: ['', [Validators.required]],
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
      buttonText: 'Set as Pickup address',
      placeholderText: 'Pickup address',
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

  addNoteDialog() {
    this.visible = true;
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
    if (
      this.deliveryAddress.coords.lat == 0 &&
      this.deliveryAddress.coords.lng == 0
    ) {
      Swal.fire({
        title: 'Please Set The Pick up Address',
        icon: 'warning',
        timer: 4000,
      });
      return;
    }
    if (
      this.storeAddress.coords.lat == 0 &&
      this.storeAddress.coords.lng == 0
    ) {
      Swal.fire({
        title: 'Please Set The Destination Address',
        icon: 'warning',
        timer: 4000,
      });
      return;
    }
    this.loadingPage = true;
    this.api
      .getVehicleEstimatePrice(
        `${this.deliveryAddress.coords.lat.toString()},${this.deliveryAddress.coords.lng.toString()}`,
        `${this.storeAddress.coords.lat.toString()},${this.storeAddress.coords.lng.toString()}`
      )
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.vehiclesAvailable = res;
          this.loadingPage = false;
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: error.error.message,
            icon: 'success',
            timer: 5000,
          });
          this.loadingPage = false;
        },
      });
    this.pageNo = 3;
    console.log([this.deliveryAddress, this.storeAddress]);
  }

  selectedPautosVehicle: any;
  selectPautosVehicle(vehicle: any) {
    console.log(vehicle);
    this.selectedPautosVehicle = vehicle;
    this.subtotal = this.selectedPautosVehicle.total;
    this.total = this.subtotal;
    console.log(this.selectedPautosVehicle.total);
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
          let details = {
            note: this.notes,
            has_luggage:
              this.selectedPautosVehicle.slug !== 'motorcycle' &&
              this.withLuggage
                ? '1'
                : '0',
            // includes_ride_cover: this.rideCover ? '1' : '0',
            // includes_shower_cap:
            //   this.selectedPautosVehicle.slug == 'motorcycle' && this.showerCap,
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
            sub_total: this.subtotal,
            total: this.total,
          };

          const formData: FormData = new FormData();

          formData.append('note', details.note);
          formData.append('passenger_name', details.passenger_name);
          formData.append('passenger_phone', details.passenger_phone);
          formData.append('driver_id', details.driver_id);
          formData.append('payment_method_id', details.payment_method_id);
          formData.append('vehicle_type_id', details.vehicle_type_id);
          formData.append('has_luggage', details.has_luggage);

          // Append pickup details
          formData.append('pickup[lat]', details.pickup.lat.toString());
          formData.append('pickup[lng]', details.pickup.lng.toString());
          formData.append('pickup[address]', details.pickup.address);

          // Append dropoff details
          formData.append('dropoff[lat]', details.dropoff.lat.toString());
          formData.append('dropoff[lng]', details.dropoff.lng.toString());
          formData.append('dropoff[address]', details.dropoff.address);

          formData.append('sub_total', details.sub_total.toString());
          formData.append('total', details.total.toString());

          if (this.uploadedImage) {
            formData.append(
              'passenger_photo',
              this.uploadedImage,
              this.uploadedImage.name
            );
          }
          console.log(details);
          this.driverSearchPage = false;
          this.bookOrder(formData);
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
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedImage = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.bookForm!.patchValue({
  //       passenger_photo: file,
  //     });
  //     this.bookForm!.get('passenger_photo')!.updateValueAndValidity();

  //     const reader = new FileReader();

  //     reader.onload = (e: any) => {
  //       this.imageUrl = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  bookOrder(details: any) {
    console.log(JSON.stringify(details));
    this.connectingToDriver = true;
    this.api.booking(details).subscribe({
      next: (res: any) => {
        console.log(res);
        this.bookorder = { order: res.order, commission: this.commission };
        this.startPolling();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error);
        this.driverSearchPage = false;
      },
    });
  }

  getAvailbleVehicle() {
    const branchID = localStorage.getItem('branch_id');
    if (branchID == '' || branchID == undefined) {
      Swal.fire({
        title: 'Please Try Again..',
        icon: 'warning',
        timer: 5000,
      });
    }
    this.api.findVehicleTypes(branchID ?? '').subscribe({
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

  getAffiliateCommission() {
    this.api.getAffiliateCommision().subscribe({
      next: (res: any) => {
        console.log(res);
        this.commission = res.fixed_markup_amount;
        console.log(this.commission);
        this.getAvailbleVehicle();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  addAffiliateOrder() {
    this.connectingMessage = 'Preparing for the Reciept';
    console.log({
      order_id: this.bookorder.order.id,
    });
    this.api
      .addAffiliateBook({
        order_id: this.bookorder.order.id,
      })
      .subscribe({
        next: (res) => {
          this.openReciept = true;
          var phonenumber =
            this.bookForm.get('phone')?.value.slice(0, 2) == '09'
              ? '+63' + this.bookForm.get('phone')?.value.slice(1)
              : this.bookForm.get('phone')?.value;
          this.api
            .sendBookingDetails({
              message: `http://localhost:4200/affiliate/viewbooking/${this.bookorder.order.id}-${this.bookorder.order.code}`,
              phone: phonenumber,
              recipient: this.bookForm.get('email')!.value ?? '',
              driver: 'false',
            })
            .subscribe({
              next: (res) => {
                console.log(res);
              },
              error: (error: HttpErrorResponse) => {
                console.log(error.error.message);
              },
            });
          // this.router.navigate([
          //   `affiliate/viewbooking/${this.bookorder.order.id}-${this.bookorder.order.code}`,
          // ]);

          this.connectingToDriver = false;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
      });
  }

  orderPreview() {
    this.api.getOrderDetails(this.bookorder.order.id).subscribe({
      next: (res: any) => {
        this.book_order_details = res;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  startPolling(): void {
    // Use timer to emit values at a fixed interval
    this.pollingSubscription = timer(0, 5000)
      .pipe(switchMap(() => this.api.getOrderDetails(this.bookorder.order.id)))
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.book_order_details = res;
          if (res.driver) {
            this.addAffiliateOrder();
            // If the status is not 'pending', stop polling
            this.stopPolling();
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
      });
  }

  stopPolling(): void {
    // Unsubscribe from the polling subscription to stop further requests
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  searchResults: any[] = [];
  searchTimeoutMilliseconds = 500;
  searchTimeout: any;
  onSearchAddress(e: any) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      console.log(e, e.target.value);
      if (e.target.value === '') {
        this.searchResults = [];
        return;
      }
      this.api
        .getGeocoder()
        .reverseOriginal(e.target.value)
        .then((res: any) => {
          console.log('geocode', res);
          this.searchResults = res.data;
        });
    }, this.searchTimeoutMilliseconds);
  }

  selectAddress(address: any) {
    // this.address = {
    //   text: (address.formatted_address + '').split(', ', 2)[0],
    //   subText: (address.formatted_address + '').split(', ', 2)[1],
    //   coords: {
    //     lat: address.geometry.location.lat,
    //     lng: address.geometry.location.lng,
    //   },
    // };
    this.locationPicker?.mapBox.panTo([
      address.geometry.location.lng,
      address.geometry.location.lat,
    ]);
    this.searchResults = [];
  }

  addNotes(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.value);
    this.notes = inputElement.value;
  }

  changeLuggage(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.withLuggage = inputElement.checked;
    if (this.selectedPautosVehicle.slug == 'motorcycle') {
      Swal.fire({
        title: 'Luggage is not available for motorcycles.',
        icon: 'error',
        timer: 5000,
      });
      this.withLuggage = false;
      console.log(this.withLuggage);
      return;
    }
  }

  changeShower(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.showerCap = inputElement.checked;
    if (this.selectedPautosVehicle.slug != 'motorcycle') {
      Swal.fire({
        title: 'Luggage is not available for motorcycles.',
        icon: 'error',
        timer: 5000,
      });
      this.showerCap = false;
      console.log(this.showerCap);
      return;
    }
  }

  withLagguage(event: any) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.checked);
    this.withLuggage = inputElement.checked;
  }

  anotherBook() {
    this.pageNo = 1;
    this.openReciept = false;

    this.bookForm.patchValue({
      fullname: '',
      phone: '',
      passenger_photo: '',
    });
    this.notes = '';
    this.imageUrl = 'assets/images/camera.jpg';
    this.uploadedImage;
    console.log(this.uploadedImage);
  }
}
