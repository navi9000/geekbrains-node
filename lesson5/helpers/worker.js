const worker_threads = require('worker_threads')
const colors = require('colors')
const { buildRegexPattern } = require('.')

const data = worker_threads.workerData
const pattern = buildRegexPattern(process.env.PATTERN)
const modifiedData = data.replace(pattern, colors.green('$1'))

worker_threads.parentPort.postMessage(modifiedData)

