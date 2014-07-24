#!/usr/bin/env node

var derequire = require('../');
var concat = require('concat-stream');
var fs = require('fs');

var file = process.argv[2];
var input = file && file !== '-'
    ? fs.createReadStream(process.argv[2])
    : process.stdin
;

input.pipe(concat(function(buf) {
    console.log(derequire(buf.toString('utf8')));
}));
