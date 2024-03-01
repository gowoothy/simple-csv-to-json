"use strict";
exports.__esModule = true;
var csvToJson_1 = require("../csvToJson");
exports.csvData = "\nfirst,last,phone,email,comment,age\njohn,doe,555-555-5678,jon@doe.com,This is a comment!,42\njane,doe,555-555-5679,jane@doe.com,\"Indeed, this is a comment!\",42\njenna,,555-555-5555,jenna@beauty.com,\"I am a beautiful person.\",\n";
console.log(csvToJson_1.csvToJson(exports.csvData));
var docs = [{ h: 'test', fn: 'john', ln: 'doe' }, { h: 'boom', fn: 'sally', ln: 'sue', age: 14 }];
console.log(csvToJson_1.jsonToCsv(docs));
