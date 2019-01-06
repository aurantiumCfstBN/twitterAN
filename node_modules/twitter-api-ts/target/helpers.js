"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const either = require("fp-ts/lib/Either");
const option = require("fp-ts/lib/Option");
exports.createErrorResponse = (errorResponse) => either.left(errorResponse);
exports.typecheck = (a) => a;
// Defaults
exports.defaultOAuthOptions = {
    callback: option.none,
    verifier: option.none,
    token: option.none,
    tokenSecret: option.none,
};
exports.defaultStatusesHomeTimelineQuery = {
    count: option.none,
    max_id: option.none,
};
//# sourceMappingURL=helpers.js.map