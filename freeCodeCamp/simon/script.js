var strictMode = false;
const FLASH_DURATION = 500; // milliseconds
var count = 0;

$(document).ready(function() {


  // strict mode listener
  $("#strict-mode").change(function() {
    strictMode = $(this).prop("checked");
  });

  // start button listener
  $("#start-button").click(function(event) {
    count = 0;
    $("#count").val("--");

    // TODO: start sound
    flashToggle(); // show an animation
    setTimeout(function() {
      flashToggle(); // turn off flashing
      count++;
    }, 2000); // stop the animation

    roundStart(); // display flash animation and "progress to" to level 1
  });

  // color button listeners
  $(".color-button").click(function(event) {
    var color = $(this).attr("id");

    disableClickableButtons();
    flash(color, function() {
      // TODO: check if correct
      // if correct and already entered everything
      // roundPassed();
      // if incorrect
      // incorrectReaction();
    });

  });
});

function setCount(num) {
  if (isNaN(num)) {
    console.error('count should be a number')
  }
  else {
    if (num < 9) { // only 1 digit
      num = '0' + num;
    }
    $("#count").val(num);
  }
}

function flashToggle() {
  $("#green").toggleClass('flash-green');
  $("#red").toggleClass('flash-red');
  $("#blue").toggleClass('flash-blue');
  $("#yellow").toggleClass('flash-yellow');
}

function enableClickableButtons() {
  $(".color-button").removeClass('unclickable');
}

function disableClickableButtons() {
  $(".color-button").addClass('unclickable');
}

function flash(color, callback) {
  // TODO: play corresponding sound
  $('#'+color).addClass(color+'-flash');
  setTimeout(function() {
    $('#'+color).removeClass(color+'-flash');
    if (callback) {
      callback();
    }
  }, FLASH_DURATION);
}

function toggleCountBoxColor() {
  $(".count-box").toggleClass('text-red');
}

function roundStart() {
  setTimeout(function() { // wait one second

    // TODO: play sequence

    // all color buttons are set to unclickable at first, so activate them
    enableClickableButtons();

  }, 1000);
}

function roundPassed() {
  disableClickableButtons();

  // TODO: play round passed sound

  flashToggle(); // show an animation
  setTimeout(function() {
    count++;
    if (count > 20) {
      // TODO: play victory sound

      setTimeout(function() {
        flashToggle(); // turn off flashing

        // game effectively resets at this point
        count = 0;
        $("#count").val("--");
      }, 2000);
    }
    else {
      flashToggle(); // turn off flashing
      setCount(count);
      toggleCountBoxColor();
      setTimeout(function() {
        toggleCountBoxColor();
      }, 1000);

      // TODO: randomly generate sequence

      roundStart();
    }

  }, 2000); // stop the animation
}

function incorrectReaction() {
  disableClickableButtons();

  $("#green").addClass('blink-green');
  $("#red").addClass('blink-red');
  $("#blue").addClass('blink-blue');
  $("#yellow").addClass('blink-yellow');

  // TODO: play buzzer sound

  setTimeout(function() {
    $("#green").removeClass('blink-green');
    $("#red").removeClass('blink-red');
    $("#blue").removeClass('blink-blue');
    $("#yellow").removeClass('blink-yellow');

    if (strictMode) {
      count = 0;
      $("#count").val("--");
    }
    else {
      roundStart();
    }
  }, 1500);
}
