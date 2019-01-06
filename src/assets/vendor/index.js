"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Decode = require("decode-ts/target");
const either = require("fp-ts/lib/Either");
const task = require("fp-ts/lib/Task");
const oauth_authorization_header_1 = require("oauth-authorization-header");
const querystring = require("querystring");
const qsLib = require("qs");
var Task = task.Task;
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
const fetch_1 = require("./helpers/fetch");
const types_1 = require("./types");
exports.fetchFromTwitter = ({ oAuth, endpointPath, method, query }) => {
    const oAuthWithDefaults = Object.assign({}, helpers_1.defaultOAuthOptions, oAuth);
    const baseUrl = `${constants_1.TWITTER_API_BASE_URL}${endpointPath}`;
    // We must use `qs` and not `querystring` for stringifying because that's what
    // `oauth-authorization-header` uses, and the query string needs to be consistent. (`qs` differs
    // in many ways, including the way it stringifies `undefined`.)
    const queryString = qsLib.stringify(query);
    const paramsStr = Object.keys(query).length > 0 ? `?${queryString}` : '';
    const url = `${baseUrl}${paramsStr}`;
    const authorizationHeader = oauth_authorization_header_1.getOAuthAuthorizationHeader({
        oAuth: {
            consumerKey: oAuthWithDefaults.consumerKey,
            consumerSecret: oAuthWithDefaults.consumerSecret,
            callback: oAuthWithDefaults.callback.toUndefined(),
            token: oAuthWithDefaults.token.toUndefined(),
            tokenSecret: oAuthWithDefaults.tokenSecret.toUndefined(),
            verifier: oAuthWithDefaults.verifier.toUndefined(),
        },
        url,
        method,
        queryParams: query,
        formParams: {},
    });
    const headers = { Authorization: authorizationHeader };
    return fetch_1.fetchTaskEither(url, {
        method,
        headers,
    }).map(e => e.mapLeft(error => types_1.ErrorResponse.JavaScriptError({ error })));
};
const handleRequestTokenResponse = response => new Task(() => response.text()).map(text => {
    if (response.ok) {
        const parsed = querystring.parse(text);
        return Decode.validateType(types_1.TwitterAPIRequestTokenResponse)(parsed).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.getRequestToken = ({ oAuth }) => exports.fetchFromTwitter({
    oAuth,
    endpointPath: constants_1.ENDPOINTS.OAuthRequestToken,
    method: 'POST',
    query: {},
}).chain(e => e.fold(l => task.task.of(either.left(l)), handleRequestTokenResponse));
const handleAccessTokenResponse = response => new Task(() => response.text()).map(text => {
    if (response.ok) {
        const parsed = querystring.parse(text);
        return Decode.validateType(types_1.TwitterAPIAccessTokenResponse)(parsed).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.getAccessToken = ({ oAuth }) => exports.fetchFromTwitter({
    oAuth,
    endpointPath: constants_1.ENDPOINTS.OAuthAccessToken,
    method: 'POST',
    query: {},
}).chain(e => e.fold(l => task.task.of(either.left(l)), handleAccessTokenResponse));
// https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-home_timeline
const handleTimelineResponse = (response) => new Task(() => response.text()).map(text => {
    if (response.ok) {
        return Decode.jsonDecodeString(types_1.TwitterAPITimelineResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.fetchHomeTimeline = ({ oAuth, query }) => {
    const queryWithDefaults = Object.assign({}, helpers_1.defaultStatusesHomeTimelineQuery, query);
    return exports.fetchFromTwitter({
        oAuth,
        endpointPath: constants_1.ENDPOINTS.StatusesHomeTimeline,
        method: 'GET',
        query: types_1.StatusesHomeTimelineQuery.encode(queryWithDefaults),
    }).chain(e => e.fold(l => task.task.of(either.left(l)), handleTimelineResponse));
};
// https://developer.twitter.com/en/docs/accounts-and-users/manage-account-settings/api-reference/get-account-verify_credentials
const handleAccountVerifyCredentialsResponse = (response) => new Task(() => response.text()).map(text => {
    if (response.ok) {
        return Decode.jsonDecodeString(types_1.TwitterAPIAccountVerifyCredentials)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.fetchAccountVerifyCredentials = ({ oAuth }) => exports.fetchFromTwitter({
    oAuth,
    endpointPath: constants_1.ENDPOINTS.AccountVerifyCredentials,
    method: 'GET',
    query: {},
}).chain(e => e.fold(l => task.task.of(either.left(l)), handleAccountVerifyCredentialsResponse));
// https://developer.twitter.com/en/docs/accounts-and-users/manage-account-settings/api-reference/get-account-settings
const handleAccountSettingsResponse = (response) => new Task(() => response.text()).map(text => {
    if (response.ok) {
        return Decode.jsonDecodeString(types_1.TwitterAPIAccountSettings)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.fetchAccountSettings = ({ oAuth }) => exports.fetchFromTwitter({
    oAuth,
    endpointPath: constants_1.ENDPOINTS.AccountSettings,
    method: 'GET',
    query: {},
}).chain(e => e.fold(l => task.task.of(either.left(l)), handleAccountSettingsResponse));
//# sourceMappingURL=index.js.map