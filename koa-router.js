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
