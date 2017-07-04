var strictMode = false;
var awaitingInput = true;

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
    if (awaitingInput) {
      var color = $(this).attr("id");
      // TODO: remove logging
      console.log(color);
      // TODO: play sound
    }
  });
});

function setCount(num) {
  $("#count").val(num);
}

function flashToggle() {
  $("#green").toggleClass('flash-green');
  $("#red").toggleClass('flash-red');
  $("#blue").toggleClass('flash-blue');
  $("#yellow").toggleClass('flash-yellow');
}

function disableButtons() {
  // awaitingInput should also be false
  $(".color-button").addClass('unclickable');
}
