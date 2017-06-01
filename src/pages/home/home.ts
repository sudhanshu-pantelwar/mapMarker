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
  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((position) => {
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
          this.response = data;
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
              let mapdata = [ latLng, img, first_name, last_name, nicename, hometown, currentloc, playlevel, ntrp, mainsport, description];
              this.addMarker(mapdata);
          }
          this.locations.closeLoading();
        })
      }, (err) => {
        console.log(JSON.stringify(err));
      });
    }
    
    addMarker(mapdata){
      let marker = new google.maps.Marker({
        map: this.map,
        position: mapdata[0]
      });
      this.addInfoWindow(marker, mapdata);
    }

    addInfoWindow(marker, mapdata){
      google.maps.event.addListener(marker, 'click', (event) => {
        let latlng = event.latLng;
        let distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.curLat, this.curLon), new google.maps.LatLng(latlng.lat(), latlng.lng()));
        distance = distance/1000;
        distance = distance.toFixed(2);
        let locateIcon = document.getElementById('locate-icon');
        let personIcon = document.getElementById('person-icon');
        let content = "<div>" + "<a href='https://racketfriends.com/profile/?" + mapdata[4] + "/about'><img src="+mapdata[1]+"></a></div>" + "<h5>" + mapdata[2] + " " + mapdata[3] + ", " + mapdata[5] + "</h5><br><a href='https://racketfriends.com/profile/?" + mapdata[2] + "/about' class='link-popup'>"+personIcon.innerHTML+" See " + mapdata[2] + "'s full profile</a><br><p>"+locateIcon.innerHTML+" CURRENT LOCATION: </p><span class='currentloc'>" + mapdata[6] + ", ~" + distance + " km away</span><br><p>PLAY LEVEL: </p><span class='playlevel "+ mapdata[7] +"'>" + mapdata[7] + " </span><span class='ntrp "+ mapdata[6] +"'>" + mapdata[8] + "</span><br><p>PLAYS:</p> " + "<h5>" + mapdata[9] + " </h5><div class='racketsports'>" + mapdata[10] + ".. </div>";
        
        let infoWindow = new google.maps.InfoWindow({
          content: content
        });
        infoWindow.open(this.map, marker);
      });
    }
  }
