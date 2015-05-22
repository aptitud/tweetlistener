// Librairies
var express = require('express'),
    app = express.createServer();

var http = require('http'),
    config = require('./config');

app.configure(function () {
});

app.listen(config.appPort);

var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: config.tweetApiKey,
  consumer_secret: config.twitterSecret,
  access_token_key: config.twitterAccessToken,
  access_token_secret: config.twitterAccessSecret
});
 
var params = {screen_name: 'nodejs'};
client.stream('statuses/filter', {track: 'javascript'}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
  });
 
  stream.on('error', function(error) {
    throw error;
  });
});