/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var APIKEY = '42dac2166e14ee89e7260188b1f308d3';
var CITY = '95054';
var URL = 'http://api.openweathermap.org/data/2.5/forecast/?q=' + CITY+ '&appId=' + APIKEY;
var UI = require('ui');
var ajax = require('ajax');

var Vector2 = require('vector2');

// var card = new UI.Card({
//   title: 'Weather',
//   subtitle: 'Fetching...'
// });

// card.show();

var splashWindow = new UI.Window();
var text = new UI.Text({
  position: new Vector2(0,0),
  size: new Vector2(144, 168),
  text: 'Downloading weather data...',
  font: 'GOTHIC_28_BOLD',
  color: 'black',
  textOverflow: 'wrap',
  textAlign: 'center',
  backgroundColor: 'white'
});

splashWindow.add(text);
splashWindow.show();

var parseFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    var title = data.list[i].weather[0].main;
    
    var time = data.list[i].dt_txt;
    time = time.substring(time.indexOf('-') + 1, time.indexOf(':') + 3);
    
    items.push({
      title: title,
      subtitle: time
    });
  }
  return items;
};

function toF(K) {
 return Math.round((K - 273.15) * 1.8 + 32) + '°F';
}

var success = function (data) {
  console.log('success!');
  
  //var location = data.name;

  //(K - 273.15)* 1.8000 + 32.00
  //var temperature = Math.round((data.main.temp - 273.15) * 1.8 + 32) + 'F';
  //var desc = data.weather[0].description;
//   card.subtitle(location + ', ' + temperature);
//   card.body(desc);
  var menuItems = parseFeed(data, 10);
//   for(var i = 0; i < menuItems.length; i++) {
//     console.log(menuItems[i].title + ' | ' + menuItems[i].subtitle);
//   }
  var resultsMenu = new UI.Menu({
    sections: [{
      title: 'Current Forecast',
      items: menuItems
    }]
  });
  
  resultsMenu.on('select', function (e) {
    var idx = e.itemIndex;
    var forecast = data.list[idx];
    var content = forecast.weather[0].description;
    content += 
      '\nTemperature: ' + toF(forecast.main.temp) +
      '\nPressure: ' + Math.round(forecast.main.pressure) + ' mbar' +
      '\nWind: ' + Math.round(forecast.wind.speed) + ' mph, ' +
      Math.round(forecast.wind.deg) + '°';
    var detailCard = new UI.Card({
      title: 'Details',
      subtitle: e.item.subtitle,
      body: content
    });
    detailCard.show();
  });
  
  resultsMenu.show();
  splashWindow.hide();
};

ajax(
  {
    url: URL,
    type: 'json'
  },
  success,
  function (error) {
    console.error('error!', error);
  }
);