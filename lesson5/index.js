const http = require('http')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const {getData} = require('./controllers/outputController')
const socket = require('socket.io')
const {Folder} = require('./models/Folder')
const yargs = require('yargs')

const options = yargs
    .usage('Usage: -d <directory> -p <pattern>')
    .option('p', {
        alias: 'pattern',
        describe: 'Pattern to search',
        type: 'string',
        demandOption: false,
    })
    .argv;

const port = process.env.PORT
const hostname = process.env.HOST_NAME
process.env.APP_ROOT = process.cwd()
process.env.PUBLIC_ROOT = path.resolve(process.cwd(), process.env.PUBLIC_DIR)
if (options.p) {
    process.env.PATTERN = options.p
}

const server = http.createServer(async (req, res) => {
    await getData(req, res)
})

// server.on('close', () => {
//     visitors.saveData()
// })

// process.on('SIGINT', function() {
//     server.close()
// })

const io = socket(server)

io.on('connection', client => {
    client.on('send_url', data => {
        const fld = new Folder(data.url)
        const payload = {
            url: data.url,
            visitors: fld.getVisitors()
        }
        io.emit('send_visitors', payload)
    })
})

server.listen(port, hostname, () => {
    console.log(`Server is running at ${hostname}:${port}`)
})