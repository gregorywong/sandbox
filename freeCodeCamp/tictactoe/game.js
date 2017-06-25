var Game = function(animateWin, displayWinningMessage, displayTiedMessage) {
  var board;
  var p1, p2; // symbols that each has picked
  var currPlayer;
  var animateWin = animateWin;
  var displayWinningMessage = displayWinningMessage;
  var displayTiedMessage = displayTiedMessage;

  this.init = function(isSinglePlayer, p1sym) {
    board = new Board();
    if (p1sym == 'x') {
      p1 = 'x';
      p2 = 'o';
    }
    else {
      p1 = 'o';
      p2 = 'x';
    }
    currPlayer = p1;
  };

  this.makeMove = function(row, col) {
    var valid = board.makeMove(currPlayer, row, col);
    if (!valid){
      return false;
    }

    if (board.getWinner()) { // there is a winner
      // display winning animation
      animateWin(winner.slice(1)); // flash the three winning squares

      // display winning message
      var currPlayerNum = currPlayer == p1 ? '1' : '2';
      displayWinningMessage(currPlayerNum);
    }
    else if (board.isFull()) {
      displayTiedMessage();
    }
    // switch to other player's turn
    currPlayer = currPlayer == p1 ? p2 : p1;
    return true;
  };

  this.getGrid = function() {
    return board.getGrid();
  };

  this.currPlayerSymbol = function() {
    return currPlayer;
  };
};
