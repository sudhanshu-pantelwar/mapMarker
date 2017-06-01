import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class Locations {
  loading: any;
  constructor(public http: Http, public loadingCtrl: LoadingController) {
    console.log('Hello Locations Provider');
  }

 startLoading() {
   this.loading = this.loadingCtrl.create({
     content: 'Please wait...'
   });
 
    this.loading.present();
 
  }

 closeLoading(){
   this.loading.dismiss();
 }
markers(){
  let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  let options = new RequestOptions({ headers: headers });
    return this.http.get('https://racketfriends.com/wp-json/peepso-custom-api/v1/markers?api-key=abcd1234', options)
    .map(res => res.json());
  }
}
