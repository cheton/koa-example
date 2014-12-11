//
// https://github.com/koajs/koa/blob/master/docs/guide.md
//
var koa = require('koa');
var app = koa();

/**
 * @description 
 * @params next it's a handle to the subsequent middleware function
 *
 * app.use(function *(next) {
 *     yield next;
 * });
 */

// responseTime: track how long it takes for a request to propagate through Koa by adding an 'X-Response-Time' header field
app.use(function *responseTime(next) {
    console.log('[1] responseTime: start');
    var start = new Date;
    yield next;
    var ms = new Date - start;
    this.set('X-Response-Time', ms + 'ms');
    console.log('[1] responseTime: end');
});

// logger
app.use(function *logger(next){
    console.log('[2] logger: start');
    var start = new Date;
    yield next;
    var used = new Date - start;
    console.log('> method=%s originalUrl=%s status=%s used=%sms', this.method, this.originalUrl, this.status, used);
    console.log('[2] logger: end');
});

// contentLength
app.use(function *contentLength(next){
    console.log('[3] contentLength: start');
    yield next;
    if ( ! this.body) {
        return;
    }
    this.set('Content-Length', this.body.length);
    console.log('[3] contentLength: end');
});

// body
app.use(function *body(next){
    console.log('[4] body: start');
    yield next;
    if (this.path !== '/') {
        return;
    }
    this.body = 'Hello FEDs';
    console.log('[4] body: end');
});

app.listen(5000);
