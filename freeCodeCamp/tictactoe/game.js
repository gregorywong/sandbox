var Game = function(animateMakeMove, animateWin, displayWinningMessage, displayTiedMessage) {
  var board = new Board();
  var animateMakeMove = animateMakeMove;
  var animateWin = animateWin;
  var displayWinningMessage = displayWinningMessage;
  var displayTiedMessage = displayTiedMessage;

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

    AIMove();
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
      animateMakeMove(currPlayer);
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
        name = wins[0][0] == getP1Symbol() ? "Player 1" : "Player 2";
      }
      displayWinningMessage(name);
    }
    else if (board.isFull()) {
      displayTiedMessage();
    }
    return true;
  }

  function AIMove(){
    // TODO: make it not random later on
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
