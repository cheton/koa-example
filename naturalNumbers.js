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
