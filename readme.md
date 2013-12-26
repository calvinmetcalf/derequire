derequire
====

```bash
npm install derequire
```

```javascript
var derequire = require('derequire');
var transformedCode = derequire(code [,tokenTo='__derequire__', tokenFrom='require');
```

takes a string of code and replaces all instances of the identifier `tokenFrom` (default 'require') and replaces them with tokenTo (default '\_\_derequire\_\_'), returnes the code, but only if they are functional arguments and subsequent uses of said argument.