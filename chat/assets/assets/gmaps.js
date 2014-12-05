// convert Google Maps into an AMD module
//https://maps.googleapis.com/maps/api/js?key=AIzaSyAbkLQWFiicJzJJUfHkSDEtSzyJoxKWuV4
define('gmaps', ['async!http://maps.google.com/maps/api/js?v=3&sensor=false'],
function(){
    // return the gmaps namespace for brevity
    return window.google.maps;
});