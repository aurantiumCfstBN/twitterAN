"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("io-ts");
const option = require("fp-ts/lib/Option");
// https://github.com/gcanti/io-ts-types/blob/d3c51fbd92e4d214acfc45236fd02c4b900088ef/src/fp-ts/createOptionFromNullable.ts
// Difference: `T | undefined` instead of `T | null`
// https://github.com/gcanti/io-ts-types/issues/21
exports.createOptionFromNullable = (type) => {
    const Nullable = t.union([type, t.null, t.undefined]);
    return new t.Type(`Option<${type.name}>`, (m) => m instanceof option.None || (m instanceof option.Some && type.is(m.value)), (s, c) => Nullable.validate(s, c).chain(u => t.success(option.fromNullable(u))), a => a.map(type.encode).toUndefined());
};
//# sourceMappingURL=io-ts.js.map