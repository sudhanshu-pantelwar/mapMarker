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
                  // alert(data);
                  this.response = data;
                  let markLength = this.response.markers;
                  for(let i=0; i<this.response.markers.length; i++){
                      let latLng = new google.maps.LatLng(this.response.markers[i].lat, this.response.markers[i].lng);
                      let img = this.response.markers[i].user_avatar_url;
                      let first_name = this.response.markers[i].first_name;
                      let last_name = this.response.markers[i].last_name;
                      let nicename = this.response.markers[i].nicename;
                      let hometown = this.response.markers[i].hometown;
                      let currentloc = this.response.markers[i].currentloc;
                      let playlevel = this.response.markers[i].playlevel;
                      let ntrp = this.response.markers[i].ntrp;
                      let mainsport = this.response.markers[i].mainsport;
                      let description = this.response.markers[i].description;
                      this.addMarker(latLng, img, first_name, last_name, nicename, hometown, currentloc, playlevel, ntrp, mainsport, description);
                  }
                  this.locations.closeLoading();
                })      
              }, (err) => {
                          console.log(JSON.stringify(err));
              });
    }
addMarker(latLng, img, first_name, last_name, nicename, hometown, currentloc, playlevel, ntrp, mainsport, description){

  let marker = new google.maps.Marker({
        map: this.map,
        position: latLng
      });
 
    
    this.addInfoWindow(marker, img, first_name, last_name, nicename, hometown, currentloc, playlevel, ntrp, mainsport, description);
  }

  addInfoWindow(marker, img, first_name, last_name, nicename, hometown, currentloc, playlevel, ntrp, mainsport, description){
    google.maps.event.addListener(marker, 'click', (event) => {
      let latlng = event.latLng;
      let distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.curLat, this.curLon), new google.maps.LatLng(latlng.lat(), latlng.lng()));
      distance = distance/1000;
      distance = distance.toFixed(2);
      let locateIcon = document.getElementById('locate-icon');
      let personIcon = document.getElementById('person-icon');
      let content = "<div>" + "<a href='https://racketfriends.com/profile/?" + nicename + "/about'><img src="+img+"></a></div>" + "<h5>" + first_name + " " + last_name + ", " + hometown + "</h5><br><a href='https://racketfriends.com/profile/?" + nicename + "/about' class='link-popup'>"+personIcon.innerHTML+" See " + first_name + "'s full profile</a><br><p>"+locateIcon.innerHTML+" CURRENT LOCATION: </p><span class='currentloc'>" + currentloc + ", ~" + distance + " km away</span><br><p>PLAY LEVEL: </p><span class='playlevel "+ playlevel +"'>" + playlevel + " </span><span class='ntrp "+ playlevel +"'>" + ntrp + "</span><br><p>PLAYS:</p> " + "<h5>" + mainsport + " </h5><div class='racketsports'>" + description + ".. </div>";
      
      let infoWindow = new google.maps.InfoWindow({
        content: content
        });

      infoWindow.open(this.map, marker);
    });
  }
}
