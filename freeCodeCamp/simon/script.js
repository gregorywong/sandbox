var strictMode = false;

$(document).ready(function() {

  // strict mode listener
  $("#strict-mode").change(function() {
    strictMode = $(this).prop("checked");
  });

  // start button listener
  $("#start-button").click(function(event) {
    // TODO:
  });

  // color button listeners
  $(".color-button").click(function(event) {
    var color = $(this).data("color");
    // TODO: 
    console.log(color);
  });

});

function setCount(num) {
  $("#count").val(num);
}
