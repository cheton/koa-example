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
