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
				latlng = $(this).find('#' + mapid + '_latlng').val().split(',');
				zoom = $(this).find('#' + mapid + '_zoom').val();
				maptype = $(this).find('#' + mapid + '_maptype').val();
				infotext = $(this).find('#' + mapid + '_infotext').val();

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
					map: map
				});

				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map,marker);
				});

//				$(document).on('click', '#c' + mapid + 'st_routeplanner_submit', function (e) {
//					if($('#c' + mapid + 'st_routeplanner_start').val()) {
//						infowindow.close(map,marker);
//						marker.setMap(null);
//					}
//				});
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

//	$('#st_routeplanner_start').bind('focus', function() {
//		oldValue = $(this).val();
//		$(this).val('');
//	});
//
//	$('#st_routeplanner_start').bind('blur', function() {
//		newValue = $(this).val();
//		if (newValue == '') {
//			$(this).val(oldValue);
//		}
//	});

	$('#st_routeplanner_start').keypress(function(e){
		if(e.which == 13){
			calcRoute($('#st_routeplanner_start').val(),$('#st_routeplanner_end').html());
		}
	});
});