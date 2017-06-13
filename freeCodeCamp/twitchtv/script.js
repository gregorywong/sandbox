var users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];

function getJSONcallback(onSuccess, param){
  // onSuccess should take two parameters, json and param
  // return a function that only takes in one parameter, json
  return (function(json){
    onSuccess(json, param);
  });
}

$(document).ready(function() {
  // initialize page
  getStream();

  // add listeners
  $("button#refresh").click(function(){
    $("div#search-results").empty();
    $("p#message").text("Loading...");
    getStream();
  });
});

function getStream() {
  $.each(users, function(index, user){
    var url = "https://wind-bow.glitch.me/twitch-api/streams/" + user + "?callback=?";

    $.getJSON(url).done(getJSONcallback(getStreamDone, user)).fail(function(){
      $("p#message").text("Failed to make request. Try again later!");
    });
  });
}

function getStreamDone(json, user){
  $("p#message").text("");
  var stream = json.stream;
  if (stream == null){
    // check to see if user is offline, closed their account, or doesn't exist
    getChannel(user);
  }
  else { // found available stream
    var channel = stream.channel;

    var html = '<a href="' + channel.url + '" class="list-group-item content-entry container w-100" target="_blank"><div class="row w-100"><div class="col-3 col-md-2 my-auto text-center"><img class="rounded-circle" height="60" src="' + channel.logo + '" alt="" /><br><span><strong>' + channel.display_name +'</strong></span></div><div class="hidden-sm-down col-md-3 my-auto text-center"><img width="100%" src="' + stream.preview.medium + '" alt="" /> </div><div class="col-9 col-md-7 my-auto text-center text-success"><span>' + channel.status + '</span></div></div></a>';

    $("div#search-results").append(html);
  }
}

function getChannel(user){
  var url = "https://wind-bow.glitch.me/twitch-api/channels/" + user + "?callback=?";
  $.getJSON(url).done(getJSONcallback(getChannelDone, user)).fail(function(){
    $("p#message").text("Failed to make request. Try again later!");
  });
}

function getChannelDone(json, user) {
  var channel_url, channel_logo, display_name, message;
  var text_red = "";
  var outer = "div"; // use div if there is no valid link, i.e., if user has closed account or user not found
  if (json.error == null){
    // user is only offline

    display_name = json.display_name;
    channel_logo = json.logo;
    channel_url = json.url;
    message = "User is offline";
    outer = "a";
  }
  else if (json.error != null && json.status == 422) {
    // user has closed their account
    display_name = user;
    channel_logo = null;
    channel_url = "#";
    message = "User has closed their Twitch account";
    text_red = " text-red";
  }
  else if (json.error != null && json.status == 404) {
    // user not found
    display_name = user;
    channel_logo = null;
    channel_url = "#";
    message = "User doesn't exist!";
    text_red = " text-red";
  }

  if (channel_logo == null){
    channel_logo = "https://placehold.it/60x60";
  }

  var html = '<' + outer +' href="' + channel_url + '" class="list-group-item content-entry container w-100" target="_blank"><div class="row w-100"><div class="col-3 col-md-2 my-auto text-center"><img class="rounded-circle" height="60" src="' + channel_logo + '" alt="" /><br><span><strong>' + display_name +'</strong></span></div><div class="hidden-sm-down col-md-3 my-auto text-center"></div><div class="col-9 col-md-7 my-auto text-center' + text_red + '"><span>' + message + '</span></div></div></' + outer + '>';

  $("div#search-results").append(html);
}

$('div#search-results').on('click', 'a.content-entry',function(){
  // without this, the selected entry stays highlighted
  $(this).blur();
});
