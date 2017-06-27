var http = require('follow-redirects').http;
var https = require('follow-redirects').https;

console.log("follow-redirects");

/*
http.get('http://bit.ly/900913', function (response) {
  response.on('data', function (chunk) {
    console.log(chunk);
  });
}).on('error', function (err) {
  console.error(err);
});
*/

http.request({
  host: 'bitly.com',
  path: '/UHfDGO',
}, function (response) {
  console.log(response.responseUrl);
  // 'http://duckduckgo.com/robots.txt' 
});