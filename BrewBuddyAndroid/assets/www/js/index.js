// Data storage

// TODO brewing company header over brews

var BARS = [
		{
			name : "Mulvaney&apos;s B&amp;L",
			lat : 38.568166,
			lon : -121.443043,
			stock : [
					"Sierra Nevada Ovila Abbey Quad | Sierra Nevada Brewing Company",
					"Scrimshaw Pilsner Style Beer | North Coast Brewing Co",
					"Heroine India Pale Ale | 101 North Brewing Company" ],
			description : "1215 19th St, Sacramento, CA<br />(916) 441-6022<br />mulvaneysbl.com"
		},
		{
			name : "DeVere&apos;s Irish Pub",
			lat : 38.576058,
			lon : -121.486729,
			stock : [ "Sierra Nevada Pale Ale | Sierra Nevada Brewing Company",
					"Lagunitas IPA | Lagunitas Brewing Company",
					"Firestone Walkers Reserve | Firestone Walker Brewing Company" ],
			description : "1531 L St, Sacramento, CA<br />(916) 231-9947<br />deverespub.com"
		},
		{
			name : "Old Soul at the Weatherstone",
			lat : 38.589504,
			lon : -121.486816,
			stock : [ "West Coast IPA | Green Flash Brewing Company",
					"Irish Red Ale | Rubicon Brewing Company", ],
			description : "812 21st St, Sacramento, CA<br />(916) 443-6340<br />oldsoulco.com"
		} ,
		{
			name : "Faces Inc",
			lat : 38.575212,
			lon : -121.48025,
			stock : [ "Pyramid Hefeweizen | Pyramid Breweries"],
			description : "2000 K St, Sacramento, CA 95811"
		} ,
		{
			name : "Badlands Dance Club",
			lat : 38.575632,
			lon : -121.4801,
			stock : [ "Pyramid Hefeweizen | Pyramid Breweries"],
			description : "2003 K St, Sacramento, CA 95811"
		} ,
		{
			name : "Old Tavern Bar & Grill",
			lat : 38.570901,
			lon : -121.482589,
			stock : [ "Pyramid Hefeweizen | Pyramid Breweries"],
			description : "1510 20th St, Sacramento, CA 95811"
		} 		
		
		];

var CURRENT_LOCATION_LAT_KEY = "CURRENT_LOCATION_LAT_KEY";

var CURRENT_LOCATION_LON_KEY = "CURRENT_LOCATION_LON_KEY";

var SELECTED_BREW_KEY = "SELECTED_BREW_KEY";

Storage.prototype.setObject = function(key, value) {
	this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key, defaultValue) {
	var value = this.getItem(key);
	if (null === value) {
		return defaultValue;
	}
	return JSON.parse(value);
};

function getSelectedBrew() {
	return localStorage.getItem(SELECTED_BREW_KEY);
}

function setSelectedBrew(newValue) {
	return localStorage.setItem(SELECTED_BREW_KEY, newValue);
}

function getCurrentLocationLat() {
	return localStorage.getItem(CURRENT_LOCATION_LAT_KEY);
}

function setCurrentLocationLat(newValue) {
	return localStorage.setItem(CURRENT_LOCATION_LAT_KEY, newValue);
}

function getCurrentLocationLat() {
	return localStorage.getItem(CURRENT_LOCATION_LAT_KEY);
}

function setCurrentLocationLat(newValue) {
	return localStorage.setItem(CURRENT_LOCATION_LAT_KEY, newValue);
}

function getCurrentLocationLon() {
	return localStorage.getItem(CURRENT_LOCATION_LON_KEY);
}

function setCurrentLocationLon(newValue) {
	return localStorage.setItem(CURRENT_LOCATION_LON_KEY, newValue);
}

// Utils

function distance(lat1, lon1, lat2, lon2) {
	
	var R = 6371; // km
	var dLat = toRad((lat2-lat1));
	var dLon = toRad((lon2-lon1));
	var lat1 = toRad(lat1);
	var lat2 = toRad(lat2);

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	
	return d;
}

function kmToMiles(value) {
	return value * 1000 / 1609.344;
}

function toRad(value) {
	return value * Math.PI / 180;
}

// Behavior

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	navigator.geolocation.getCurrentPosition(onSuccess, onError);

	$('#brewList').hide();
}

function onSuccess(position) {

	setCurrentLocationLat(position.coords.latitude);
	setCurrentLocationLon(position.coords.longitude);
	
	var allBrewers = [];
	var allStocks = [];

	for ( var i = 0; i < BARS.length; i++) {
		var bar = BARS[i];
		for ( var j = 0; j < bar.stock.length; j++) {
			var stock = bar.stock[j];
			allStocks.push(stock);
			
			var pipeIndex = stock.indexOf('|');
			if ( -1 != pipeIndex ) {
				var brewer = stock.substring(pipeIndex + 2);
				if ( -1 == allBrewers.indexOf(brewer) ) {
					allBrewers.push(brewer);
				}
			}
			
		}
	}
	allBrewers.sort();
	allStocks.sort();

	$('#brewList').html(''); 
	
	for ( var i = 0; i < allBrewers.length; i++) {
		var brewer = allBrewers[i];
		

		var newListItem = '<li data-icon="myarrow"><a onclick=\'selectStock("'
				+ brewer + '")\' >' + brewer + '</a></li>';
		$('#brewList').append($(newListItem));
		
		var displayedBrews = [];
		for ( var j = 0; j < allStocks.length; j++) {
			var stock = allStocks[j];
			
			if (-1 != stock.indexOf(brewer) ) {
				
				var stockName = stock;
				var pipeIndex = stock.indexOf('|');
				if ( -1 != pipeIndex ) {
					stockName = stock.substring(0, pipeIndex);
				}

				if ( -1 == displayedBrews.indexOf(stockName) ) {
					var newListItem = '<li data-icon="myarrow"><a onclick=\'selectStock("'
						+ stock + '")\' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + stockName + '</a></li>';
					$('#brewList').append($(newListItem));			
					displayedBrews.push(stockName);
				}
			}
		}
		
	}

	$('#brewList').show();
	$('#loadingMessage').hide();

	$('#brewList').listview("refresh");

}

function selectStock(stock) {
	console.log('selected stock');
	setSelectedBrew(stock);
	window.location.href = "#barPage";
	//loadBars();
}

// onError Callback receives a PositionError object
//
function onError(error) {
	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

$(document).delegate('#barPage', 'pageshow', function () {
	loadBars();
});

function loadBars() {
	
	var userLat = getCurrentLocationLat();
	var userLon = getCurrentLocationLon();
	
	var stock = getSelectedBrew();
	
	var barsWithStock = [];
	for ( var i = 0; i < BARS.length; i++ ) {
		var bar = BARS[i];
		console.log("bar name: " + bar.name);		
		
		for( var j = 0; j < bar.stock.length; j++ ) {
			var checkedStock = bar.stock[j];
			if ( -1 != checkedStock.indexOf(stock) ) {
				
				if ( -1 == barsWithStock.indexOf(bar) ) {
					barsWithStock.push(bar);
					
					bar.id = i;
					
					var distanceKm = distance(userLat, userLon, bar.lat, bar.lon);
					var distanceMi = kmToMiles(distanceKm);
					var distanceMiRounded = Math.round(distanceMi*10)/10;
					bar.distanceMiRounded = distanceMiRounded;
				}
				
			}
		}		
	}
	
	barsWithStock.sort(function(a,b){return a.distanceMiRounded - b.distanceMiRounded});
	
	$('#barList').html(''); 
	
	for ( var i = 0; i < barsWithStock.length; i++ ) {	
		var bar = barsWithStock[i];
				
		var newListItem = '<li data-icon="myarrow"><a onclick=\'selectBar("' + bar.id + '")\' >' 
			+ bar.name + '<span class="ui-li-count">' + bar.distanceMiRounded + ' mi.</span></a></li>';		
		
		$('#barList').append($(newListItem));
		
	}
	
	$('#barList').listview("refresh");

}	

function selectBar(barIndex) {
	
	console.log('selectBar = ' + barIndex);
	window.location.href = "#detailPage";
	
	var bar = BARS[barIndex];
	
	var ll = bar.lat + "," + bar.lon;
	var url = "http://maps.google.com/?q=" + ll;

	$('#detailContent').html(''); 
	
	$('#detailContent').append(
			"<a href='" + url + "'>" + 
			bar.name + 
			"<br /><br />" + 
			bar.description + 
			"</a><br /><br />These brews are on tap:<br /><br />");
	
	for( var i = 0; i < bar.stock.length; i++ ) {
		var stock = bar.stock[i];

		$('#detailContent').append(stock + 
				"<br /><br />");
	}
	
}
