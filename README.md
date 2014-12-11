![](https://raw.githubusercontent.com/cheton/koa-example/master/koa.png)

Expressive middleware for node.js using generators via [co](https://github.com/visionmedia/co) to make web applications and APIs more enjoyable to write. Koa's middleware flow in a stack-like manner allowing you to perform actions downstream, then filter and manipulate the response upstream. Koa's use of generators also greatly increases the readability and robustness of your application.

Only methods that are common to nearly all HTTP servers are integrated directly into Koa's small ~550 SLOC codebase. This includes things like content-negotiation, normalization of node inconsistencies, redirection, and a few others.

No middleware are bundled with koa. If you prefer to only define a single dependency for common middleware, much like Connect, you may use [koa-common](https://github.com/koajs/common).

## Installation

    $ npm install koa

To use Koa you must be running node 0.11.9 or higher for generator support, and must run node(1) with the --harmony flag. If you don't like typing this, add an alias to your shell profile:

    alias node='node --harmony'


## Resources

 - Expressive middleware for node.js using generators 
    http://koajs.com
    https://github.com/koajs/koa

 - What's is this things called Generators?
    http://tobyho.com/2013/06/16/what-are-generators/

 - Next-gen Express: Building a simple webserver with Koa.js
    http://www.olindata.com/blog/2014/06/next-gen-express-building-simple-webserver-koajs

 - Docs
    https://github.com/koajs/koa/tree/master/docs

 - Docs > Guide
    https://github.com/koajs/koa/blob/master/docs/guide.md

 - Example Koa apps
    https://github.com/koajs/examples

## Generators

naturalNumbers.js
```js
function *naturalNumbers() {
    var n = 1;
    while (n < 3) {
        yield n++;
    }
}

//for (var number of naturalNumbers()) {
//    console.log('numbers is ', number);
//}

var numbers = naturalNumbers();
console.log(numbers.next()); // { value: 1, done: false }
console.log(numbers.next()); // { value: 2, done: false }
console.log(numbers.next()); // { value: undefined, done: true }
```

fibonacci.js
```js
function *fibonacci() {
    var prev = 0, curr = 1, tmp;
    while (true) {
        tmp = prev;
        prev = curr;
        curr = tmp + curr;

        yield curr;
    }
}

var seq = fibonacci(); // returns a iterator object

console.log(seq.next().value); // returns 1
console.log(seq.next().value); // returns 2
console.log(seq.next().value); // returns 3
console.log(seq.next().value); // returns 5
```

consumer.js
```js
function *consumer() {
    while (true) {
        var val = yield null;
        console.log('\nGot value', val);
    }
}

var c = consumer();
console.log(c.next(1));
    // { value: null, done: false }
console.log(c.next(2));
    // Got value 2
    // { value: null, done: false }
console.log(c.next(3));
    // Got value 3
    // { value: null, done: false }
```

## Koa Examples

koa-basic.js
```js
var koa = require('koa');
var app = koa();

app.use(function *body() {
    this.body = 'Hello FEDs';
});

app.listen(5000);
```

koa-middleware.js
```js
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
```

koa-router.js
```js
var koa = require('koa');
var router = require('koa-router'); // https://github.com/alexmingoia/koa-router
var app = koa();

app.use(router(app)); // register method get

// After the router has been initialized you can register routes:
app.get('/example', function *example() {
    this.body = 'Example route';
});

app.use(function *body() {
    this.body = 'Hello FEDs';
});

app.listen(5000);
```

koa-custom.js
```js
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
```

## The Promise

The following paragraph is originated from:
http://tobyho.com/2013/06/16/what-are-generators/ 

In Javascript, especially in Node, IO operations are generally done as asynchronous operations that require a callback. When you have to do multiple async operations one after another it looks like this:
```js
fs.readFile('blog_post_template.html', function(err, tpContent) {
    fs.readFile('my_blog_post.md', function(err, mdContent) {
        resp.end(template(tpContent, markdown(String(mdContent))));
    });
});
```

It gets worse when you add in error handling:
```js
fs.readFile('blog_post_template.html', function(err, tpContent) {
    if (err) {
        resp.end(err.message);
        return;
    }
    fs.readFile('my_blog_post.md', function(err, mdContent) {
        if (err) {
            resp.end(err.message);
            return;
        }
        resp.end(template(tpContent, markdown(String(mdContent))));
    });
});
```

The promise of generators is that you can now write the equivalent code in a straight-line fashion using generators:
```js
try {
    var tpContent = yield readFile('blog_post_template.html');
    var mdContent = yield readFile('my_blog_post.md');
    resp.end(template(tpContent, markdown(String(mdContent))));
} catch(e){
    resp.end(e.message);
}
```

This is fantastic! Aside from less code and asthetics, it also has these benefits:

Line independence: the code for one operation is no longer tied to the ones that come after it. If you want to reorder of operations, simply switching the lines. If you want to remove an operation, simply deleting the line.
Simpler and DRY error handling: where as the callback-based style required error handling to be done for each individual async operation, with the generator-based style you can put one try/catch block around all the operations to handle errors uniformly - generators gives us back the power of try/catch exception handling.

The first thing to realize is that the async operations need to take place outside of the generator function. This means that some sort of "controller" will need to handle the execution of the generator, fulfill async requests, and return the results back. So we'll need to pass the generator to this controller, for which we'll just make a run() function:
```js
run(function*(){
    try{
        var tpContent = yield readFile('blog_post_template.html');
        var mdContent = yield readFile('my_blog_post.md');
        resp.end(template(tpContent, markdown(String(mdContent))));
    } catch(e){
        resp.end(e.message);
    }
});
```

run() has the responsibility of calling the generator object repeatedly via next(), and fulfill a request each time a value is yielded. It will assume that the requests it receives are functions that take a single callback parameter which takes an err, and another value argument - conforming to the Node style callback convention. When err is present, it will call throw() on the generator object to propagate it back into the generator's code path. The code for run() looks like:
```js
function run(genfun) {
    // instantiate the generator object
    var gen = genfun();
    // This is the async loop pattern
    function next(err, answer) {
        var res;
        if (err) {
            // if err, throw it into the wormhole
            return gen.throw(err);
        } else {
            // if good value, send it
            res = gen.next(answer);
        }
        if ( ! res.done) {
            // if we are not at the end
            // we have an async request to
            // fulfill, we do this by calling 
            // `value` as a function
            // and passing it a callback
            // that receives err, answer
            // for which we'll just use `next()`
            res.value(next);
        }
    }
    // Kick off the async loop
    next();
}
```

Now given that, readFile takes the file path as parameter and needs to return a function:
```js
function readFile(filepath) {
    return function(callback) {
        fs.readFile(filepath, callback);
    }
}
```
