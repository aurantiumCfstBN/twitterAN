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
      'https://api.twitter.com/1.1/search/tweets.json?q=ブルーナポレオン&count=15',
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
    Logger.log(response);
  }
  