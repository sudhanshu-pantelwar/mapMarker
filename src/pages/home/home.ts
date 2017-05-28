import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Locations } from '../../providers/locations';
import { IonicPage, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // @ViewChild('map') mapElement: ElementRef;
  map: any;
  response: any;
  curLat: any;
  curLon: any;
  constructor(platform: Platform, private geolocation: Geolocation, public navCtrl: NavController, public locations:Locations) {
    console.log("entered");
    platform.ready().then(() => {
      this.loadMap1();
    })
  }

//   ngOnInit(){
    
//     this.loadMap1();
// }

 loadMap1(){

    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((position) => {
                  console.log("geolocation");
                  let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                  this.curLat = position.coords.latitude;
                  this.curLon = position.coords.longitude;
                  let mapOptions = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                  }
            
                  this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                  this.locations.markers().subscribe( data => {
                  // console.log(data);
                  this.response = data;
                  this.response = JSON.parse(this.response._body);
                  let markLength = this.response.markers;
                  // console.log(markLength.length);
                  //  let latLng = new google.maps.LatLng(this.response.markers[0].lat, this.response.markers[0].lng);
                  //  let mapOptions = {
                  //                 center: latLng,
                  //                 zoom: 15,
                  //                 mapTypeId: google.maps.MapTypeId.ROADMAP
                  //               }
                          
                  //               this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                                // this.addMarker(latLng);
                  for(let i=0; i<this.response.markers.length; i++){
                  // console.log(this.response.markers[i].lng);
                  let latLng = new google.maps.LatLng(this.response.markers[i].lat, this.response.markers[i].lng);
                  let img = this.response.markers[i].user_avatar_url;
                  let nicename = this.response.markers[i].nicename;
                  let playlevel = this.response.markers[i].playlevel;
                  this.addMarker(latLng, img, nicename, playlevel);
                }
                })      
                      
                    }, (err) => {
                          console.log(JSON.stringify(err));
                  });
   
    
   
    }
addMarker(latLng, img, nicename, playlevel){
  // let image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

  let marker = new google.maps.Marker({
        map: this.map,
        position: latLng,
        // icon: {
        //       path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
        //       fillColor: '#FF0000',
        //       fillOpacity: 1,
        //       strokeWeight: 1,
        //       scale: .8,
        //       text: "57"
        //     },
        //     label: "B"
      });
      // let coordinate = this.map.getCenter();
 
    let content = "<img src='"+img+"' alt='Smiley face' height='180' width='180'><h4>"+nicename+"</h4><a href='https://www.google.com'><h5>See "+nicename+"'s full profile</h5></a><p>Play Level</p><button type='button' class='playlevel'>"+playlevel+"</button>";          
  
    this.addInfoWindow(marker, content);
 
}

  addInfoWindow(marker, content){
 
  
  
    google.maps.event.addListener(marker, 'click', (event) => {
      let latlng = event.latLng;
      // console.log("event", latlng.lat(), latlng.lng());
      let distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.curLat, this.curLon), new google.maps.LatLng(latlng.lat(), latlng.lng()));
      distance = distance/1000;
      distance = distance.toFixed(2);
      let infoWindow = new google.maps.InfoWindow({
        content: content+"<p>current location</p><button type='button' class='playlevel'>~ "+distance+" km away</button>"
        });
      infoWindow.open(this.map, marker);
    });
  }
}
