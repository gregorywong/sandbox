// User Story: I can play a game of Tic Tac Toe with the computer.
// User Story: My game will reset as soon as it's over so I can play again.
// User Story: I can choose whether I want to play as X or O.

var Board = function() {
  var grid;
  const ROWS = 3;
  const COLS = 3;
  const SPACES = ROWS * COLS;
  var count = 0;
  init();

  this.makeMove = function(player, row, col) {
    // player is either 'x' or 'o'
    // row and col are 1 based
    // return false if problems encountered, else true
    if (player != 'x' && player != 'o') {
      console.error("player must have value of either 'x' or 'o'");
      return false;
    }
    if (row < 1 || row > ROWS || col < 1 || col > COLS) {
      console.error("row and col given are either smaller than 1 or more than what is allowed");
      return false;
    }
    var i = getGridIndex(row, col);
    if (grid[i] != null) {
      return false;
    }
    grid[i] = player;
    count++;
    return true;
  };

  this.getGrid = function() {
    return grid.slice(); // return a copy so that it can't be modified
  };

  this.clear = function() {
    init();
  };

  this.isFull = function() {
    return count >= SPACES;
  };

  this.getWinner = function() {
    // if no winner, return null
    // if has winner, return [winner, index1, index2, index3]

    var winner = getFullRows();
    if (winner) {
      return winner;
    }
    winner = getFullCols();
    if (winner) {
      return winner;
    }
    winner = getFullDiagonals();
    if (winner) {
      return winner;
    }
    return null;
  };


  function init() {
    grid = Array(ROWS*COLS).fill(null);
  }

  function getGridIndex(row, col) {
    return(row-1)*COLS + (col-1);
  }

  function getFullRows() {
    // only for 3 elements
    for (var i = 0; i < ROWS; i++) {
      var i1 = i * COLS;
      var i2 = i * COLS + 1;
      var i3 = i * COLS + 2;
      if (grid[i1] != null && grid[i1] == grid[i2] && grid[i2] == grid[i3]) {
        return [grid[i1], i1, i2, i3];
      }
    }
    return null;
  }

  function getFullCols() {
    // only for 3 elements
    for (var i = 0; i < COLS; i++) {
      var i1 = i;
      var i2 = i + COLS;
      var i3 = i + 2*COLS;
      if (grid[i1] != null && grid[i1] == grid[i2] && grid[i2] == grid[i3]) {
        return [grid[i1], i1, i2, i3];
      }
    }
    return null;
  }

  function getFullDiagonals(){
    // only for 3 elements
    var i1 = 0;
    var i2 = COLS + 1;
    var i3 = 2*COLS + 2;
    if (grid[i1] != null && grid[i1] == grid[i2] && grid[i2] == grid[i3]) {
      return [grid[i1], i1, i2, i3];
    }
    var i1 = COLS - 1;
    var i2 = 2*COLS - 2;
    var i3 = 3*COLS - 3;
    if (grid[i1] != null && grid[i1] == grid[i2] && grid[i2] == grid[i3]) {
      return [grid[i1], i1, i2, i3];
    }
    return null;
  }

};
