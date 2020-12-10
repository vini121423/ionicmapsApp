import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})

export class HomePage {

	private direction = new google.maps.DirectionsService();
	private directionsRender = new google.maps.DirectionsRenderer();
	private autocomplete = new google.maps.places.AutocompleteService
	map: google.maps.Map;
	myPosition: google.maps.LatLng;
	listAddress: any = [];

	@ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
	constructor(private geolocation: Geolocation,
		private ngZone: NgZone) { }

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

	findPlaces(event: any) {
		const busca = event.target.value as string;
		if (!busca.trim().length) {
			this.listAddress = [];
			return false;
		}

		this.autocomplete.getPlacePredictions({ input: busca }, (localArrays, status) => {

			if (status == 'OK') {
				this.ngZone.run(() => {
					this.listAddress = localArrays;
				});
			} else {
				this.listAddress = [];
			}
		});
	}

	public createRoute(local: google.maps.places.AutocompletePrediction) {
		this.listAddress = [];

		new google.maps.Geocoder().geocode({ address: local.description }, resultado => {
			//this.map.setCenter(resultado[0].geometry.location);
			//this.map.setZoom(19);

			const route: google.maps.DirectionsRequest = {
				origin: this.myPosition,
				destination: resultado[0].geometry.location,
				unitSystem: google.maps.UnitSystem.METRIC,
				travelMode: google.maps.TravelMode.DRIVING

			};

			this.direction.route(route, (result, status) => {
				if (status == 'OK') {
					this.directionsRender.setMap(this.map);
					this.directionsRender.setDirections(result);
					this.directionsRender.setOptions({ suppressMarkers: true })
				}
			});

			const maker = new google.maps.Marker({
				position: resultado[0].geometry.location,
				title: resultado[0].formatted_address,
				animation: google.maps.Animation.DROP,
				map: this.map

			})
		})
	}
}