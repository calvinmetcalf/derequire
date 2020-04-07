"use strict";

function outer(_dereq_, bar) {
  var foo = _dereq_('foo');
  var bar = 100n;
  return foo(bar);
}
