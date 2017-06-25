runBoardTests();

/* Test suite */
function runBoardTests() {

  const TESTS = [
    {
      name: "test starting state",
      testFunc: function(board) {
        // nothing
        return board.getGrid();
      },
      expected: [null, null, null, null, null, null, null, null, null],
    },
    {
      name: "test clear()",
      testFunc: function(board) {
        board.clear();
        return board.getGrid();
      },
      expected: [null, null, null, null, null, null, null, null, null],
    },
    {
      name: "test making one move",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 1, 1);
        return board.getGrid();
      },
      expected: ['x', null, null, null, null, null, null, null, null],
    },
    {
      name: "test making multiple moves",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 1, 1);
        board.makeMove('x', 1, 2);
        board.makeMove('x', 1, 3);
        return board.getGrid();
      },
      expected: ['x', 'x', 'x', null, null, null, null, null, null],
    },
    {
      name: "test making multiple moves with two players",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 1, 1);
        board.makeMove('o', 1, 2);
        board.makeMove('x', 2, 1);
        board.makeMove('o', 2, 2);
        return board.getGrid();
      },
      expected: ['x', 'o', null, 'x', 'o', null, null, null, null],
    },
    {
      name: "test no winner",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 1, 1);
        board.makeMove('x', 1, 2);
        return board.getWinner();
      },
      expected: null,
    },
    {
      name: "test winner for full row 1",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 1, 1);
        board.makeMove('x', 1, 2);
        board.makeMove('x', 1, 3);
        return board.getWinner();
      },
      expected: ['x', 0, 1, 2],
    },
    {
      name: "test winner for full row 2",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 2, 1);
        board.makeMove('x', 2, 2);
        board.makeMove('x', 2, 3);
        return board.getWinner();
      },
      expected: ['x', 3, 4, 5],
    },
    {
      name: "test winner for full row 3",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 3, 1);
        board.makeMove('o', 2, 1);
        board.makeMove('x', 3, 2);
        board.makeMove('o', 2, 2);
        board.makeMove('x', 3, 3);
        return board.getWinner();
      },
      expected: ['x', 6, 7, 8]
    },
    {
      name: "test winner for full col 1",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 1, 1);
        board.makeMove('x', 2, 1);
        board.makeMove('x', 3, 1);
        return board.getWinner();
      },
      expected: ['x', 0, 3, 6]
    },
    {
      name: "test winner for full col 2",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 1, 2);
        board.makeMove('x', 2, 2);
        board.makeMove('x', 3, 2);
        return board.getWinner();
      },
      expected: ['x', 1, 4, 7]
    },
    {
      name: "test winner for full col 3",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 1, 3);
        board.makeMove('x', 2, 3);
        board.makeMove('x', 3, 3);
        return board.getWinner();
      },
      expected: ['x', 2, 5, 8]
    },
    {
      name: "test winner for full diagonal top left",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 1, 1);
        board.makeMove('x', 2, 2);
        board.makeMove('x', 3, 3);
        return board.getWinner();
      },
      expected: ['x', 0, 4, 8]
    },
    {
      name: "test winner for full diagonal top right",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 1, 3);
        board.makeMove('x', 2, 2);
        board.makeMove('x', 3, 1);
        return board.getWinner();
      },
      expected: ['x', 2, 4, 6]
    },
    {
      name: "test isFull",
      testFunc: function(board) {
        board.clear();
        board.makeMove('x', 1, 1);
        board.makeMove('x', 1, 2);
        board.makeMove('x', 1, 3);
        board.makeMove('x', 2, 1);
        board.makeMove('x', 2, 2);
        board.makeMove('x', 2, 3);
        board.makeMove('x', 3, 1);
        board.makeMove('x', 3, 2);
        board.makeMove('x', 3, 3);
        return board.isFull();
      },
      expected: true
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
    (testResult == expectedResult) ||
    (testResult.length == expectedResult.length && testResult.every((v,i) => v === expectedResult[i])))) {
      errorCount++;
      console.error('Failed test ' + testCount + ' of ' + TESTS.length + ': ' + testObj.name);
      console.log("Expected: " + expectedResult);
      console.log("Got: " + testResult);
    }
  }
  console.log('Finished running ' + TESTS.length + ' tests with a total of ' + errorCount + ' errors.');

};
