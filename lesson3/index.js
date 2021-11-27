const fs = require('fs')

const file = 'access.log'

let savedData = ''

const readStream = fs.createReadStream(file, { encoding: 'utf-8', highWaterMark: 1024 })

readStream.on('data', chunk => {
    let splitChunk = chunk.split('\n').filter(res => res !== '')
    splitChunk[0] = savedData + splitChunk[0]
    let lastElement = ''
    if (splitChunk[splitChunk.length - 1].search(/\n/)) {
        lastElement = splitChunk.pop()
    }
    splitChunk.forEach(element => {
        if (element) {
            let searchResult = element.match(/^\d+\.\d+\.\d+\.\d+/)
            if (searchResult && (searchResult[0] === '89.123.1.41' || searchResult[0] === '34.48.240.111')) {
                fs.writeFile(searchResult[0] + '_requests.log', searchResult['input'] + '\n', { flag: 'a' }, () => { })
            }

        }
    })
    savedData = lastElement
})