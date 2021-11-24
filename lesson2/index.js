const EventEmitter = require('events')
const colors = require('colors')
const moment = require('moment')

const emitter = new EventEmitter

const logHandler = timestamp => timestamp.logMessage()
const timeUpHandler = timestamp => timestamp.stopTimer()

emitter.on('log', logHandler)
emitter.on('timeup', timeUpHandler)

class CustomTimestamp {
    constructor(string, index) {
        if (!moment(string, 'hh-DD-MM-YYYY', true).isValid()) {
            console.error(colors.red('Error! Incorrect input. Input format: hh-DD-MM-YYYY'))
            process.exit()
        }
        this.time = moment(string, 'hh-DD-MM-YYYY')
        this.index = +index
        this.timeIntervalId = setInterval(() => emitter.emit('log', this), 1000)
    }

    logMessage() {
        if (moment().diff(this.time, 'seconds') > -1) {
            emitter.emit('timeup', this)
            return
        }
        console.log(`Timer no. ${this.index + 1} expires ` + moment().to(this.time))
    }

    stopTimer() {
        clearInterval(this.timeIntervalId)
        console.log(`Timer no. ${this.index + 1}: Alert! Time is up!`)
    }
}

process.argv.slice(2).forEach((input, index) => new CustomTimestamp(input, index)) || console.error(colors.red('No time input'))