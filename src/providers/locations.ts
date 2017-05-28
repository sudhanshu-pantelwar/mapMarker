import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Locations provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Locations {

  constructor(public http: Http) {
    console.log('Hello Locations Provider');
  }

markers(){
  let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  let options = new RequestOptions({ headers: headers });
    return this.http.get('../www/assets/locations.json', options)
    .map(res => res);
}
}
