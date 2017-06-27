var Game = function(animateMakeMove, animateWin, displayMessage, pauseAnimation) {
  var board = new Board();
  var animateMakeMove = animateMakeMove;
  var animateWin = animateWin;
  var displayMessage = displayMessage;
  var pauseAnimation = pauseAnimation;

  var waiting;
  var aiModeOn;
  var ai = new AI();

  this.init = function(isSinglePlayer, p1sym) {
    board.init(p1sym);
    aiModeOn = isSinglePlayer;
    if (aiModeOn) {
      ai.init();
    }
    waiting = true;
  };

  this.makeMove = function(index) {
    index = parseInt(index);
    if (waiting) { // don't do anything if it's already running
      if (board.getCurrentPlayer() == undefined) {
        console.error("init() not called yet");
        return false;
      }
      waiting = false;
      if (!makeMove(index)){
        // returns false for invalid move
        // don't continue if invalid
        waiting = true;
        return false;
      }

      if (aiModeOn) {
        var wins = board.getWinner();
        if (wins.length <= 0 && !board.isFull()){
          pauseAnimation(function() {
            var nextMove = ai.getNextMove(index);
            makeMove(nextMove, true);
            waiting = true;
          });
        }
      }
      else {
        waiting = true;
      }
    }
  };

  this.getGrid = function() {
    return board.getGrid();
  };

  this.currPlayerSymbol = function() {
    return currPlayer;
  };

  function makeMove(index, byAI=false) {
    var currPlayer = board.getCurrentPlayer();
    var valid = board.makeMove(index);
    if (!valid){
      return false;
    }
    else {
      animateMakeMove(currPlayer, index);
    }

    var wins = board.getWinner();
    if (wins.length > 0) { // there is a winner
      for (let winCombo of wins) {
        // display winning animation
        animateWin(winCombo.slice(1)); // flash the three winning squares
      }
      // display winning message with name as argument
      var name;
      if (byAI) {
        name = "Computer";
      }
      else {
        name = wins[0][0] == board.getP1Symbol() ? "Player 1" : "Player 2";
      }
      var message = name + " won!";
      displayMessage(message);
    }
    else if (board.isFull()) {
      displayMessage("It's a tie!");
    }
    return true;
  }
};
