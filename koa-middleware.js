var koa = require('koa');
var app = koa();
var logger = require('koa-logger'); // https://github.com/koajs/logger
var serve = require('koa-static'); // https://github.com/koajs/static

// logger middleware
app.use(logger());

// static middleware
app.use(serve(__dirname + '/web'));

app.use(function *body() {
    this.body = 'Hello FEDs';
});

var server = app.listen(5000, function() {
    console.log('Listening on port %d', server.address().port);
});
