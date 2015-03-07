#!/usr/bin/env node

var fs = require('fs');
var derequire = require('../');

var source = fs.readFileSync('./test/react-with-addons.js', 'utf8');

measure('derequire "require" and "element"', 5, function() {
  derequire(source, [{
      from: 'require',
      to: '_derec_'
    },
    {
      from: 'element',
      to: '_elmnt_'
    }
  ]);
});

function measure(title, runs, func) {
  console.log('%s\n%s', title, Array(title.length+1).join('-'));
  var avg = 0;
  for (var i = 1; i <= runs; i++) {
    var start = Date.now();
    func();
    var duration = Date.now() - start;
    avg += (duration / runs);
    console.log('%d/%d took %dms', i, runs, duration);
  }
  console.log('avg %dms\n', Math.floor(avg));
}
