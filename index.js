'use strict';
var estraverse = require('estraverse');
var esprima = require('esprima');
var escodegen = require('escodegen');
var esrefactor = require('esrefactor');
function rename(code, tokenTo, tokenFrom){
    tokenTo = tokenTo || '__derequire__';
    tokenFrom = tokenFrom || 'require';
    var inCode = '!function(){'+code+'}';
    var location, ctx, ast;
    var foundOne = true;
    while(foundOne){
        foundOne = false;
        ast = esprima.parse(inCode,{range:true});
        estraverse.traverse(ast,{
            enter:function(node, parent) {
                var isVariableName = node.type === 'Identifier'&&node.name===tokenFrom;
                var isArugment = parent && (parent.type === 'FunctionDeclaration' || parent.type === 'FunctionExpression');
                if(isVariableName&&isArugment){
                    location = node.range[0];
                    foundOne = true;
                    this.break();
                }
            } 
        });
        if(foundOne){
            ctx = new esrefactor.Context(inCode);
            inCode = ctx.rename(ctx.identify(location), tokenTo);
        }
    }
    return escodegen.generate(esprima.parse(inCode).body[0].expression.argument.body.body[0]);
}



module.exports = rename;