var twitterLink = "";

$(document).ready(function() {
  // refreshQuote();
});

$("#generate").click(function() {
  refreshQuote();
  $('.card').effect("shake");
});

$("a.tweet").click(function() {
  window.open(twitterLink, '_blank');
});

function refreshQuote(){

  $.getJSON("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?",function(data){
    // var quote = data.quoteText.replace(/(<p>|<\/p>)/g, ""); // strip out <p> tags
    var quote = data.quoteText;
    var author = data.quoteAuthor;
    // update display
    $('#quote').text('"'+ quote + '"');
    $('#who').text(author);

    // update twitter button
    updateTwitterLink(quote, author);
  });
}

function updateTwitterLink(quote, author){
  twitterLink = "http://twitter.com/share?text="+
  '"'+quote+'" - '+author+
  "&url=https://codepen.io/gregorywong/full/GEJgXb&hashtags=quoteOfTheDay,freeCodeCamp";
}
