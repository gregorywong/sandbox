var game;
var isSinglePlayer;
var p1sym;

var askNumPlayers = function() {
  $("#num-players").fadeIn();
};

var chooseP1Sym = function() {
  $("#choose-p1-sym").fadeIn();
};

var animateMakeMove = function(currPlayer, index) {
  // this refers to the gridblock
  $("#sq"+index).find('span').text(currPlayer);
};

var pauseAnimation = function(callback) {
  $("#thinking").fadeTo(200,1).delay(400).fadeTo(200, 0, callback);
};

var animateWin = function(arrCombo) {
  for (let index of arrCombo) {
    $("#sq"+index).find('span').addClass('color-win');
  }
};

var displayMessage = function(message) {
  $("#message").find("h1").text(message);
  $("#grid").delay(1000).fadeOut(400, function() {
    $("#message").fadeIn().delay(1000).fadeOut(400, letsStartOver);
  });
};

var letsStartOver = function() {
  $("#message").find("h1").text("Let's start over again.");
  $("#message").fadeIn(400, function() {
    $(this).delay(1000).fadeOut(400, askNumPlayers);
  });
};

var startGame = function() {
  game.init(isSinglePlayer, p1sym);
  $('.gridblock').find('span').removeClass('color-win').text("");
  $("#grid").fadeIn();
};

$(document).ready(function() {

  game = new Game(animateMakeMove, animateWin, displayMessage, pauseAnimation);

  // set up the 2 buttons to return either one or two players
  $('.num-players-btn').click(function() {
    var numPlayers = $(this).attr('value');
    isSinglePlayer = numPlayers == '1' ? true : false;
    $("#num-players").fadeOut(400, chooseP1Sym);
  });

  // set up the 2 buttons to return value for p1sym
  $('.choose-p1-sym-btn').click(function() {
    var sym = $(this).attr('value');
    p1sym = sym == 'x' ? 'x' : 'o';
    $("#choose-p1-sym").fadeOut(400, startGame);
  });

  $("#grid").delay(400).fadeOut(1000, askNumPlayers);
  // callback chain:
  // askNumPlayers() -> chooseP1Sym() -> startGame()

  // set up the 9 squares to listen to clicks
  $('.gridblock').click(function() {
    var index = $(this).attr('value');
    game.makeMove(index);
  });

});
