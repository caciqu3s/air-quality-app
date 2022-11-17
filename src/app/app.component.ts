import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, Subject } from 'rxjs';
import { ApiService } from './services/api.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MapGeocoder, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(MapInfoWindow)
  infoWindow!: MapInfoWindow;
  @BlockUI() blockUI!: NgBlockUI;
  height = window.innerHeight;
  width = window.innerWidth;
  lat = -23.63294032623774;
  lng = -46.6969643002002;
  options = [];
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPosition = undefined;
  search = '';
  searchSubject = new Subject<string>();
  response$?: Observable<any>;
  geocoderResponse$?: Observable<any[]>;

  constructor(private apiService: ApiService, private mapGeocoder: MapGeocoder) {
    this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(value => {
        this.geocoderResponse$ = this.mapGeocoder.geocode({ address: value })
              .pipe(map((res: any) => {
                console.log(res);
                return res.results;
              }))
      })
  }
  ngOnInit(): void {
    this.getLocation();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }

  selectPlace(event: any): void {
    this.markerPosition = event.latLng.toJSON();
    this.response$ = this.apiService.getDataFromGeolocation(event.latLng.toJSON());
  }

  searchPlace(value: any) {
    if(typeof value === 'string') {
      this.searchSubject.next(value);
    } else {
      this.selectPlaceByInput(value);
      this.lat = value.geometry.location.lat();
      this.lng = value.geometry.location.lng();
      this.markerPosition = { lat: this.lat, lng: this.lng } as any;
    }
  }

  selectPlaceByInput(value: any): void {
    this.response$ = this.apiService.getDataFromGeolocation({ lat: value.geometry.location.lat(), lng: value.geometry.location.lng()});
  }

  displayInput(value: any) {
    if(value) {
      return value.formatted_address;
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      this.blockUI.start('Loading...');
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.response$ = this.apiService.getDataFromGeolocation({ lat: this.lat, lng: this.lng });
          this.blockUI.stop();
        }
      },
        (error) => {
          console.log(error);
          this.blockUI.stop();
        });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
}
