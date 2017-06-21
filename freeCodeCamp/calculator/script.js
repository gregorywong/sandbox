if (!Array.prototype.peek){
  Array.prototype.peek = function(){
    return this[this.length - 1];
  };
};

var myCalc;

var Calculator = function(){

  const topDigitLimit = 8;
  const bottomDigitLimit = 20;
  var stack = ['0'];

  this.keyPress = function(input) {
    // returns an array of two strings if operating normally, otherwise returns undefined
    // is not guaranteed to return anything if not given expected input
    if (typeof input != "string") {
      console.error("typeof input is expected to be 'string', but was '" + typeof input + "'");
      clearAll();
      return undefined;
    }

    if (input == "clearEntry") {
      clearEntry();
    }
    else if (input == "clearAll"){
      clearAll();
    }
    else { // input is digit, decimal, operation, or equal sign
      var last = stack.peek();
      if (isOneOrMoreDigits(last)) {
        if (isSingleDigit(input)) {
          var popped = stack.pop();
          if (popped == '0') { // to ensure 0 is not repeated in the beginning
            stack.push(input);
          }
          else {
            stack.push(last + input);
          }
        }
        else if (isDecimal(input)) {
          // TODO:

        }
        else if (isOperation(input)) {
          // TODO:

        }
        else if (isEqualSign(input)) {
          // TODO:

        }
      }
      else if (isFloat(last)) {
        // Don't use eval() for floats. We want to keep the extra . if it's included (e.g., 2. instead of 2)
        if (isSingleDigit(input)) {
          // TODO:

        }
        else if (isOperation(input)) {
          // TODO:

        }
        else if (isEqualSign(input)) {
          // TODO:

        }
        // do nothing if isDecimal

      }
      else if (isOperation(last)) {
        if (isSingleDigit(input)) {
          // TODO:

          // TODO: division by zero not allowed
        }
        else if (isDecimal(input)) {
          // TODO:

        }
        // do nothing if isOperation or isEqualSign

      }
      else if (isEqualSign(last)) {
        if (isSingleDigit(input)) {
          clearAll();
          // TODO:
          // TODO: eval to make sure 0 is not repeated - so that you'll not get e.g., 00000

        }
        else if (isDecimal(input)) {
          clearAll();
          // TODO:
        }
        else if (isOperation(input)) {

        }
        // do nothing if isEqualSign
      }
    }

    return getDisplayValues();
  };

  function getDisplayValues() {
    var topDisplay = stack.peek();
    var bottomDisplay = stack.join('');

    if (isEqualSign(topDisplay)){
      var string = stack.slice(0,stack.length-1).join(''); // without last '='
      var result = eval(eval(string).toPrecision(topDigitLimit)).toString();

      topDisplay = result;
      bottomDisplay = string + "=" + result;
    }

    // check if screen can still accommodate displayed text
    if (digitLimitReached(topDisplay, bottomDisplay)) {
      clearAll();
      topDisplay = stack.peek();
      bottomDisplay = "Digit Limit Met";
    }

    // for people who are used to 'x' over '*'
    topDisplay.replace("*", "x");
    bottomDisplay.replace("*", "x");

    return [topDisplay, bottomDisplay];
  }

  function clearAll() {
    stack = ['0'];
  }

  function clearEntry() {
    if (stack.length <= 1) {
      clearAll();
    }
    else {
      // TODO:
    }
  }

  function digitLimitReached(topDisplay, bottomDisplay) {
    return (topDisplay.length > topDigitLimit || bottomDisplay.length > bottomDigitLimit);
  }

  function isSingleDigit(str) {
    return str.match(/^\d$/) !== null;
  }

  function isOneOrMoreDigits(str) {
    return str.match(/^\d+$/) !== null;
  }

  function isFloat(str) {
    // does not work for negative floats
    return str.match(/^\d+[.]\d*$/) !== null;
  }

  function isDecimal(str) {
    return str == '.';
  }

  function isOperation(str) {
    return str.match(/^[\+\-\*\/]$/) !== null;
  }

  function isEqualSign(str) {
    return str == '=';
  }

};

$(document).ready(function() {
  myCalc = new Calculator();

  $(".btn").click(function () {
    var result = myCalc.keyPress($(this).val());
    $("#topDisplay").text(result[0]);
    $("#bottomDisplay").text(result[1]);
  });
});
