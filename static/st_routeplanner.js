var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

$(document).ready(function() {

	function initialize() {

		/**
		 * get Mapsettings by id
		 */
		if($('.tx-strouteplanner-pi1').length > 0) {

			$('.tx-strouteplanner-pi1').each(function(){

				mapid = $(this).parent().attr('id');
				latlng = $('#' + mapid + '_latlng').val().split(',');
				zoom = $('#' + mapid + '_zoom').val();
				maptype = $('#' + mapid + '_maptype').val();
				infotext = $('#' + mapid + '_infotext').val();
				bubbletitle = $('#' + mapid + '_bubbletitle').val();

				myLatlng = new google.maps.LatLng(latlng[0],latlng[1]);
				myOptions = {
					position: myLatlng,
					zoom: parseInt(zoom),
					mapTypeId: maptype,
					center: myLatlng
				};

				map = new google.maps.Map(document.getElementById(mapid + '_map_canvas'), myOptions);

				infowindow = new google.maps.InfoWindow({
					content: '<div class="bubble_content">' + infotext + '</div>',
					maxWidth: 300
				});

				marker = new google.maps.Marker({
					position: myLatlng,
					map: map,
					title: bubbletitle
				});
				marker.set("id", mapid);

				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map,marker);
				});
			});
		}
	}

	function calcRoute(start,end) {
		var request = {
			origin: start,
			destination: end,
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		};
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			}
		});
	}

	initialize();

	/**
	 * start calculate the route
	 */
	$(document).on('click', '.st_routeplanner_submit', function (e) {
		thisid = $(this).attr('id').split('_');
		if($('#' + thisid[0] + '_st_routeplanner_start').val()) {
			calcRoute($('#' + thisid[0] + '_st_routeplanner_start').val(),$('#' + thisid[0] + '_latlng').val());
			directionsDisplay = new google.maps.DirectionsRenderer();
			map = new google.maps.Map(document.getElementById(thisid[0] + '_map_canvas'), myOptions);
			directionsDisplay.setMap(map);
			directionsDisplay.setPanel(document.getElementById(thisid[0] + '_directions-panel'));
		}
	});

	/**
	 * start calculate by press enter
	 */
	$('.st_routeplanner_start').keypress(function(e){
		thisid = $(this).attr('id').split('_');
		if(e.which == 13){
			calcRoute($('#' + thisid[0] + 'st_routeplanner_start').val(),$('#' + thisid[0] + 'st_routeplanner_end').html());
		}
	});
});