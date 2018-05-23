"use strict";

async function outer(_dereq_, bar) {
  var foo = _dereq_('foo');
  await foo(bar);
}

