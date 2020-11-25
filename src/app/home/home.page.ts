import { Component, ElementRef, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})

export class HomePage {

	map: google.maps.Map;
	myPosition: google.maps.LatLng;

	@ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
	constructor(private geolocation: Geolocation) { }

	ionViewWillEnter() {
		this.showMap();
	}

	showMap() {
		const position = new google.maps.LatLng(-15.79902, -47.86075);
		const options = {
			center: position,
			zoom: 1,
			disableDefaultUi: true
		}
		this.map = new google.maps.Map(this.mapRef.nativeElement, options);
		this.findPosition();
		/*
		new google.maps.Marker({
		   position: position,
		   map: this.map,
		   title:'Planalto',
		   animation: google.maps.Animation.BOUNCE			 
		});
		*/
	}



	findPosition() {
		this.geolocation.getCurrentPosition().then((resp) => {
			this.myPosition = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
			this.goToMyPosition();
		}).catch((error) => {
			console.log("Error", error);
		});
	}

	goToMyPosition() {
		this.map.setCenter(this.myPosition);
		this.map.setZoom(15);

		new google.maps.Marker({
			position: this.myPosition,
			map: this.map,
			title: 'Minha Posição',
			animation: google.maps.Animation.BOUNCE
		});
	}
}