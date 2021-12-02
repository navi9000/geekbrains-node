const worker_threads = require('worker_threads')

function buildRegexPattern(str) {
    if (!str) return null
    const splitInput = str.split('/')
    if (splitInput.length === 3 && splitInput[0] === '') {
        const firstNonFlag = splitInput[2].search(/[^gimy]/)
        if (firstNonFlag === -1 || splitInput[2] === '') {
            return new RegExp('(' + splitInput[1] + ')', splitInput[2])
        }
    }
    return new RegExp('(' + str + ')', 'ig')
}

function outputModifier(data) {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads.Worker('./helpers/worker.js', {
            workerData: data,
        });
  
        worker.on('message', resolve)
        worker.on('error', reject)
    });
}

module.exports = {
    buildRegexPattern,
    outputModifier
}