function *consumer() {
    while (true) {
        var val = yield null;
        console.log('\nGot value', val);
    }
}

var c = consumer();
console.log(c.next(1));
console.log(c.next(2));
console.log(c.next(3));
