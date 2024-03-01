"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var REGEX_COMMAS_OUTSIDE_QUOTES = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
var REGEX_DOUBLE_COMMAS_OUTSIDE_QUOTES = /,{2}(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
var CSV_LINE_SEPARATOR = String.fromCharCode(0x1);
exports.splitStringByCSVCommas = function (str, replaceEmptyColumnWithIndex) {
    if (replaceEmptyColumnWithIndex === void 0) { replaceEmptyColumnWithIndex = false; }
    if (str.charAt(0) === ',') {
        str = CSV_LINE_SEPARATOR + str;
    }
    if (str.charAt(str.length - 1) === ',') {
        str = str + CSV_LINE_SEPARATOR;
    }
    str = str.replace(REGEX_DOUBLE_COMMAS_OUTSIDE_QUOTES, ',' + CSV_LINE_SEPARATOR + ',');
    var results = str.match(REGEX_COMMAS_OUTSIDE_QUOTES);
    if (!results) {
        return [];
    }
    return (results.map(function (column, index) {
        return column === CSV_LINE_SEPARATOR
            ? replaceEmptyColumnWithIndex
                ? index.toString()
                : null
            : isNaN(Number(column))
                ? column
                : Number(column);
    }) || []);
};
exports.mergeKVArrays = function (keys, values) {
    return keys.reduce(function (obj, key, index) {
        var _a;
        return (__assign(__assign({}, obj), (_a = {}, _a[key] = values[index], _a)));
    }, {});
};
exports.csvToJson = function (csv) {
    var csvData = csv
        .split('\n')
        .filter(function (line) { return line; }); // remove empty lines
    var csvHeaderRow = csvData.shift();
    var result = { csv: [] };
    if (csvHeaderRow) {
        var headers_1 = exports.splitStringByCSVCommas(csvHeaderRow, true);
        csvData = csvData.map(function (row) {
            return exports.mergeKVArrays(headers_1, exports.splitStringByCSVCommas(row));
        });
        result.csv = csvData;
    }
    return result;
};
exports.jsonToCsv = function (json) {
    var result = '';
    var headers = json.reduce(function (acc, item) {
        acc.push.apply(acc, Object.keys(item));
        return acc;
    }, []);
    headers = headers.filter(function (h, i) { return headers.indexOf(h) === i; });
    result = headers.map(function (h) { return "\"" + h + "\""; }).join() + '\n';
    json.forEach(function (doc) {
        var row = Array.from({ length: headers.length }, function () { return ''; });
        Object.keys(doc).forEach(function (key) {
            return (row[headers.indexOf(key)] = "\"" + doc[key].toString() + "\"");
        });
        result += row.join() + '\n';
    });
    return result;
};
module.exports = {
    csvToJson: exports.csvToJson,
    jsonToCsv: exports.jsonToCsv
};
