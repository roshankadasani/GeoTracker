/*
  Noe Rojas
  Created October 14, 2016
  Modified October 28, 2016
  CPSC 476 Front End Web Engineering
  This code was referenced from Google maps API:
  https://developers.google.com/maps/documentation/javascript/geolocation
*/

// Global variable (JS object) to pass the users coordinates from JS generated HTML
// to the server using the POST method at line
var pos;

function init() {

  // Creates a new Google Map with default coords.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 16
  });

  // Creates a new information window, contents for the info window,
  // and red marker for the position.
  var infoWindow;
  var infoWindowContents;
  var redMarker;

  // Using HTML5's GeoLocation API
  // This will check if the users accepts geolocation settings.
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function(position) {

      // Gather latitude and longitude coordinates
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Inserts a message and geo coords of the user.
      // Also creates a button to send the user's info to the FBI.
      infoWindowContents = '<h2>You have been located!</h2>' +
        '<p>Latitude: ' + pos.lat + '</p>' +
        '<p>Longitude: ' + pos.lng + '</p>' +
        '<textarea id="textbox" rows=4 cols=39>Enter your message</textarea>' +
        '<p><input class="btn btn-primary" type="submit" id="giantMess" onclick=sendInfo() value="Send To FBI" /></p>';

      infoWindow = new google.maps.InfoWindow({
        content: infoWindowContents
      });

      redMarker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Click Me'
      });

      redMarker.addListener('click', function() {
        infoWindow.open(map, redMarker);
      });

      // Set the coordinates in the information window
      infoWindow.setPosition(pos);
      map.setCenter(pos);

      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });

  }
  else {
    // Browser doesn't support Geolocation.
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}
// Appends a script tag to the HTML document
// This is to separate the JS from HTML.
function loadGoogleScript() {
  var myScript = document.createElement('script');
  myScript.src = 'http://maps.googleapis.com/maps/api/js?key=AIzaSyCDu1j-5rGFm1JyXdu6U3Y3YxNJ9fh_784&callback=init'
  document.body.appendChild(myScript);
}

window.onload = loadGoogleScript;

// Sending Information to the Server.
var sendInfo = function() {
  // Grabing users postion and message.
  var message = $('#textbox').val();
  pos.message = message;

  $.ajax(
  {
    url: '/',
    type: 'post',
    dataType: 'json',
    data: JSON.stringify({"lat": pos.lat, "lng": pos.lng, "msg": pos.message }),
    contentType: 'application/json',
    success: function(data)
    {
      console.log("Server responded");
      alert(data.result);
      $("#textbox").val("");
    }
  })
};

$('#sendFBI').on('click', function() {
  sendInfo();
});
