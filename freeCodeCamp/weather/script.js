var temp_c;
var temp_f;
var latitude = 0;
var longitude = 0;
var api_key = "15c08d171d227697cbfaf9ad60abb6ff";

$(document).ready(function() {
  $("#status_message").effect("slide", function(){
    $(this).effect("bounce");
  });
  getLocation();
});

$("input#is-celsius").change(updateTempDisplay);

$("button#refresh").click(getWeather);

$("input#latitude").focusout(function(){
  var val = $(this).val();
  var match = val.match(/^[-]?\d*[.]?\d*$/);

  // check that these conditions are met
  // value should have at most one period (.) and one minus sign (-)
  // value shoud be between -90 and 90
  if ((match != null) && (val == match[0]) && (-90 <= val && val <= 90)){
    latitude = val;
  }
  else {
    // reset back to previous value
    $(this).val(latitude);
  }
});

$("input#longitude").focusout(function(){
  var val = $(this).val();
  var match = val.match(/^[-]?\d*[.]?\d*$/);

  // check that these conditions are met
  // value should have at most one period (.) and one minus sign (-)
  // value shoud be between -180 and 180
  if ((match != null) && (val == match[0]) && (-180 <= val && val <= 180)){
    longitude = val;
  }
  else {
    // reset back to previous value
    $(this).val(longitude);
  }
});

function updateTempDisplay(){
  var isCelsius = $("input#is-celsius").prop("checked");

  if (isCelsius){
    $('h1#temperature').text(temp_c + "°C");
  }
  else {
    $('h1#temperature').text(temp_f + "°F");
  }

}

function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      getLocationSuccess,
      function(error){
        if (error.code == error.PERMISSION_DENIED){
          $("#status_message").text("Could not get geolocation.").effect("shake");
        }
      }
    );
  }
  else {
    $("#status_message").text("Geolocation is not supported by this browser.").effect("shake");
  }
}

function getLocationSuccess(position){
  $("input#latitude").val(position.coords.latitude);
  $("input#longitude").val(position.coords.longitude);

  getWeather();
}

function getWeather(){
  $("#status_message").text("Getting weather...").effect("slide", function(){
    $(this).effect("bounce");
  });
  latitude = $("input#latitude").val();
  longitude = $("input#longitude").val();

  var url = "https://api.darksky.net/forecast/" + api_key + "/"+ latitude +"," + longitude + "?callback=?";

  $.getJSON(url).done(getWeatherDone).fail(getWeatherFail);
}

function getWeatherFail(jqXHR, textStatus, errorThrown){
  $("#status_message").text("There seems to be a problem. Try again later!").effect("shake");
  temp_c = "-";
  temp_f = "-";
  updateTempDisplay();
}

function getWeatherDone(json){
  temp_f = json.currently.temperature;
  temp_c = (temp_f - 32) / 1.8;
  temp_c = Math.round(temp_c * 100) / 100; // round to 2 decimal places
  updateTempDisplay();
  changeIcon(json.currently.icon);

  $("#status_message").text("");
}

function changeIcon(icon){
  var class_str;

  switch (icon) {
    case "clear-day":
    class_str = "wi-day-sunny";
    break;

    case "clear-night":
    class_str = "wi-night-clear";
    break;

    case "rain":
    class_str = "wi-rain";
    break;

    case "snow":
    class_str = "wi-snowflake-cold";
    break;

    case "sleet":
    class_str = "wi-sleet";
    break;

    case "wind":
    class_str = "wi-strong-wind";
    break;

    case "fog":
    class_str = "wi-fog";
    break;

    case "cloudy":
    class_str = "wi-cloudy";
    break;

    case "partly-cloudy-day":
    class_str = "wi-day-cloudy";
    break;

    case "partly-cloudy-night":
    class_str = "wi-night-alt-cloudy";
    break;

    default:
    class_str = "wi-small-craft-advisory";
  }

  class_str += " pb-4 wi icon-large";

  $("i#weather-icon").removeClass().addClass(class_str);
}
