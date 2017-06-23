var CountDown = function(sec, tickCallback, timesUpCallback) {
  const MAX_SEC = 5999;
  var setSeconds = sec;
  validateSetSeconds(); // change it to a suitable value if necessary
  var seconds = setSeconds;
  var timerID = null;
  var tickCallback = tickCallback;
  var timesUpCallback = timesUpCallback;
  var alarmOn = false;
  const INTERVAL = 1000;

  this.set = function(sec) {
    if (!timerID) { // can't set it while it's running
      setSeconds = sec;
      validateSetSeconds();
      seconds = setSeconds;
    }
  };

  this.start = function() {
    if (!timerID) {
      // if timer has just gone off, reset it to the previously set time
      if (seconds <= 0) {
        seconds = setSeconds;
      }
      timerID = setInterval(tick, INTERVAL);
    }
  };

  this.stop = function() {
    stop();
    alarmOn = false;
  };

  this.isRunning = function() {
    return timerID != null;
  };

  this.isAlarmOn = function() {
    return alarmOn;
  };

  this.getSetSeconds = function() {
    return setSeconds;
  };

  function validateSetSeconds() {
    setSeconds = Math.floor(setSeconds); // in case a float was passed in
    if (setSeconds < 0) {
      setSeconds = 0;
    }
    else if (setSeconds > MAX_SEC) {
      setSeconds = MAX_SEC;
    }
  }

  function tick() {
    seconds--;
    if (seconds <= 0) {
      seconds = 0; // don't display negative values
      timesUpCallback();
      alarmOn = true;
      stop();
    }
    tickCallback(seconds);
  }

  function stop(){
    if (timerID) {
      clearInterval(timerID);
      timerID = null;
    }
  }
};

function getMinutesAndSeconds(sec) {
  // return seconds in MM:SS format
  var minutes = Math.floor(sec / 60);
  minutes = minutes < 10 ? '0'+ minutes : minutes;
  var seconds = sec % 60;
  seconds = seconds < 10 ? '0'+ seconds : seconds;

  return [minutes, seconds];
}

function toSeconds(minutes, seconds) {
  return minutes * 60 + seconds;
}

function getSuitableMinutes(min) {
  if (min < 0) {
    return 0;
  }
  else if (min > 99) {
    return 99;
  }
  return min;
}

function getSuitableSeconds(sec) {
  if (sec < 0) {
    return 0;
  }
  else if (sec > 59) {
    return 59;
  }
  return sec;
}

$(document).ready(function() {

  var alarm = document.getElementById("alarm");
  var alarmIntervalID;
  function flashTimer() {
    $(".display").stop().css("color", "yellow").animate({color: "black"}, 1000, stopFlash);
  }

  function stopFlash() {
    $(".display").removeAttr('style'); // this works as I do not define styles in the html file
  }

  var updateDisplay = function(sec) {
    var time = getMinutesAndSeconds(sec);
    $("#minutes").val(time[0]);
    $("#seconds").val(time[1]);
  };

  var timesUp = function() {
    alarm.play();
    flashTimer();
    alarmIntervalID = setInterval(flashTimer, 1000);
  };

  var myCountDown = new CountDown(toSeconds(25,0), updateDisplay, timesUp);

  $(".time-input").focusin(function(event) {
    alarm.pause(); // if it's not playing, this won't do anything
    clearInterval(alarmIntervalID);
    myCountDown.stop();
  });

  $(".time-input").focusout(function(event) {
    var minutes = parseInt($("#minutes").val());
    var seconds = parseInt($("#seconds").val());

    if (!minutes) {
      minutes = 0;
    }
    if (!seconds) {
      seconds = 0;
    }

    minutes = getSuitableMinutes(minutes);
    seconds = getSuitableSeconds(seconds);

    var sec = minutes * 60 + seconds;
    updateDisplay(sec);
    myCountDown.set(sec);
  });

  $("#start-stop-button").click(function(event) {
    if (myCountDown.isAlarmOn()) {
      alarm.pause();
      clearInterval(alarmIntervalID);
      myCountDown.stop();
      updateDisplay(myCountDown.getSetSeconds());
    }
    else if (myCountDown.isRunning()) {
      myCountDown.stop();
    }
    else {
      myCountDown.start();
    }
  });

});
