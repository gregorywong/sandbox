$('input#search-keywords').keypress(function (e) {
    var code = e.keyCode || e.which;
    if (code === 13){
      e.preventDefault();
      searchStart();
    }
});

$('button#search-btn').click(function(){
  searchStart();
});

function searchStart(){
  $("p#message").text("");
  var keywords = $("input#search-keywords").val();
  if (keywords != ""){
    var url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=1&explaintext=1&titles=&generator=search&gsrsearch="+keywords +"&callback=?";
    $.getJSON(url).done(searchDone).fail(function(){
      $("p#message").text("Search results failed to load. Try again later!").effect("shake");
    });
  }
  else {
    $("input#search-keywords").parent().effect("shake");
  }
}

function searchDone(json){
    var entries = "";
    var pages = json.query.pages;
    for (var pageid in pages){
      var href = "https://en.wikipedia.org/wiki?curid=" + pageid ;
      var title = pages[pageid].title;
      var extract = pages[pageid].extract;
      var entry = '<a href="' + href + '" class="list-group-item content-entry" target="_blank"><h5 class="w-100">' + title + '</h5><span>' + extract + '</span></a>';
      entries = entries.concat(entry);
    }
    $("div#search-results").empty().append(entries).hide().fadeIn("slow", function() { });
}

$('div#search-results').on('click', 'a.content-entry',function(){
  // without this, the selected entry stays highlighted
  $(this).blur();
});
