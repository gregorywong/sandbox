// extra function to access the last element of an array
if (!Array.prototype.peek){
  Array.prototype.peek = function(){
    return this[this.length - 1];
  };
};

var myCalc;

var Calculator = function(){

  const topLengthLimit = 10;
  const topDigitLimit = 8;
  const bottomLengthLimit = 20;
  var stack = ['0'];

  this.keyPress = function(input) {
    // returns an array of two strings if operating normally, otherwise returns undefined
    // is not guaranteed to return anything if not given expected input
    if (typeof input != "string") {
      console.error("typeof input is expected to be 'string', but was '" + typeof input + "'");
      clearAll();
      return undefined;
    }

    if (input == "E") { // clear entry
      clearEntry();
    }
    else if (input == "A"){ // clear all
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
          var popped = stack.pop();
          stack.push(last + input);
        }
        else if (isOperation(input)) {
          stack.push(input);
        }
        else if (isEqualSign(input)) {
          stack.push(input);
        }
      }
      else if (isFloat(last)) {
        // Don't use eval() for floats. We want to keep the extra . if it's included (e.g., 2. instead of 2)
        if (isSingleDigit(input)) {
          var popped = stack.pop();
          stack.push(last + input);
        }
        else if (isOperation(input)) {
          stack.push(input);
        }
        else if (isEqualSign(input)) {
          stack.push(input);
        }
        // do nothing if isDecimal

      }
      else if (isOperation(last)) {
        if (isSingleDigit(input)) {
          if (last == '/' && input == '0') {
            // do nothing, as division by zero is not allowed
          }
          else {
            stack.push(input);
          }
        }
        else if (isDecimal(input)) {
          stack.push('0.');
        }
        // do nothing if isOperation or isEqualSign
      }
      else if (isEqualSign(last)) {
        if (isSingleDigit(input)) {
          // empty stack and add input to it
          stack = [input];
        }
        else if (isDecimal(input)) {
          // empty stack and add '0.' to it
          stack = ['0.'];
        }
        else if (isOperation(input)) {
          stack.pop(); // should be '='
          var string = stack.join('');
          var rawResult = eval(string);
          var result;
          if (rawResult >= 0) {
            result = eval(eval(string).toPrecision(topDigitLimit)).toString();
          }
          else {
            result = eval(eval(string).toPrecision(topDigitLimit-1)).toString();
          }

          // empty stack except for the result from the last calculation and add the operation
          stack = [result, input];
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
      var rawResult = eval(string);
      var result;
      if (rawResult >= 0) {
        result = eval(eval(string).toPrecision(topDigitLimit)).toString();
      }
      else {
        result = eval(eval(string).toPrecision(topDigitLimit-1)).toString();
      }

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
    topDisplay = topDisplay.replace("*", "x");
    bottomDisplay = bottomDisplay.replace(/\*/g, "x");

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
      stack.pop();
    }
  }

  function digitLimitReached(topDisplay, bottomDisplay) {
    return (topDisplay.length > topLengthLimit || bottomDisplay.length > bottomLengthLimit);
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

// test suite
var myTestCalc = new Calculator();
var myTestCases = [
  [
    ['a','0','0'],
    ['1+1=','2'],
    ['1+2=','3'],
    ['1+3=','4'],
    ['1+4=','5'],
    ['1+2+3+4+5=','15'],
    ['000000','0','0'],
    ['000000=','0','0=0'],
  ],
  [
    ['a','0','0'],
    ['0=','0','0=0'],
    ['+2','2','0+2=2'],
  ],

];
for (var i = 0; i < myTestCases.length; i++) {
  var testStrings = myTestCases[i];
  for (var i = 0; i < testStrings.length; i++) {
    var testString = testStrings[i];
    var input = testString[0];
    var expectedTop = testString[1];
    var expectedBottom = testString[2];
    var output;
    for (var i = 0; i < input.length; i++) {
      output = myTestCalc.keyPress(input[i]);
      var actualTop = output[0];
      var actualBottom = output[1];
    }
    // comparing against single number result
    if (actualTop != expectedTop) {
      console.error("Failed test (single number result): " + expectedTop);
      console.log("Input: " + input);
      console.log("Expected single number result: " + expectedTop);
      console.log("Actual Top Display: " + actualTop);
    }
    // comparing against expected bottom display (if available)
    if (expectedBottom) {
      if (expectedBottom != actualBottom) {
        console.error("Failed test (expected bottom display): " + expectedBottom);
        console.log("Input: " + input);
        console.log("Expected Bottom Display: " + expectedBottom);
        console.log("Actual Bottom Display: " + actualBottom);
      }
    }
    // no expected bottom display given; comparing against generated bottom display
    else if (actualBottom != input+expectedTop) {
      console.error("Failed test (generated bottom display): " + input+expectedTop);
      console.log("Input: " + input);
      console.log("Expected Combined Output: " + input+expectedTop);
      console.log("Actual Bottom Display: " + actualBottom);
    }
  }
}
