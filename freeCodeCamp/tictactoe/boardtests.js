runBoardTests();

/* Test suite */
function runBoardTests() {

  const TESTS = [
    {
      name: "test init('x')",
      testFunc: function(board) {
        board.init('x');
        return board.getGrid();
      },
      expected: [null, null, null, null, null, null, null, null, null],
    },
    {
      name: "test making one move",
      testFunc: function(board) {
        board.init('x');
        board.makeMove(1, 1); // x
        return board.getGrid();
      },
      expected: ['x', null, null, null, null, null, null, null, null],
    },
    {
      name: "test making multiple moves",
      testFunc: function(board) {
        board.init('x');
        board.makeMove(1, 1); // x
        board.makeMove(1, 2); // o
        board.makeMove(1, 3); // x
        return board.getGrid();
      },
      expected: ['x', 'o', 'x', null, null, null, null, null, null],
    },
    {
      name: "test making multiple moves - test 2",
      testFunc: function(board) {
        board.init('x');
        board.makeMove(1, 1); // x
        board.makeMove(1, 2);
        board.makeMove(2, 1); // x
        board.makeMove(2, 2);
        return board.getGrid();
      },
      expected: ['x', 'o', null, 'x', 'o', null, null, null, null],
    },
    {
      name: "test no winner",
      testFunc: function(board) {
        board.init('x');
        board.makeMove(1, 1); // x
        board.makeMove(1, 2);
        return board.getWinner();
      },
      expected: [],
    },
    {
      name: "test winner for full row 1",
      testFunc: function(board) {
        board.init('x');
        board.makeMove(1, 1); // x
        board.makeMove(2, 1);
        board.makeMove(1, 2); // x
        board.makeMove(2, 2);
        board.makeMove(1, 3); // x
        return board.getWinner();
      },
      expected: [['x', 0, 1, 2],]
    },
    {
      name: "test winner for full row 2",
      testFunc: function(board) {
        board.init('o');
        board.makeMove(2, 1); // o
        board.makeMove(1, 1);
        board.makeMove(2, 2); // o
        board.makeMove(1, 2);
        board.makeMove(2, 3); // o
        return board.getWinner();
      },
      expected: [['o', 3, 4, 5],]
    },
    {
      name: "test winner for full row 3",
      testFunc: function(board) {
        board.init('x');
        board.makeMove(3, 1); // x
        board.makeMove(2, 1);
        board.makeMove(3, 2); // x
        board.makeMove(2, 2);
        board.makeMove(3, 3); // x
        return board.getWinner();
      },
      expected: [['x', 6, 7, 8]]
    },
    {
      name: "test winner for full col 1",
      testFunc: function(board) {
        board.init('x');
        board.makeMove(1, 1); // x
        board.makeMove(1, 2);
        board.makeMove(2, 1); // x
        board.makeMove(2, 2);
        board.makeMove(3, 1); // x
        return board.getWinner();
      },
      expected: [['x', 0, 3, 6]]
    },
    {
      name: "test winner for full col 2",
      testFunc: function(board) {
        board.init('x');
        board.makeMove(1, 2); // x
        board.makeMove(1, 1);
        board.makeMove(2, 2); // x
        board.makeMove(2, 1);
        board.makeMove(3, 2); // x
        return board.getWinner();
      },
      expected: [['x', 1, 4, 7]]
    },
    {
      name: "test winner for full col 3",
      testFunc: function(board) {
        board.init('x');
        board.makeMove(1, 3); // x
        board.makeMove(1, 1);
        board.makeMove(2, 3); // x
        board.makeMove(2, 1);
        board.makeMove(3, 3); // x

        return board.getWinner();
      },
      expected: [['x', 2, 5, 8]]
    },
    {
      name: "test winner for full diagonal top left",
      testFunc: function(board) {
        board.init('x');
        board.makeMove(1, 1); // x
        board.makeMove(1, 3);
        board.makeMove(2, 2); // x
        board.makeMove(2, 3);
        board.makeMove(3, 3); // x
        return board.getWinner();
      },
      expected: [['x', 0, 4, 8]]
    },
    {
      name: "test winner for full diagonal top right",
      testFunc: function(board) {
        board.init('x');
        board.makeMove(1, 3); // x
        board.makeMove(1, 1);
        board.makeMove(2, 2); // x
        board.makeMove(2, 1);
        board.makeMove(3, 1); // x
        return board.getWinner();
      },
      expected: [['x', 2, 4, 6]]
    },
    {
      name: "test isFull",
      testFunc: function(board) {
        board.init('x');
        board.makeMove(1, 1); // x
        board.makeMove(1, 2);
        board.makeMove(1, 3); // x
        board.makeMove(2, 1);
        board.makeMove(2, 3); // x
        board.makeMove(2, 2);
        board.makeMove(3, 1); // x
        board.makeMove(3, 3);
        board.makeMove(3, 2); // x
        return board.isFull();
      },
      expected: true
    },
  ];

  var testBoard = new Board();
  testBoard.init('x');

  var testCount = 0;
  var errorCount = 0;

  for (let testObj of TESTS) {
    testCount++;

    console.log('Running test ' + testCount + ' of ' + TESTS.length + ': ' + testObj.name);
    var testResult = testObj.testFunc(testBoard);
    var expectedResult = testObj.expected;
    var failed = false;

    if ((testResult == null && expectedResult == null) || testResult == expectedResult) {
      // do nothing
    }
    else if (testResult.length == expectedResult.length) {
      if (testResult[0] != null && typeof testResult[0] == "object" && testResult[0].hasOwnProperty("length")) { // testResult should be an array
        for (var i = 0; i < testResult.length; i++) {
          var testWin = testResult[i];
          var expectedWin = expectedResult[i];
          if (!testWin.every((v,i) => v === expectedWin[i])) {
            failed = true;
            break;
          }
        }
      }
      else { //testResult elements are likely not arrays
        if (!testResult.every((v,i) => v === expectedResult[i])) {
          failed = true;
        }
      }
    }
    else {
      failed = true;
    }

    if (failed) {
      errorCount++;
      console.error('Failed test ' + testCount + ' of ' + TESTS.length + ': ' + testObj.name);
      console.log("Expected: " + expectedResult);
      console.log("Got: " + testResult);
    }
  }
  console.log('Finished running ' + TESTS.length + ' tests with a total of ' + errorCount + ' errors.');

};
