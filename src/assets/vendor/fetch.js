"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task = require("fp-ts/lib/Task");
const fetch = require("node-fetch");
exports.fetchTaskEither = (url, init) => task.tryCatch(() => fetch.default(url, init), 
// We assert that we'll only ever receive an `Error` instance from `fetch`
(error) => error);
//# sourceMappingURL=fetch.js.map