const FLASH_DURATION = 1000; // milliseconds
const INT_TO_COLOR = {
  1: 'green',
  2: 'red',
  3: 'blue',
  4: 'yellow',
};

// TODO: set to 20
const MAX_COUNT = 3;

var green, red, blue, yellow;
var nextRound, victory, buzzer;

var strictMode = false;
var count = 0;
var sequenceOfCurrRound = [];
var userRequiredSequence = [];

$(document).ready(function() {

  green = document.getElementById("green-audio");
  red = document.getElementById("red-audio");
  blue = document.getElementById("blue-audio");
  yellow = document.getElementById("yellow-audio");
  nextRound = document.getElementById('next-round');
  victory = document.getElementById('victory');
  buzzer = document.getElementById('buzzer');

  // strict mode listener
  $("#strict-mode").change(function() {
    strictMode = $(this).prop("checked");
  });

  // start button listener
  $("#start-button").click(function(event) {
    sequenceOfCurrRound = [];
    count = 1;
    setCount(count);
    toggleCountBoxColor();
    setTimeout(function() {
      toggleCountBoxColor();
    }, 500);

    nextRound.play();
    flashToggle(); // show an animation
    setTimeout(function() {
      flashToggle(); // turn off flashing

      addToRandomSequence();
      roundStart();
    }, 1500); // stop the animation
  });

  // color button listeners
  $(".color-button").click(function(event) {
    var color = $(this).attr("id");

    disableClickableButtons();
    flash(color, function() {
      var correctColor = INT_TO_COLOR[userRequiredSequence.shift()];
      if (color == correctColor) {
        if (userRequiredSequence.length <= 0) {
          setTimeout(roundPassed, 1000);
        }
        else {
          enableClickableButtons();
        }
      }
      else {
        incorrectReaction();
      }
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
  $('#'+color).addClass('blink-'+color);
  eval(color).play();

  setTimeout(function() {
    $('#'+color).removeClass('blink-'+color);
    if (callback) {
      callback();
    }
  }, FLASH_DURATION);
}

function toggleCountBoxColor() {
  $(".count-box").toggleClass('text-red');
}

function roundStart() {
  setTimeout(function() {
    // last func to be called as a callback
    // all color buttons are set to unclickable at first, so activate them
    var funcChain = enableClickableButtons;
    var wait = 0;

    for (var i = sequenceOfCurrRound.length - 1; i >= 0; i--) {
      let color = INT_TO_COLOR[sequenceOfCurrRound[i]];
      let prevFunc = funcChain;
      let prevWait = wait;
      let func = function() {
        flash(color, function() {
          setTimeout(prevFunc, prevWait);
        });
      };
      funcChain = func;
      wait = 500;
    }

    funcChain();

  }, 500);
}

function roundPassed() {
  disableClickableButtons();

  count++;
  if (count > MAX_COUNT) {
    victory.play();

    flashToggle();
    setTimeout(function() {
      flashToggle(); // turn off flashing

      // game effectively resets at this point
      count = 0;
      $("#count").val("--");
      victory.pause();
      victory.currentTime = 0;
    }, 10000);
  }
  else {
    nextRound.play();

    setCount(count);
    toggleCountBoxColor();
    setTimeout(function() {
      toggleCountBoxColor();
    }, 500);

    flashToggle(); // show an animation
    setTimeout(function() {
      flashToggle(); // turn off flashing

      addToRandomSequence(); // add one more
      roundStart();
    }, 1500); // stop the animation
  }
}

function addToRandomSequence() {
  sequenceOfCurrRound.push(Math.floor(Math.random()*4 + 1));
  userRequiredSequence = sequenceOfCurrRound.slice();
}

function incorrectReaction() {
  disableClickableButtons();

  $("#green").addClass('blink-green');
  $("#red").addClass('blink-red');
  $("#blue").addClass('blink-blue');
  $("#yellow").addClass('blink-yellow');

  buzzer.play();

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
      userRequiredSequence = sequenceOfCurrRound.slice();
      roundStart();
    }
  }, 1500);
}
