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
            if (node.type == 'Identifier'&&node.name===tokenFrom){
                node.name = tokenTo;
            }
        } 
    });
    return escodegen.generate(ast,{
        format:{
            escapeless:true,
            compact:true,
            semicolons:false,
            parentheses:false
        }
    });
}
module.exports = rename;