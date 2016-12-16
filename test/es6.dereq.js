function outer(_dereq_=()=>{}) {
  _dereq_('foo');
  const opts = {require: _dereq_};
  opts.require('lala');
}
function other(opts) {
  const {_dereq_, othername} = opts;
  _dereq_('foo');
}
function further(opts) {
  const {thing: _dereq_, othername} = opts;
  _dereq_('foo');
}
