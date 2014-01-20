derequire
====

```bash
npm install derequire
```

```javascript
var derequire = require('derequire');
var transformedCode = derequire(code [,tokenTo='_dereq_', tokenFrom='require');
```

takes a string of code and replaces all instances of the identifier `tokenFrom` (default 'require') and replaces them with tokenTo (default '\dereq\_'), returnes the code, but only if they are functional arguments and subsequent uses of said argument.

__Note:__ in order to avoid quite a few headaches the token you're changing from and the token you're changing to need to be the same length.