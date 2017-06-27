var Board = function() {
  const ROWS = 3;
  const COLS = 3;
  var grid = Array(ROWS*COLS).fill(null);

  const SPACES = ROWS * COLS;
  var turns;

  var wins;

  var p1, p2, currPlayer;

  this.init = function(p1sym) {
    init(p1sym);
  };

  this.getCurrentPlayer = function() {
    return currPlayer;
  };

  this.makeMove = function(index) {
    // currPlayer is either 'x' or 'o'
    // index is from 0 - 8
    // return false if problems encountered, else true
    if (p1 == undefined) {
      console.error("init() not called yet");
      return false;
    }
    if (isFull() || hasWinner()) {
      console.error("game over, call init() again");
      return false;
    }
    if (index < 0 || index > 8) {
      console.error("index should be a number between 0 and 8 (inclusive)");
      return false;
    }
    if (grid[index] != null) { // if grid is already occupied
      return false;
    }
    grid[index] = currPlayer;
    updateWinner();
    turns++;
    // switch to other player's turn
    currPlayer = currPlayer == p1 ? p2 : p1;
    return true;
  };

  this.getGrid = function() {
    return grid.slice(); // return a copy so that it can't be modified
  };

  this.isFull = function() {
    return isFull();
  };

  this.getWinner = function() {
    return wins;
  };

  this.getP1Symbol = function() {
    return p1;
  }

  function init(p1sym) {
    turns = 0;
    wins = [];
    grid.fill(null);
    if (p1sym == 'o') {
      p1 = 'o';
      p2 = 'x';
    }
    else {
      p1 = 'x';
      p2 = 'o';
    }
    currPlayer = p1;
  }

  function updateWinner () {
    // if no winner, wins is []
    // if has winner, wins is [ [winner, index1, index2, index3], ... ]

    var winner = getFullRows();
    if (winner) {
      wins.push(winner);
    }
    winner = getFullCols();
    if (winner) {
      wins.push(winner);
    }
    winner = getFullDiagonals();
    if (winner) {
      wins.push(winner);
    }
  }

  function hasWinner() {
    return wins.length > 0;
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

  function isFull() {
    return turns >= SPACES;
  }
};
