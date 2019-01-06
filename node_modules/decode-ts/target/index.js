"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var array = require("fp-ts/lib/Array");
var either = require("fp-ts/lib/Either");
var io_ts_reporters_1 = require("io-ts-reporters");
var types_1 = require("./types");
var typecheck = function (a) { return a; };
var jsonParse = function (jsonString) { return (either.tryCatch(function () { return JSON.parse(jsonString); })
    .mapLeft(function (error) { return types_1.JsonDecodeError.ParsingError({ input: jsonString, errorMessage: error.message }); })); };
exports.validateType = function (type) { return function (value) { return (type.decode(value)
    .mapLeft(function (validationErrors) { return types_1.JsonDecodeError.ValidationErrors({ validationErrors: validationErrors }); })); }; };
exports.jsonDecodeString = function (type) { return function (value) { return (
// Widen Left generic
typecheck(jsonParse(value)).chain(exports.validateType(type))); }; };
exports.formatJsonDecodeError = function (error) {
    if (types_1.JsonDecodeError.is.ValidationErrors(error)) {
        return array.catOptions(error.validationErrors.map(io_ts_reporters_1.formatValidationError));
    }
    else {
        return [error.errorMessage];
    }
};
exports.reportJsonDecodeError = function (result) { return (result.fold(exports.formatJsonDecodeError, function () { return []; })); };
__export(require("./types"));
//# sourceMappingURL=index.js.map