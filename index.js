'use strict';

var estraverse = require('estraverse');
var esprima = require('esprima-fb');
var esrefactor = require('esrefactor');
var _requireRegexp = /require.*\(.*['"]/m;

function requireRegexp(token) {
  if (token === 'require') {
    return _requireRegexp;
  }
  
  return new RegExp(token + '.*\\(.*[\'"]', 'm');
}

function testParse (code) {
  try {
    return esprima.parse(code, { range: true });
  } catch (e) {}
}

function rename(code, tokenTo, tokenFrom) {
  tokenTo = tokenTo || '_dereq_';
  tokenFrom = tokenFrom || 'require';
  var tokens;
  if (!Array.isArray(tokenTo)) {
    tokens = [{
      to: tokenTo,
      from: tokenFrom
    }];
  } else {
    tokens = tokenTo;
  }
  if(tokens.some(function (item) {
    return item.to.length !== item.from.length;
  })){
      throw new Error('bad stuff will happen if you try to change tokens of different length');
  }
  
  if (!tokens.some(function (item) {
    var results = requireRegexp(item.from).test(code);
    return results;
  })) {
    return code;
  }
  
  var inCode = '!function(){'+code+'\n;}';
  var ast = testParse(inCode);
  
  if(!ast){
    return code;
  }
  var tokenNames = tokens.map(function (item) {
    return item.from;
  });
  var ctx = new esrefactor.Context(inCode);

  estraverse.traverse(ast,{
    enter:function(node, parent) {
      var index;
      var test = parent &&
        (parent.type === 'FunctionDeclaration' || parent.type === 'FunctionExpression' ||
          parent.type === 'VariableDeclarator') &&
        node.type === 'Identifier' && (index = tokenNames.indexOf(node.name)) !== -1;
      if (test) {
        ctx._code = ctx.rename(ctx.identify(node.range[0]), tokens[index].to);
      }
    }
  });
  
  return ctx._code.slice(12, -3);
}

module.exports = rename;
