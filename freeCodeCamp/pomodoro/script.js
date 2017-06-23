var CountDown = function(sec, tickCallback, timesUpCallback) {
  const MAX_SEC = 5999;
  var setSeconds = sec;
  validateSetSeconds(); // change it to a suitable value if necessary
  var seconds = setSeconds;
  console.log(seconds);
  var timerID = null;
  var tickCallback = tickCallback;
  var timesUpCallback = timesUpCallback;
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
  };

  function validateSetSeconds() {
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

function getTimeFormat(sec) {
  // return seconds in MM:SS format
  var minutes = Math.floor(sec / 60);
  minutes = minutes < 10 ? '0'+ minutes : minutes;
  var seconds = sec % 60;
  seconds = seconds < 10 ? '0'+ seconds : seconds;

  return minutes + ":" + seconds;
}

// for testing
window.onload = function(){
  var testSec = 5;
  document.getElementById('timer').innerHTML = getTimeFormat(testSec);

  var myCountDown = new CountDown(testSec, updateDisplay, timesUp);
  myCountDown.start();

  function updateDisplay(sec) {
    document.getElementById('timer').innerHTML = getTimeFormat(sec);
  }

  function timesUp() {
    document.getElementById('timesup').innerHTML = "Time's up!"
  }

};
