var AI = function() {
  // assume computer is always p2
  var grid;
  var firstMove, secondMove, thirdMove;
  var center_oppositeCorner;
  var corner_oppositeEdges, corner_oppositeCorner;
  var edge_oppositeEdge, edge_adjacentEdges, edge_oppositeCorners;
  const WINNING_COMBOS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  const CORNERS = [0,2,6,8];
  const EDGES = [1,3,5,7];
  const OPPOSITES = [8,7,6,5,4,3,2,1,0];
  const CORNER_OPPOSITE_EDGES = {
    0: [5,7],
    2: [3,7],
    6: [1,5],
    8: [1,3],
  };
  const EDGE_ADJACENT_EDGES = {
    1: [3,5],
    3: [1,7],
    5: [1,7],
    7: [3,5],
  };
  const EDGE_OPPOSITE_CORNERS = {
    1: [6,8],
    3: [2,8],
    5: [0,6],
    7: [0,2],
  };
  const EDGE_ADJACENT_CORNERS = {
    1: [0,2],
    3: [0,6],
    5: [2,8],
    7: [6,8],
  };
  const EDGE_ADJACENT_OPPOSITE_EDGE = {
    1: {
      6:5,
      8:3,
    },
    3: {
      2:7,
      8:1,
    },
    5: {
      0:7,
      6:1,
    },
    7: {
      0:5,
      2:3,
    },
  };

  this.init = function() {
    grid = Array(9).fill(null);
    firstMove = null;
    secondMove = null;
    thirdMove = null;
    center_oppositeCorner = null;
    corner_oppositeEdge = null;
    corner_oppositeCorner = null;
    edge_oppositeEdge = null;
    edge_adjacentEdge = null;
    edge_oppositeCorner = null;
  };

  this.getNextMove = function(p1move) {
    grid[p1move] = 1;
    var nextMove;
    if (firstMove == null) { // if it's not defined
      firstMove = p1move;
      secondMove = getSecondMove();
      nextMove = secondMove;
    }
    else if (thirdMove == null) { // if it's not defined
      thirdMove = p1move;
      nextMove = getFourthMove();
    }
    else { // 6th or 8th move of the game
      nextMove = conquerAndBlockOrRandom();
    }
    grid[nextMove] = 2;
    return nextMove;
  };

  function getSecondMove() {
    if (firstMove == 4) { // center
      // place in corner
      var secondMove = chooseOneAvailable(CORNERS);
      oppositeCorner = OPPOSITES[secondMove];
      return secondMove;
    }
    else if (CORNERS.includes(firstMove)) {
      corner_oppositeEdges = CORNER_OPPOSITE_EDGES[firstMove]
      corner_oppositeCorner = OPPOSITES[firstMove];
    }
    else { // EDGES.includes(firstMove)
      edge_adjacentEdges = EDGE_ADJACENT_EDGES;
      edge_oppositeCorners = EDGE_OPPOSITE_CORNERS;
      edge_oppositeEdge = OPPOSITES[firstMove];
    }
    return 4; // return 4 for both corner and edge cases
  }

  function getFourthMove() {
    var fourthMove;

    if (firstMove == 4 && thirdMove == oppositeCorner) {
      fourthMove = chooseOneAvailable(CORNERS);
    }
    else if (CORNERS.includes(firstMove)) {
      if (CORNER_OPPOSITE_EDGES[firstMove].includes(thirdMove)) {
        fourthMove = corner_oppositeCorner;
      }
      else if (thirdMove == corner_oppositeCorner) {
        fourthMove = chooseOneAvailable(EDGES);
      }
    }
    else if (EDGES.includes(firstMove)) {
      if (thirdMove == edge_oppositeEdge) {
        fourthMove = chooseOneAvailable(CORNERS);
      }
      else if (EDGE_OPPOSITE_CORNERS[firstMove].includes(thirdMove)) {
        fourthMove = EDGE_ADJACENT_OPPOSITE_EDGE[firstMove][thirdMove];
      }
      else if (EDGE_ADJACENT_EDGES[firstMove].includes(thirdMove)) {
        fourthMove = chooseOneAvailable(EDGE_ADJACENT_CORNERS[firstMove]);
      }
    }

    if (fourthMove == null) {
      fourthMove = conquerAndBlockOrRandom();
    }
    return fourthMove;
  }

  function getWinningMove(player) {
    // player should be either 1 or 2
    for (let combo of WINNING_COMBOS) {
      if (grid[combo[0]] == player && grid[combo[1]] == player && grid[combo[2]] == null) {
        return combo[2];
      }
      else if (grid[combo[0]] == player && grid[combo[1]] == null && grid[combo[2]] == player) {
        return combo[1];
      }
      else if (grid[combo[0]] == null && grid[combo[1]] == player && grid[combo[2]] == player) {
        return combo[0];
      }
    }
    return null;
  }

  function chooseOneAvailable(indices) {
    var emptyIndices = indices.filter(function(val){
      return grid[val] == null;
    });
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  function conquerAndBlockOrRandom() {
    var nextMove;
    // conquer
    nextMove = getWinningMove(2);
    if (nextMove != null) {
      return nextMove;
    }
    // block
    nextMove = getWinningMove(1);
    if (nextMove != null) {
      return nextMove;
    }
    // nextMove == null
    return getRandomMove();
  }

  function getRandomMove() {
    var emptyIndices =
    grid.map(function(val, index){
      if (val == null) return index;
    }).filter(function(val){
      return val != undefined;
    });

    return chooseOneAvailable(emptyIndices);
  }

};
