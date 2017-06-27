var AI = function() {
  // assume computer is always p2
  var grid;

  this.init = function() {
    grid = Array(9).fill(null);
  };

  this.getNextMove = function(p1move) {
    grid[p1move] = 1;
    // right now, it only picks random spots
    // TODO: make it a proper strategy later on

    var emptyIndices =
    grid.map(function(val, index){
      if (val == null) return index;
    }).filter(function(val){
      return val != undefined;
    });

    var nextMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    grid[nextMove] = 2;

    return nextMove;
  };
};
