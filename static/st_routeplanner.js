var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

$(document).ready(function() {
	
	function initialize() {
		directionsDisplay = new google.maps.DirectionsRenderer();
		var map = new google.maps.Map(document.getElementById('map_canvas'),myOptions);
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById('directions-panel'));
	        
	    var infowindow = new google.maps.InfoWindow({
	        content: contentString,
	        maxWidth: 300
	    });
	
	    var marker = new google.maps.Marker({
	        position: myLatlng,
	        map: map
	    });
	    
	    google.maps.event.addListener(marker, 'click', function() {
	      infowindow.open(map,marker);
	    });
	    
	    $('#st_routeplanner_submit').live('click',function(e){
			if($('#st_routeplanner_start').val()) {
				infowindow.close(map,marker);
				marker.setMap(null);
			}
		});
		
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
      
	$('#st_routeplanner_submit').live('click',function(e){
		if($('#st_routeplanner_start').val()) {
			calcRoute($('#st_routeplanner_start').val(),$('#st_routeplanner_end').html());
		}
	});
	
	$('#st_routeplanner_start').bind('focus', function() {
		oldValue = $(this).val();
		$(this).val('');
	});
	
	$('#st_routeplanner_start').bind('blur', function() {
		newValue = $(this).val();
		if (newValue == '') {
			$(this).val(oldValue);
		}
	});
	
	$('#st_routeplanner_start').keypress(function(e){
		if(e.which == 13){
       		calcRoute($('#st_routeplanner_start').val(),$('#st_routeplanner_end').html());
       	}
	});

	
});