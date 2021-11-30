const http = require('http')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const {getData} = require('./controllers/outputController')
const socket = require('socket.io')
const {Folder} = require('./models/Folder')

const port = process.env.PORT
const hostname = process.env.HOST_NAME
process.env.APP_ROOT = process.cwd()
process.env.PUBLIC_ROOT = path.resolve(process.cwd(), process.env.PUBLIC_DIR)

const server = http.createServer((req, res) => {
    getData(req, res)
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