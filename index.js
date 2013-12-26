'use strict';
var estraverse = require('estraverse');
var esprima = require('esprima');
var escodegen = require('escodegen');
function rename(code, tokenTo, tokenFrom){
    tokenTo = tokenTo || '__derequire__';
    tokenFrom = tokenFrom || 'require';
    var ast = esprima.parse(code);
    estraverse.traverse(ast,{
        leave:function(node, parent) {
            var isVariableName = node.type === 'Identifier'&&node.name===tokenFrom;
            var isArugment = parent && (parent.type === 'FunctionDeclaration' || parent.type === 'FunctionExpression');
            var isCall = parent && (parent.type === 'CallExpression' && parent.callee.type === 'Identifier' && parent.callee.name === tokenFrom);
            if (isVariableName && (isArugment||isCall)){
                node.name = tokenTo;
            }
        } 
    });
    return escodegen.generate(ast);
}
module.exports = rename;