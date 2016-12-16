function outer(require=()=>{}) {
  require('foo');
  const opts = {require: require};
  opts.require('lala');
}
function other(opts) {
  const {require, othername} = opts;
  require('foo');
}
function further(opts) {
  const {thing: require, othername} = opts;
  require('foo');
}
