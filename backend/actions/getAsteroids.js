var https = require('https');

var THRESHOLD = 3000000;

function getAsteroids(userLat, userLng) {
  return new Promise(function(resolve, reject) {
    var today = new Date();
    var sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate()+7);
    var todayMonth = today.getMonth()+1 < 10 ? '0' + today.getMonth()+1 : today.getMonth()+1;
    var sevenDaysLaterMonth = sevenDaysLater.getMonth()+1 < 10 ? '0' + sevenDaysLater.getMonth()+1 : sevenDaysLater.getMonth()+1;
    
    var start = today.getFullYear() + '-' + todayMonth + '-' + today.getDate();
    console.log(start);
    var end = sevenDaysLater.getFullYear() + '-' + sevenDaysLaterMonth + '-' + sevenDaysLater.getDate();
    https.get('https://api.nasa.gov/neo/rest/v1/feed?start_date='+start+'&end_date='+end+'&api_key=Tv6gAKvEQVPyIf0KwDIHRQXRuJ17XQYIEETD2e35', function (res, err) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        var asteroids = JSON.parse(body).near_earth_objects[start];
        console.log(asteroids);
        var closestAsteroid = getClosestAsteroid(asteroids);
        var missDistance = asteroids[i].close_approach_data[0].miss_distance.miles;

        // COMPARE TO THE THRESHOLD
        var cleanName = closestAsteroid.replace('(', '').replace(')', '');
        resolve("Asteroid " + cleanName + " is the closest asteroid to Earth today. It is " + missDistance + " miles from Earth.");

      });
    });
  })
}

module.exports = getAsteroids;

/**
 * HELPERS
 */

// EXPAND TO FACTOR SIZE INTO ACCOUNT

function getClosestAsteroid(asteroids) {
  var result;
  for (var i = 0; i < asteroids.length; i++) {
    if (!result) {
      result = asteroids[i];
    } else {
      if (asteroids[i].close_approach_data[0].miss_distance.miles < result.close_approach_data[0].miss_distance.miles) {
        result = asteroids[i];
      }
    }
  }
  return result;
}