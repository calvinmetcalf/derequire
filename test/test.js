var should = require('chai').should();
var derequire = require('../');
var exampleText = "var x=function(require,module,exports){var process=require(\"__browserify_process\");var requireText = \"require\";}";
describe('derequire', function(){
  it('should work', function(){
    derequire(exampleText).should.equal("var x=function(__derequire__,module,exports){var process=__derequire__('__browserify_process');var requireText='require'}");
  });
});