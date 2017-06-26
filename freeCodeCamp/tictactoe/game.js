var Game = function(animateWin, displayWinningMessage, displayTiedMessage) {
  var board = new Board();
  var animateWin = animateWin;
  var displayWinningMessage = displayWinningMessage;
  var displayTiedMessage = displayTiedMessage;

  var aiModeOn;

  this.init = function(isSinglePlayer, p1sym) {
    board.init(p1sym);
    aiModeOn = isSinglePlayer;
  };

  this.makeMove = function(row, col) {
    if (board.getCurrentPlayer() == undefined) {
      console.error("init() not called yet");
      return false;
    }

    var valid = board.makeMove(row, col);
    if (!valid){
      return false;
    }

    var wins = board.getWinner();
    if (wins.length > 0) { // there is a winner
      for (let winCombo of wins) {
        // display winning animation
        animateWin(winCombo.slice(1)); // flash the three winning squares
      }
      // display winning message
      displayWinningMessage(wins[0][0]);
    }
    else if (board.isFull()) {
      displayTiedMessage();
    }
    return true;
  };

  this.getGrid = function() {
    return board.getGrid();
  };

  this.currPlayerSymbol = function() {
    return currPlayer;
  };
};
