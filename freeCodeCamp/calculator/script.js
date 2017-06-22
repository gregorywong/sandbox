// extra function to access the last element of an array
if (!Array.prototype.peek){
  Array.prototype.peek = function(){
    return this[this.length - 1];
  };
};

var Calculator = function(){

  const TOP_LENGTH_LIMIT = 10;
  const TOP_DIGIT_LIMIT = 8;
  const BOTTOM_LENGTH_LIMIT = 20;
  const DIGIT_LIMIT_REACHED_MESSAGE = "Digit Limit Reached";
  var stack = ['0'];

  this.keyPress = function(input) {
    // returns an array of two strings if operating normally, otherwise returns undefined
    if (typeof input != "string") {
      console.error("typeof input is expected to be 'string', but was '" + typeof input + "'");
      return undefined;
    }
    if (!isValidInput(input)) {
      console.error("input not valid, I don't know what to do with it: '" + input + "'");
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
          result = calculateTopValue();

          // empty stack except for the result from the last calculation and add the operation
          stack = [result, input];
        }
        // do nothing if isEqualSign
      }
    }

    return getDisplayValues();
  };

  function calculateTopValue() {
    // assume last value in stack is '='
    var string = stack.slice(0,stack.length-1).join(''); // without last '='
    var rawResult = eval(string);
    var digits = rawResult >= 0 ? TOP_DIGIT_LIMIT : TOP_DIGIT_LIMIT - 1;
    return eval(eval(string).toPrecision(digits)).toString();
  }

  function getDisplayValues() {
    var topDisplay = stack.peek();
    var bottomDisplay = stack.join('');

    if (isEqualSign(topDisplay)){
      topDisplay = calculateTopValue();
      bottomDisplay += topDisplay;
    }

    // check if screen can still accommodate displayed text
    if (digitLimitReached(topDisplay, bottomDisplay)) {
      clearAll();
      topDisplay = stack.peek();
      bottomDisplay = DIGIT_LIMIT_REACHED_MESSAGE;
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
    return (topDisplay.length > TOP_LENGTH_LIMIT || bottomDisplay.length > BOTTOM_LENGTH_LIMIT);
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

  function isValidInput(str) {
    return str.match(/^[0-9.\+\-\*\/=AE]$/);
  }
};

$(document).ready(function() {
  var myCalc = new Calculator();

  // uncomment to run test suite
  // runTests();

  $(".btn").click(function () {
    var displayValues = myCalc.keyPress($(this).val());
    $("#topDisplay").text(displayValues[0]);
    $("#bottomDisplay").text(displayValues[1]);
  });
});

/* Test Suite */
/* ********** */

var runTests = function () {
  var myTestCalc = new Calculator();
  const DIGIT_LIMIT_REACHED_MESSAGE = "Digit Limit Reached";
  const MY_TEST_CASES = [
    // [input, expected top display, expected bottom display]
    [
      ['A','0','0'],
      ['1+1=','2'],
      ['1+2=','3'],
      ['1+3=','4'],
      ['1+4=','5'],
      ['1+2+3+4+5=','15'],
      ['000000','0','0'],
      ['000000=','0','0=0'],
    ],
    [
      ['A','0','0'],
      ['AAAAAAA','0','0'],
      ['EEEEEEE','0','0'],
    ],
    [
      ['A','0','0'],
      ['1+1=','2'],
      ['1+2=','3'],
      ['1+3=','4'],
      ['1+4=','5'],
      ['1+2+3+4+5=','15'],
      ['000000','0','0'],
      ['000000=','0','0=0'],
    ],
    [
      ['A','0','0'],
      ['0=','0','0=0'],
      ['+2=','2','0+2=2'],
      ['+3=','5','2+3=5'],
    ],
    [
      ['A','0','0'],
      ['1+2+3+4','4','1+2+3+4'],
      ['E','+','1+2+3+'],
      ['E','3','1+2+3'],
      ['E','+','1+2+'],
      ['E','2','1+2'],
      ['E','+','1+'],
      ['E','1','1'],
      ['E','0','0'],
    ],
    [
      ['A','0','0'],
      ['1/9','9','1/9'],
      ['=','0.11111111','1/9=0.11111111'],
      ['=','0.11111111','1/9=0.11111111'],
      ['=','0.11111111','1/9=0.11111111'],
      ['1/9+1/9','9','1/9+1/9'],
      ['=','0.22222222','1/9+1/9=0.22222222'],
    ],
    [
      ['A','0','0'],
      ['1234567890','1234567890','1234567890'],
      ['*10','10','1234567890x10'],
      ['=','0', DIGIT_LIMIT_REACHED_MESSAGE],
      ['=','0', '0=0'],
      ['12345678901', '0', DIGIT_LIMIT_REACHED_MESSAGE],
      ['123456789011', '1', '1'],
      ['A','0','0'],
      ['1234567890112', '12', '12'],
      ['A','0','0'],
      ['1+1+1+1+1+1+1+1+1+1+','+','1+1+1+1+1+1+1+1+1+1+'],
      ['A','0','0'],
      ['1+1+1+1+1+1+1+1+1+1+1','0',DIGIT_LIMIT_REACHED_MESSAGE],
    ],
  ];

  var errorCount = 0;
  for (var i = 0; i < MY_TEST_CASES.length; i++) {
    var testStrings = MY_TEST_CASES[i];
    console.log("Running test " + (i+1) + " of " + MY_TEST_CASES.length);
    for (var j = 0; j < testStrings.length; j++) {
      var testString = testStrings[j];
      var input = testString[0];
      var expectedTop = testString[1];
      var expectedBottom = testString[2];
      var output;
      for (var k = 0; k < input.length; k++) {
        output = myTestCalc.keyPress(input[k]);
      }
      var actualTop = output[0];
      var actualBottom = output[1];
      // comparing against single number result
      if (actualTop != expectedTop) {
        console.error("Failed test (single number result): " + expectedTop);
        console.log("Input: " + input);
        console.log("Expected single number result: " + expectedTop);
        console.log("Actual Top Display: " + actualTop);
        errorCount++;
      }
      // comparing against expected bottom display (if available)
      if (expectedBottom) {
        if (expectedBottom != actualBottom) {
          console.error("Failed test (expected bottom display): " + expectedBottom);
          console.log("Input: " + input);
          console.log("Expected Bottom Display: " + expectedBottom);
          console.log("Actual Bottom Display: " + actualBottom);
          errorCount++;
        }
      }
      // no expected bottom display given; comparing against generated bottom display
      else {
        if (actualBottom != input+expectedTop) {
          console.error("Failed test (generated bottom display): " + input+expectedTop);
          console.log("Input: " + input);
          console.log("Expected Combined Output: " + input+expectedTop);
          console.log("Actual Bottom Display: " + actualBottom);
          errorCount++;
        }
      }
    }
  }
  console.log("Finished running " + MY_TEST_CASES.length + " tests with " + errorCount + " total errors.");
};
