derequire [![Build Status](https://travis-ci.org/calvinmetcalf/derequire.svg)](https://travis-ci.org/calvinmetcalf/derequire)
====

```bash
npm install derequire
```

```javascript
var derequire = require('derequire');
var transformedCode = derequire(code, /*tokenTo=*/'_dereq_', /*tokenFrom=*/'require');
```

takes a string of code and replaces all instances of the identifier `tokenFrom` (default 'require') and replaces them with tokenTo (default '\_dereq\_') but only if they are functional arguments or variable declerations and subsequent uses of said argument, then returnes the code.

For multiple renames at the same times accepts the syntax

```js
derequire(code, [
  {
    from: 'require',
    to: '_dereq_'
  },
  {
    from: 'define',
    to: '_defi_'
  }
]);
```

__Note:__ in order to avoid quite a few headaches the token you're changing from and the token you're changing to need to be the same length.
