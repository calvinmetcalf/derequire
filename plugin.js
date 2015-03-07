var through = require('through2');

var derequire = require('./');

module.exports = function apply(b, opts) {
  var buffers = [];

  if (opts && !Object.keys(opts).length) {
    opts = undefined;
  }

  b.pipeline.get('pack').push(through(function(chunk, enc, next) {
    buffers.push(chunk);
    next();
  }, function(next) {
    this.push(derequire(Buffer.concat(buffers), opts));
    next();
  }));

  b.once('reset', function() {
    apply(b, opts);
  });
};
