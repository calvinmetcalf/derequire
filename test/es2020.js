"use strict";

function outer(require, bar) {
  var foo = require('foo');
  var bar = 100n;
  return foo(bar);
}
