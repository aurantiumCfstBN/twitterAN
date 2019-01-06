var key = handlePropertiesServiceGet([
    'TWITTER_CONSUMER_KEY',
    'TWITTER_CONSUMER_SECRET',
    'TWITTER_TOKEN',
    'TWITTER_TOKEN_SECRET'
  ],"script");
  
  var twitter = TwitterWebService.getInstance(
    key.TWITTER_CONSUMER_KEY,       // 作成したアプリケーションのConsumer Key
    key.TWITTER_CONSUMER_SECRET  // 作成したアプリケーションのConsumer Secret
  );

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
    var service  = twitter.getService();
    var response = service.fetch('https://api.twitter.com/1.1/statuses/update.json', {
      method: 'post',
      payload: { status: "test" }
    });
  }
  
  // ツイートを検索
  function search() {
    var service  = twitter.getService();
    var response = service.fetch(
      'https://api.twitter.com/1.1/search/tweets.json?q=ブルーナポレオン&count=100',
      {method:'get'}
    );
    /*
    var response = service.fetch('https://api.twitter.com/1.1/search/tweets.json', {
      method: 'get',
      payload: {
        q: '"ブルナポ" OR "ブルーナポレオン" OR @hoge exclude:retweets',
        count: 10
      }
    });
    */
    var d = new Date();
    outputFolder.createFile(
        [
            "TL_",
            d.getFullYear(),
            ("00"+(d.getMonth()+1)).slice(-2),
            ("00" + d.getDate()).slice(-2),
            "_",
            ("00" + d.getHours()).slice(-2),
            ("00" + d.getMinutes()).slice(-2),
            ("00" + d.getSeconds()).slice(-2),
            "_",
            ("0000" + d.getMilliseconds()).slice(-4),
            ".json"
        ].join(""),
      JSON.stringify(JSON.parse(response.getContentText()), null , "  ")
    );
  }
  