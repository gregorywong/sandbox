var CountDown = function(sec, tickCallback, timesUpCallback) {
  var setSeconds = sec < 0 ? 0 : sec;
  var seconds = setSeconds;
  var timerID = null;
  var tickCallback = tickCallback;
  var timesUpCallback = timesUpCallback;
  const INTERVAL = 1000;

  this.set = function(sec) {
    if (!timerID) { // can't set it while it's running
      setSeconds = sec < 0 ? 0 : sec; // can't set it to less than 0
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

// for testing
window.onload = function(){
  var testSec = 5;
  document.getElementById('seconds').innerHTML = testSec;

  var myCountDown = new CountDown(testSec, updateDisplay, timesUp);
  myCountDown.start();

  function updateDisplay(sec) {
    document.getElementById('seconds').innerHTML = sec;
  }

  function timesUp() {
    alert('times up');
  }

};
