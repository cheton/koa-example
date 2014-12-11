var koa = require('koa');
var app = koa();

app.use(function *body() {
    this.body = 'Hello FEDs';
});

app.listen(5000);
