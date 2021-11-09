const colors = require('colors')
const arguments = process.argv.slice(2).map(input => +input)

// Функция для вывода сообщений об ошибках и выходе из программы
function throwErrorMessage(message) {
    console.log(colors.red(message))
    process.exit()
}

// Функция для проверки чисел.
// Если переданное число простое, возвращает true.
// Иначе возвращает false
function isPrimeNumber(number) {
    if (number < 2) return false
    for (let i = 2; i < number; i++) {
        if (number % i === 0) return false
    }
    return true
}

// Проверка, что введены 2 числа
if (arguments.length !== 2) {
    throwErrorMessage('Error! Incorrect input. Usage: node index.js number1 number2')
}
if (arguments.some(input => Number.isNaN(input))) {
    throwErrorMessage('Error! Both inputs must be numbers')
}

// Переставляю два числа в порядке возрастания
arguments.sort((num1, num2) => num1 - num2)

// Округляю введенные числа
const roundedArguments = [Math.ceil(arguments[0]), Math.floor(arguments[1])]

// Массив простых чисел
let primeNumbers = []


// Цикл из массива длиной в разность округленных введенных чисел плюс 1
// Если число простое, добавляю его в массив простых чисел
for (index in [...Array(roundedArguments[1] - roundedArguments[0] + 1).keys()]) {
    let currentNumber = roundedArguments[0] + +index
    if (isPrimeNumber(currentNumber)) {
        primeNumbers.push(currentNumber)
    }
}

// Если массив простых чисел пустой, сообщаю об этом
if (primeNumbers.length === 0) {
    throwErrorMessage('No prime numbers')
}

// Вывожу простые числа на экран
console.log('\nPRIME NUMBERS:\n')
for (index in primeNumbers) {
    if (index % 3 === 0) {
        console.log(colors.green(primeNumbers[index]))
    } else if (index % 3 === 1) {
        console.log(colors.yellow(primeNumbers[index]))
    } else {
        console.log(colors.red(primeNumbers[index]))
    }
}
console.log('')