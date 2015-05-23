// Librairies
var express = require('express'),
    app = express.createServer();

var http = require('http'),
    config = require('./config')();

app.configure(function () {
});

app.listen(config.appPort);

var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: config.twitterApiKey,
  consumer_secret: config.twitterSecret,
  access_token_key: config.twitterAccessToken,
  access_token_secret: config.twitterAccessSecret
});

console.log(client);
 
var params = {screen_name: '@letsGoChatHere'};

client.stream('statuses/filter', {track: '@letsGoChatHere'}, function(stream) {
    console.log("Stream start");

  stream.on('data', function(tweet) {
    var jsonTweet = JSON.stringify(tweet);
    var post_options = {
      host: 'localhost',
      port: '4444',
      path: '/api/discussions',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': jsonTweet.length
      }
    };

    var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
    });

    // post the data
    post_req.write(jsonTweet);
    post_req.end();
  });
 
  stream.on('error', function(error) {
    console.log(error);
    throw error;
  });
});