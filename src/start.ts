import { RootService } from "typexpress"
import appConfig from "appConfig"

RootService.Start(appConfig)






/*

// https://developers.google.com/maps/documentation/javascript/examples/map-coordinates
const TILE_SIZE = 256
function project(lat, lng) {
	let siny = Math.sin((lat * Math.PI) / 180);

	// Truncating to 0.9999 effectively limits latitude to 89.189. This is
	// about a third of a tile past the edge of the world tile.
	siny = Math.min(Math.max(siny, -0.9999), 0.9999);

	return {
		x: TILE_SIZE * (0.5 + lng / 360),
		y: TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
	}
}


//https://stackoverflow.com/a/1020202/5224029
MAP_WIDTH = 1000;
MAP_HEIGHT = 446;

function convert(lat, lon){
    var y = ((-1 * lat) + 90) * (MAP_HEIGHT / 180);
    var x = (lon + 180) * (MAP_WIDTH / 360);
    return {x:x,y:y};
}

// https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = 
	  Math.sin(dLat/2) * Math.sin(dLat/2) +
	  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	  Math.sin(dLon/2) * Math.sin(dLon/2)
	  ; 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
  }
  
  function deg2rad(deg) {
	return deg * (Math.PI/180)
  }

//https://www.geodatasource.com/developers/javascript
  function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}
*/