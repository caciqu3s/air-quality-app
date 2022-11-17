import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getDataFromGeolocation(geolocation?: { lat: number, lng: number}): Observable<any> {
    let params = new HttpParams();
    params = params.append('key', 'YOUR API KEY HERE');
    if(geolocation) {
      params = params.append('lat', geolocation.lat);
      params = params.append('lon', geolocation.lng);
    }

    return this.http.get(`http://api.airvisual.com/v2/nearest_city`, { params })
      .pipe(catchError(err => {
        console.error(err)
        if(err.status == 429) {
          alert('API request limit reached, please wait some seconds to continue.');
          return throwError('API request limit reached, please wait some seconds to continue.');
        } 

        alert('API Server error.')
        return throwError('API Server error.');
      }));
  }
}
