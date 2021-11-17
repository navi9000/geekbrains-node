const EventEmitter = require('events')
const colors = require('colors')
const moment = require('moment')

const inputs = process.argv.slice(2)

function throwErrorMessage(message) {
    console.error(colors.red(message))
    process.exit()
}

function checkInputFormat(string) {
    if (!moment(string, 'hh-DD-MM-YYYY', true).isValid()) {
        throwErrorMessage('Error! Incorrect input. Input format: hh-DD-MM-YYYY')
    }
}

inputs.forEach(input => checkInputFormat(input))

const emitter = new EventEmitter

const logHandler = index => {
    if (moment().diff(moment(inputs[index], 'hh-DD-MM-YYYY'), 'seconds') > -1) {
        emitter.emit('timeup', index)
        return
    }
    console.log(`Timer no. ${+index + 1} expires ` + moment().to(moment(inputs[index], 'hh-DD-MM-YYYY')))
}
const timeUpHandler = index => {
    clearInterval(timeIntervalIds[index])
    console.log(`Timer no. ${+index + 1}: Alert! Time is up!`)
}

emitter.on('log', logHandler)
emitter.on('timeup', timeUpHandler)

let timeIntervalIds = []
for (let input in inputs) {
    timeIntervalIds.push(setInterval(() => emitter.emit('log', input), 1000))
}

