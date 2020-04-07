var assert = require('assert');
var fs = require('fs');
var crypto = require('crypto');
var vm = require('vm');
var browserify = require('browserify');

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
    assert.equal(derequire(source), expected);
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
    assert.equal(derequire(source), expected);
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
    assert.equal(derequire(source), expected);
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
    assert.equal(derequire(source), expected);
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
    assert.equal(derequire(source), expected);
  });

  it('should throw an error if you try to change things of different sizes', function() {
    assert.throws(function(){
      derequire('require("x")', 'lalalalla', 'la');
    });
  });

  it('should return not the code back if it cannot parse it', function() {
    assert.equal(derequire('/*'), '/*');
  });

  it('should return the code back if it cannot parse it and it has a require', function() {
    assert.equal(derequire('/*require('), '/*require(');
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
    assert.equal(derequire(source), expected);
  });

  it('should work on something big', function(done) {
    fs.readFile('./test/pouchdb.js', 'utf8', function(err, source) {
      fs.readFile('./test/pouchdb.dereq.js', 'utf8', function(err, expected) {
        assert.equal( hash(derequire(source)), hash(expected) );
        done();
      });
    });
  });

  it('should work on something complicated', function(done) {
    fs.readFile('./test/react-with-addons.js', 'utf8', function(err, source) {
      fs.readFile('./test/react-with-addons.dereq.js', 'utf8', function(err, expected) {
        assert.equal( hash(derequire(source)), hash(expected) );
        done();
      });
    });
  });

  it('should fix cjs-smartassery', function(done) {
    fs.readFile('./test/cjs-smartass.js', 'utf8', function(err, source) {
      fs.readFile('./test/cjs-smartass.dereq.js', 'utf8', function(err, expected) {
        assert.equal( hash(derequire(source)), hash(expected) );
        done();
      });
    });
  });

  it('should fix not fix cjs-lazy', function(done) {
    fs.readFile('./test/cjs-lazy.js', 'utf8', function(err, source) {
      assert.equal(derequire(source), source);
      done();
    });
  });

  it('should modify ember data', function(done) {
    fs.readFile('./test/ember-data.js', 'utf8', function(err, source) {
      fs.readFile('./test/ember-data.dereq.js', 'utf8', function(err, expected) {
        assert.equal( hash(derequire(source)), hash(expected));
        done();
      });
    });
  });
  it('should work with es6', function(done) {
    fs.readFile('./test/es6.js', 'utf8', function(err, source) {
      fs.readFile('./test/es6.dereq.js', 'utf8', function(err, expected) {
        assert.equal( derequire(source), expected);
        done();
      });
    });
  });

  it('should work with es8', function(done) {
    fs.readFile('./test/es8.js', 'utf8', function(err, source) {
      fs.readFile('./test/es8.dereq.js', 'utf8', function(err, expected) {
        assert.equal( derequire(source), expected);
        done();
      });
    });
  });

  it('should work with es2020', function(done) {
    fs.readFile('./test/es2020.js', 'utf8', function(err, source) {
      fs.readFile('./test/es2020.dereq.js', 'utf8', function(err, expected) {
        assert.equal( derequire(source), expected);
        done();
      });
    });
  });

  it('should work on multiple things', function(done) {
    fs.readFile('./test/define.js', 'utf8', function(err, source) {
      fs.readFile('./test/define.dereq.js', 'utf8', function(err, expected) {
        var actual = derequire(source, [
          {
            from: 'requir_',
            to: '_derec_'
          },
          {
            from: 'define',
            to: '_defi_'
          }
        ]);
        assert.equal(actual, expected);
        done();
      });
    });
  });
});

describe('browserify plugin', function() {
  it('should work with default options', function(done) {
    var b = browserify({
      entries: [__dirname + '/browserify-main.js'],
      plugin: ['./plugin']
    })
    b.bundle(function(err, src) {
      assert.ok(!err);
      assert.ok(String(src).indexOf('_dereq_') !== -1);
      var called = false;
      var c = {callme: function() { called = true; }};
      vm.runInNewContext(src, c);
      assert.ok(called);
      done();
    });
  });

  it('should work with no options', function(done) {
    var b = browserify({
      entries: [__dirname + '/browserify-main.js'],
      plugin: [['./plugin']]
    })
    b.bundle(function(err, src) {
      assert.ok(!err);
      assert.ok(String(src).indexOf('_dereq_') !== -1);
      var called = false;
      var c = {callme: function() { called = true; }};
      vm.runInNewContext(src, c);
      assert.ok(called);
      done();
    });
  });

  it('should work with options', function(done) {
    var b = browserify({
      entries: [__dirname + '/browserify-main.js'],
      plugin: [['./plugin', [{from: 'require', to: '_DEREQ_'}]]]
    })
    b.bundle(function(err, src) {
      assert.ok(!err);
      assert.ok(String(src).indexOf('_DEREQ_') !== -1);
      var called = false;
      var c = {callme: function() { called = true; }};
      vm.runInNewContext(src, c);
      assert.ok(called);
      done();
    });
  });
});
