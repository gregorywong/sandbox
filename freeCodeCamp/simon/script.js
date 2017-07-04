var strictMode = false;
// TODO:
// var gameStarted = false;
var gameStarted = true;
const FLASH_TIME = 500; // milliseconds

$(document).ready(function() {

  // strict mode listener
  $("#strict-mode").change(function() {
    strictMode = $(this).prop("checked");
  });

  // start button listener
  $("#start-button").click(function(event) {
    flashToggle(); // show an animation
    gameStarted = true;
    setTimeout(function() {
      flashToggle(); // turn off flashing
      // all color buttons are set to unclickable at first, so activate them
      toggleClickableButtons();
    }, 2000); // stop the animation

    // TODO: counter
    // TODO: start sound
  });

  // color button listeners
  $(".color-button").click(function(event) {
    if (gameStarted) {
      var color = $(this).attr("id");

      toggleClickableButtons();
      flash(color,toggleClickableButtons);

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

function toggleClickableButtons() {
  $(".color-button").toggleClass('unclickable');
}

function flash(color, callback) {
  $('#'+color).addClass(color+'-flash');
  setTimeout(function() {
    $('#'+color).removeClass(color+'-flash');
    if (callback) {
      callback();
    }
  }, FLASH_TIME);
}
