// User Story: I can play a game of Tic Tac Toe with the computer.
// User Story: My game will reset as soon as it's over so I can play again.
// User Story: I can choose whether I want to play as X or O.

var Board = function () {
  var grid;
  const ROWS = 3;
  const COLS = 3;
  init();

  this.makeMove = function (player, row, col) {
    // player is either 'a' or 'b'
    // row and col are 1 based
    // return either 1 or 2, or null if no winner after that move
    if (player != 'a' && player != 'b') {
      console.error("player must have value of either 'a' or 'b'");
      return null;
    }
    if (row < 1 || row > ROWS || col < 1 || col > COLS) {
      console.error("row and col given are either smaller than 1 or more than what is allowed");
      return null;
    }
    var i = getGridIndex(row, col);
    if (grid[i] == null) {
      grid[i] = player;
    }

    return getWinner(); // null if no winner
  };

  this.getGrid = function () {
    return grid.slice(); // return a copy so that it can't be modified
  };

  this.clear = function () {
    init();
  };

  function init() {
    grid = Array(ROWS*COLS).fill(null);
  }

  function getGridIndex(row, col) {
    return (row-1)*COLS + (col-1);
  }

  function getWinner() {
    // return either 'a' or 'b', or null if no winner
    var winner = getFullRows();
    if (winner) {
      return winner;
    }
    winner = getFullCols();
    if (winner) {
      return winner;
    }
    // TODO: winning checks for columns and diagonals

    return null;
  }

  function getFullRows() {
    // only for 3 elements
    for (var i = 0; i < grid.length; i+=COLS) {
      var playerAt1 = grid[i];
      var playerAt2 = grid[i+1];
      var playerAt3 = grid[i+2];
      if (playerAt1 != null && playerAt1 == playerAt2 && playerAt2 == playerAt3) {
        return [playerAt1, i, i+1, i+2];
      }
    }
    return null;
  }

  function getFullCols() {
    // only for 3 elements
    for (var i = 0; i < ROWS; i++) {
      var playerAt1 = grid[i];
      var playerAt2 = grid[i + COLS];
      var playerAt3 = grid[i + 2*COLS];
      if (playerAt1 != null && playerAt1 == playerAt2 && playerAt2 == playerAt3) {
        return [playerAt1, i, i+COLS, i+2*COLS];
      }
    }
    return null;
  }

};

runTests();

/* Test suite */
function runTests() {

  const TESTS = [
    {
      name: "test starting state",
      testFunc: function (board) {
        // nothing
        return board.getGrid();
      },
      expected: [null, null, null, null, null, null, null, null, null],
    },
    {
      name: "test clear()",
      testFunc: function (board) {
        board.clear();
        return board.getGrid();
      },
      expected: [null, null, null, null, null, null, null, null, null],
    },
    {
      name: "test making one move",
      testFunc: function (board) {
        board.clear();
        board.makeMove('a', 1, 1);
        return board.getGrid();
      },
      expected: ['a', null, null, null, null, null, null, null, null],
    },
    {
      name: "test making multiple moves",
      testFunc: function (board) {
        board.clear();
        board.makeMove('a', 1, 1);
        board.makeMove('a', 1, 2);
        board.makeMove('a', 1, 3);
        return board.getGrid();
      },
      expected: ['a', 'a', 'a', null, null, null, null, null, null],
    },
    {
      name: "test making multiple moves with two players",
      testFunc: function (board) {
        board.clear();
        board.makeMove('a', 1, 1);
        board.makeMove('b', 1, 2);
        board.makeMove('a', 2, 1);
        board.makeMove('b', 2, 2);
        return board.getGrid();
      },
      expected: ['a', 'b', null, 'a', 'b', null, null, null, null],
    },
    {
      name: "test no winner",
      testFunc: function (board) {
        board.clear();
        var winResult = null;
        winResult = board.makeMove('a', 1, 1);
        winResult = board.makeMove('a', 1, 2);
        return winResult;
      },
      expected: null,
    },
    {
      name: "test winner for full row 1",
      testFunc: function (board) {
        board.clear();
        var winResult = null;
        winResult = board.makeMove('a', 1, 1);
        winResult = board.makeMove('a', 1, 2);
        winResult = board.makeMove('a', 1, 3);
        return winResult;
      },
      expected: ['a', 0, 1, 2],
    },
    {
      name: "test winner for full row 2",
      testFunc: function (board) {
        board.clear();
        var winResult = null;
        winResult = board.makeMove('a', 2, 1);
        winResult = board.makeMove('a', 2, 2);
        winResult = board.makeMove('a', 2, 3);
        return winResult;
      },
      expected: ['a', 3, 4, 5],
    },
    {
      name: "test winner for full row 3",
      testFunc: function (board) {
        board.clear();
        var winResult = null;
        winResult = board.makeMove('a', 3, 1);
        winResult = board.makeMove('b', 2, 1);
        winResult = board.makeMove('a', 3, 2);
        winResult = board.makeMove('b', 2, 2);
        winResult = board.makeMove('a', 3, 3);
        return winResult;
      },
      expected: ['a', 6, 7, 8]
    },
    {
      name: "test winner for full col 1",
      testFunc: function (board) {
        board.clear();
        var winResult = null;
        winResult = board.makeMove('a', 1, 1);
        winResult = board.makeMove('a', 2, 1);
        winResult = board.makeMove('a', 3, 1);
        return winResult;
      },
      expected: ['a', 0, 3, 6]
    },
    {
      name: "test winner for full col 2",
      testFunc: function (board) {
        board.clear();
        var winResult = null;
        winResult = board.makeMove('a', 1, 2);
        winResult = board.makeMove('a', 2, 2);
        winResult = board.makeMove('a', 3, 2);
        return winResult;
      },
      expected: ['a', 1, 4, 7]
    },
    {
      name: "test winner for full col 3",
      testFunc: function (board) {
        board.clear();
        var winResult = null;
        winResult = board.makeMove('a', 1, 3);
        winResult = board.makeMove('a', 2, 3);
        winResult = board.makeMove('a', 3, 3);
        return winResult;
      },
      expected: ['a', 2, 5, 8]
    },
  ];

  var testBoard = new Board();
  var testCount = 0;
  var errorCount = 0;

  for (let testObj of TESTS) {
    testCount++;

    console.log('Running test ' + testCount + ' of ' + TESTS.length + ': ' + testObj.name);
    var testResult = testObj.testFunc(testBoard);
    var expectedResult = testObj.expected;
    if (!((expectedResult == null && testResult == expectedResult) ||
    (testResult.length == expectedResult.length && testResult.every((v,i) => v === expectedResult[i])))) {
      errorCount++;
      console.error('Failed test ' + testCount + ' of ' + TESTS.length + ': ' + testObj.name);
      console.log("Expected: " + expectedResult);
      console.log("Got: " + testResult);
    }
  }
  console.log('Finished running ' + TESTS.length + ' tests with a total of ' + errorCount + ' errors.');

};
