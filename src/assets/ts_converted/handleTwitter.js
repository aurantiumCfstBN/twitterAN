"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var twitter_api_ts_1 = require("twitter-api-ts");
var option = __importStar(require("fp-ts/lib/Option"));
var jQuery_1 = __importDefault(require("jQuery"));
var twitterKeys = {
    CONSUMER_KEY: '',
    CONSUMER_SECRET: '',
    TOKEN: '',
    TOKEN_SECRET: ''
};
var button = jQuery_1.default('input[name="start"]');
button.on('click', function (e) {
    if (button.val() === 'on') {
        button.val('off');
        return;
    }
    else {
        button.val('on');
    }
    twitter_api_ts_1.fetchHomeTimeline({
        oAuth: {
            consumerKey: twitterKeys.CONSUMER_KEY,
            consumerSecret: twitterKeys.CONSUMER_SECRET,
            token: option.some(twitterKeys.TOKEN),
            tokenSecret: option.some(twitterKeys.TOKEN_SECRET),
        },
        query: {
            count: option.some(50),
        },
    })
        // We use fp-ts’ Task type, which is lazy. Running the task returns a
        // promise.
        .run()
        .then(function (response) {
        console.log(response);
        // => Either<ErrorResponse, TwitterAPITimelineResponseT>
    });
});
handlePropertiesService(['TWITTER_CONSUMER_KEY', 'TWITTER_CONSUMER_SECRET', 'TWITTER_TOKEN', 'TWITTER_TOKEN_SECRET'], 'user', 'get').then(function (value) {
    twitterKeys.CONSUMER_KEY = value.TWITTER_CONSUMER_KEY;
    twitterKeys.CONSUMER_SECRET = value.TWITTER_CONSUMER_SECRET;
    twitterKeys.TOKEN = value.TWITTER_TOKEN;
    twitterKeys.TOKEN_SECRET = value.TWITTER_TOKEN_SECRET;
});
function runServerFun(funName, _arguments) {
    return new Promise(function (resolve, reject) {
        google.script.run
            .withSuccessHandler(function (v, o) {
            try {
                resolve(JSON.parse(v), o);
            }
            catch (e) {
                resolve(v, o);
            }
        })
            .withFailureHandler(function (e, o) {
            reject(e, o);
        })
            .loadfun(funName, _arguments);
    });
}
function handlePropertiesService(value, type, doKind) {
    var emptyPromise = Promise.resolve();
    switch (doKind) {
        case "set":
            return runServerFun("handlePropertiesServiceSet", [value, type]);
        case "get":
            if (value === null || value === undefined) {
                value = [];
            }
            else if (typeof value === "string") {
                value = [value];
            }
            else if (!Array.isArray(value)) {
                return emptyPromise;
            }
            return runServerFun("handlePropertiesServiceGet", [value, type]);
        case "delete":
            if (value === null || value === undefined) {
                value = [];
            }
            else if (typeof value === "string") {
                value = [value];
            }
            else if (!Array.isArray(value)) {
                return emptyPromise;
            }
            return runServerFun("handlePropertiesServiceDelete", [value, type]);
    }
    return emptyPromise;
}
