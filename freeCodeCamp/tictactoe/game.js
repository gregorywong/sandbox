var Game = function(animateMakeMove, animateWin, displayMessage) {
  var board = new Board();
  var animateMakeMove = animateMakeMove;
  var animateWin = animateWin;
  var displayMessage = displayMessage;

  var aiModeOn;

  this.init = function(isSinglePlayer, p1sym) {
    board.init(p1sym);
    aiModeOn = isSinglePlayer;
  };

  this.makeMove = function(index) {
    if (board.getCurrentPlayer() == undefined) {
      console.error("init() not called yet");
      return false;
    }
    makeMove(index); // returns true for valid move

    if (aiModeOn) {
      AIMove();
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
      displayMessage("It was a tie!");
    }
    return true;
  }

  function AIMove(){
    // right now, it only picks the next empty spot
    // TODO: make it a proper strategy later on
    var grid = board.getGrid();
    var nextMove;
    for (var i = 0; i < grid.length; i++) {
      if (grid[i] == null) {
        nextMove = i;
        break;
      }
    }
    makeMove(nextMove, true);
  }
};
