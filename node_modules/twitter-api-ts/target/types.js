"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unionize_1 = require("unionize");
const t = require("io-ts");
const io_ts_1 = require("./helpers/io-ts");
//
// Entities
//
// https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object
exports.User = t.interface({
    id_str: t.string,
    screen_name: t.string,
    time_zone: t.null,
});
exports.Tweet = t.interface({
    id_str: t.string,
    created_at: t.string,
    user: exports.User,
    text: t.string,
});
//
// Responses
//
exports.TwitterAPIErrorResponse = t.interface({
    errors: t.array(t.interface({
        code: t.number,
        message: t.string,
    })),
});
exports.TwitterAPIRequestTokenResponse = t.interface({
    oauth_token: t.string,
    oauth_token_secret: t.string,
    oauth_callback_confirmed: t.string,
});
exports.TwitterAPIAccessTokenResponse = t.interface({
    oauth_token: t.string,
    oauth_token_secret: t.string,
    user_id: t.string,
    screen_name: t.string,
});
exports.TwitterAPITimelineResponse = t.array(exports.Tweet);
exports.TwitterAPIAccountVerifyCredentials = exports.User;
exports.TwitterAPIAccountSettings = t.interface({
    time_zone: t.interface({
        name: t.string,
        tzinfo_name: t.string,
        utc_offset: t.number,
    }),
});
//
// Full responses (either success or error)
//
exports.ErrorResponse = unionize_1.unionize({
    JavaScriptError: unionize_1.ofType(),
    APIErrorResponse: unionize_1.ofType(),
    DecodeError: unionize_1.ofType(),
});
exports.StatusesHomeTimelineQuery = t.interface({
    count: io_ts_1.createOptionFromNullable(t.number),
    max_id: io_ts_1.createOptionFromNullable(t.string),
});
//# sourceMappingURL=types.js.map