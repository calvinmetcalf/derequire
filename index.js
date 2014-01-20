'use strict';
var estraverse = require('estraverse');
var esprima = require('esprima');
var esrefactor = require('esrefactor');
function rename(code, tokenTo, tokenFrom){
    tokenTo = tokenTo || '_dereq_';
    tokenFrom = tokenFrom || 'require';
    if(tokenTo.length !== tokenFrom.length){
        throw new Error('bad stuff will happen if you try to change tokens of different length');
    }
    var inCode = '!function(){'+code+'}';
    var ctx = new esrefactor.Context(inCode);;
    var ast = esprima.parse(inCode,{range:true});
    estraverse.traverse(ast,{
        enter:function(node, parent) {
            var test = 
            parent &&
            (parent.type === 'FunctionDeclaration' || parent.type === 'FunctionExpression') &&
            node.name === tokenFrom &&
            node.type === 'Identifier';
            if(test){
                ctx._code = ctx.rename(ctx.identify(node.range[0]), tokenTo);
            }
        } 
    });
    return ctx._code.slice(12, -1);
}



module.exports = rename;