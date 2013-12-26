var should = require('chai').should();
var derequire = require('../');
describe('derequire', function(){
  it('should work', function(){
    var exampleText = "var x=function(require,module,exports){var process=require(\"__browserify_process\");var requireText = \"require\";}";
    derequire(exampleText).should.equal("var x = function (__derequire__, module, exports) {\n    var process = __derequire__('__browserify_process');\n    var requireText = 'require';\n};");
  });
  it('should only replace arguments and calls',function(){
    var exampleText = "function x(require,module,exports){var process=require(\"__browserify_process\");var requireText = {}; requireText.require = \"require\";(function(){var require = 'blah';}())}";
    derequire(exampleText).should.equal("function x(__derequire__, module, exports) {\n    var process = __derequire__('__browserify_process');\n    var requireText = {};\n    requireText.require = 'require';\n    (function () {\n        var require = 'blah';\n    }());\n}");
  });
  it('should handle top level return statments', function(){
    var exampleText = 'return require("require");';
    derequire(exampleText).should.equal("return __derequire__('require');");
  });
});