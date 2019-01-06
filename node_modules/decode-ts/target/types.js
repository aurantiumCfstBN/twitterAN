"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var unionize_1 = require("unionize");
exports.JsonDecodeError = unionize_1.unionize({
    ValidationErrors: unionize_1.ofType(),
    ParsingError: unionize_1.ofType(),
});
//# sourceMappingURL=types.js.map