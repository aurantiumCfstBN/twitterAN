"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TWITTER_API_BASE_URL = 'https://api.twitter.com';
var ENDPOINTS;
(function (ENDPOINTS) {
    ENDPOINTS["OAuthAuthenticate"] = "/oauth/authenticate";
    ENDPOINTS["OAuthRequestToken"] = "/oauth/request_token";
    ENDPOINTS["OAuthAccessToken"] = "/oauth/access_token";
    ENDPOINTS["StatusesHomeTimeline"] = "/1.1/statuses/home_timeline.json";
    ENDPOINTS["AccountVerifyCredentials"] = "/1.1/account/verify_credentials.json";
    ENDPOINTS["AccountSettings"] = "/1.1/account/settings.json";
})(ENDPOINTS = exports.ENDPOINTS || (exports.ENDPOINTS = {}));
//# sourceMappingURL=constants.js.map