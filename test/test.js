var should = require('chai').should();
var fs = require('fs');
var crypto = require('crypto');

function hash(data){
  return crypto.createHash('sha512').update(data).digest('base64');
}

describe('derequire', function(){

  var derequire = require('../');

  it('should work', function(){
    var source = (
      'var x=function(require,module,exports){' +
        'var process=require("__browserify_process");' +
        'var requireText = "require";' +
      '}'
    );
    var expected = (
      'var x=function(_dereq_,module,exports){' +
        'var process=_dereq_("__browserify_process");' +
        'var requireText = "require";' +
      '}'
    );
    derequire(source).should.equal(expected);
  });

  it('should handle top level return statments', function() {
    var source = (
      'return (' +
        'function(require){return require();}' +
        '(function(){return "sentinel";})' +
      ');'
    );
    var expected = (
      'return (' +
        'function(_dereq_){return _dereq_();}' +
        '(function(){return "sentinel";})' +
      ');'
    );
    derequire(source).should.equal(expected);
  });

  it('should work with a comment on the end', function() {
    var source = (
      'var x=function(require,module,exports){' +
        'var process=require("__browserify_process");' +
        'var requireText = "require";' +
      '}//lala'
    );
    var expected = (
      'var x=function(_dereq_,module,exports){' +
        'var process=_dereq_("__browserify_process");' +
        'var requireText = "require";' +
      '}//lala'
    );
    derequire(source).should.equal(expected);
  });

  it('should work with whitespace inside require statement', function() {
    var source = (
      'var x=function(require,module,exports){' +
        'var process=require(  "__browserify_process"   )' +
      '}'
    );
    var expected = (
      'var x=function(_dereq_,module,exports){' +
        'var process=_dereq_(  "__browserify_process"   )' +
      '}'
    );
    derequire(source).should.equal(expected);
  });

  it('should work with single quoted requires', function() {
    var source = (
      'var x=function(require,module,exports){' +
        'var process=require(\'__browserify_process\')' +
      '}'
    );
    var expected = (
      'var x=function(_dereq_,module,exports){' +
        'var process=_dereq_(\'__browserify_process\')' +
      '}'
    );
    derequire(source).should.equal(expected);
  });

  it('should throw an error if you try to change things of different sizes', function() {
    should.throw(function(){
      derequire('require("x")', 'lalalalla', 'la');
    });
  });

  it('should return not the code back if it cannot parse it', function() {
    derequire('/*').should.equal('/*');
  });

  it('should return the code back if it cannot parse it and it has a require', function() {
    derequire('/*require(').should.equal('/*require(');
  });

  it('should not fail on attribute lookups', function() {
    var source = (
      'var x=function(require,module,exports){' +
        'var W=require("stream").Writable;' +
      '}'
    );
    var expected = (
      'var x=function(_dereq_,module,exports){' +
        'var W=_dereq_("stream").Writable;' +
      '}'
    );
    derequire(source).should.equal(expected);
  });

  it('should work on something big', function(done) {
    fs.readFile('./test/pouchdb.js', 'utf8', function(err, source) {
      fs.readFile('./test/pouchdb.dereq.js', 'utf8', function(err, expected) {
        hash(derequire(source)).should.equal(hash(expected));
        done();
      });
    });
  });

  it('should work on something complicated', function(done) {
    fs.readFile('./test/react-with-addons.js', 'utf8', function(err, source) {
      fs.readFile('./test/react-with-addons.dereq.js', 'utf8', function(err, expected) {
        hash(derequire(source)).should.equal(hash(expected));
        done();
      });
    });
  });

  it('should fix cjs-smartassery', function(done) {
    fs.readFile('./test/cjs-smartass.js', 'utf8', function(err, source) {
      fs.readFile('./test/cjs-smartass.dereq.js', 'utf8', function(err, expected) {
        hash(derequire(source)).should.equal(hash(expected));
        done();
      });
    });
  });

  it('should fix not fix cjs-lazy', function(done) {
    fs.readFile('./test/cjs-lazy.js', 'utf8', function(err, source) {
      derequire(source).should.equal(source);
      done();
    });
  });

  it('should modify ember data', function(done) {
    fs.readFile('./test/ember-data.js', 'utf8', function(err, source) {
      fs.readFile('./test/ember-data.dereq.js', 'utf8', function(err, expected) {
        hash(derequire(source)).should.equal(hash(expected));
        done();
      });
    });
  });

  it('should work on multiple things', function(done) {
    fs.readFile('./test/define.js', 'utf8', function(err, source) {
      fs.readFile('./test/define.dereq.js', 'utf8', function(err, expected) {
        derequire(source, [
          {
            from: 'requir_',
            to: '_derec_'
          },
          {
            from: 'define',
            to: '_defi_'
          }
        ]).should.equal(expected);
        done();
      });
    });
  });

});
