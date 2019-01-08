"1CXDCY5sqT9ph64fFwSzVtXnbjpSfWdRymafDrtIZ7Z_hwysTY7IIhi7s";

var key = handlePropertiesServiceGet([
    'TWITTER_CONSUMER_KEY',
    'TWITTER_CONSUMER_SECRET',
    'TWITTER_TOKEN',
    'TWITTER_TOKEN_SECRET'
], "script");

function init(){
  var TwitterWebService_ = function (param) {
    this.consumer_key    = param.consumer_key;
    this.consumer_secret = param.consumer_secret;
    this.token    = param.token;
    this.token_secret = param.token_secret;
  }
  
  TwitterWebService_.getInstance = function(param) {
    return new TwitterWebService_(param);
  }
  
  TwitterWebService_.prototype.getService = function() {
    return OAuth1.createService('Twitter')
      .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
      .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
      .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
      .setConsumerKey(this.consumer_key)
      .setConsumerSecret(this.consumer_secret)
      .setAccessToken(this.token, this.token_secret)
      .setCallbackFunction('authCallback')
      .setPropertyStore(PropertiesService.getUserProperties())
  }
  
  TwitterWebService_.prototype.authorize = function() {
    var service = this.getService();
    if (service.hasAccess()) {
      Logger.log('Already authorized');
    } else {
      var authorizationUrl = service.authorize();
      Logger.log('Open the following URL and re-run the script: %s', authorizationUrl);
    }
  }
  
  TwitterWebService_.prototype.reset = function() {
    var service = this.getService();
    service.reset();
  }
  
  TwitterWebService_.prototype.authCallback = function(request) {
    var service      = this.getService();
    var isAuthorized = service.handleCallback(request);
    var mimeType     = ContentService.MimeType.TEXT;
    if (isAuthorized) {
      return ContentService.createTextOutput('Success').setMimeType(mimeType);
    } else {
      return ContentService.createTextOutput('Denied').setMimeType(mimeType);
    }
  }
  return TwitterWebService_;
}


var TwitterWebService = init();

var twitter = TwitterWebService.getInstance({
  consumer_key : key.TWITTER_CONSUMER_KEY,
  consumer_secret : key.TWITTER_CONSUMER_SECRET,
  token : key.TWITTER_TOKEN,
  token_secret : key.TWITTER_TOKEN_SECRET
});

var folderId = "1CvDzSeTFAKO-oO86Wb0Hnhwe-IBK2W5s";
var outputFolder = DriveApp.getFolderById(folderId);

// 認証
function authorize() {
    twitter.authorize();
}
// 認証解除
function reset() {
    twitter.reset();
}
// 認証後のコールバック
function authCallback(request) {
    return twitter.authCallback(request);
}
// ツイートを投稿
function postUpdateStatus() {
    var service = twitter.getService();
    var response = service.fetch('https://api.twitter.com/1.1/statuses/update.json', {
        method: 'post',
        payload: { status: "test" }
    });
}

function runByEventTrigger(){
  var startHour = 15;
  var endHour = 18;


  var now = new Date();

  if(now.getHours() < startHour || now.getHours() > endHour){
    console.log("out of time");
    return;
  }
  console.log("start runByEventTrigger");

  var key = handlePropertiesServiceGet([
    'TWITTER_CONSUMER_KEY',
    'TWITTER_CONSUMER_SECRET',
    'TWITTER_TOKEN',
    'TWITTER_TOKEN_SECRET'
  ], "script");
  var TwitterWebService = init();

  var twitter = TwitterWebService.getInstance({
    consumer_key : key.TWITTER_CONSUMER_KEY,
    consumer_secret : key.TWITTER_CONSUMER_SECRET,
    token : key.TWITTER_TOKEN,
    token_secret : key.TWITTER_TOKEN_SECRET
  });

  var folderId = "1CvDzSeTFAKO-oO86Wb0Hnhwe-IBK2W5s";
  var outputFolder = DriveApp.getFolderById(folderId);

  searchRegularly(twitter,outputFolder);
}

function searchRegularly(_twitterService,_outputFolder){
  if(_twitterService == null)  _twitterService = twitter;
  if(_outputFolder == null)  _outputFolder = outputFolder;
  const repeatTime = 40;
  const runTime = 250; //sec
  const sleepTime = runTime * 1000 / repeatTime;  //millisec
  var result = [];
  var start = (new Date()).getTime();

  console.log("post httpRequest");
  for(var i=0; i<repeatTime; i++){
    while((new Date()).getTime() - start < sleepTime*i){
      Utilities.sleep(100);
    }
    result = result
      .concat(search(_twitterService))
      .filter((v,i,s) => {
        return s.findIndex(_v => {
          return v.id === _v.id;
        }) === i;
      });
    }
    (function(){
      var _t = (new Date()).getTime();
      console.log("save");
      console.log("time : " + (_t - start));
    })();
  var d = new Date();
  var fileName = [
    "searchPs_",
    d.getFullYear(),
    ("00" + (d.getMonth() + 1)).slice(-2),
    ("00" + d.getDate()).slice(-2),
    "_",
    ("00" + d.getHours()).slice(-2),
    ("00" + d.getMinutes()).slice(-2),
    ("00" + d.getSeconds()).slice(-2),
    "_",
    ("0000" + d.getMilliseconds()).slice(-4),
    ".json"
  ].join("");
  saveToDrive(_outputFolder, fileName, result, {"JSON_visible":true});
}

// ツイートを検索
function search(_twitterService) {
    var service = _twitterService.getService();
    //var response = service.fetch('https://api.twitter.com/1.1/search/tweets.json?q=%22%E3%83%96%E3%83%AB%E3%83%8A%E3%83%9D%22%20OR%20%22%E3%83%96%E3%83%AB%E3%83%BC%E3%83%8A%E3%83%9D%E3%83%AC%E3%82%AA%E3%83%B3%22%20OR%20%40hoge%20exclude%3Aretweets&count=100', { method: 'get' });
    var response = service.fetch('https://api.twitter.com/1.1/search/tweets.json?q=%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E3%81%97%E3%81%A6%E3%80%81%E3%81%93%E3%81%AE%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%82%92RT%E3%81%97%E3%81%9F%E3%82%89%E8%BF%94%E4%BF%A1%E3%81%8C%E5%B1%8A%E3%81%8D%E3%81%BE%E3%81%99%E3%82%88%EF%BC%81%E6%9C%9F%E9%96%93%E4%B8%AD%E6%AF%8E%E6%97%A5%E6%8A%95%E7%A8%BF%E3%81%99%E3%82%8B%E3%81%AE%E3%81%A7%E3%80%81%E6%AC%A0%E3%81%8B%E3%81%95%E3%81%9A%E3%83%81%E3%83%A3%E3%83%AC%E3%83%B3%E3%82%B8%E3%81%97%E3%81%BE%E3%81%97%E3%82%87%E3%81%86%EF%BC%81%E2%80%BB%E6%B7%B7%E9%9B%91%E3%81%AB%E3%82%88%E3%82%8A%E8%BF%94%E4%BF%A1%E3%81%AB%E3%81%8A%E6%99%82%E9%96%93%E3%81%8B%E3%81%8B%E3%82%8B%E5%A0%B4%E5%90%88%E3%81%8C%E3%81%82%E3%82%8A%E3%81%BE%E3%81%99&count=100', { method: 'get' });
    /*
    var response = service.fetch('https://api.twitter.com/1.1/search/tweets.json?', {
      method: 'get',
      payload: {
        query: 'ブルーナポレオン',
        count: 10
      }
    });
    */

    var createdDateOfData = (new Date()).toJSON();

    var data = JSON.parse(response.getContentText()).statuses.map((v,i,s) => {
      var dataPiece = {};
      [
        "id",
        "name",
        "screen_name",
        "description",
        "followers_count",
        "friends_count",
        "created_at",
        "favourites_count",
        "statuses_count",
      ].forEach(key => {
        dataPiece[key] = v.user[key];
      });
      dataPiece.createdOfData = createdDateOfData;
      return dataPiece;
    });

    return data;
}

function saveToDrive(folder, fileName, content, option){
  option = (option === null || option === undefined ? {} : option);
  folder.createFile(
    fileName,
    (
      option.JSON_visible === true ?
      JSON.stringify(content, null, "  ") :
      JSON.stringify(content)
    )
  );
}

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}