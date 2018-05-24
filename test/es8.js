"use strict";

async function outer(require, bar) {
  var foo = require('foo');
  await foo(bar);
}

