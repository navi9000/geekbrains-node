const http = require('http')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const {getData} = require('./controllers/outputController')

const port = process.env.PORT
const hostname = process.env.HOST_NAME
process.env.PUBLIC_ROOT = path.resolve(process.cwd(), process.env.PUBLIC_DIR)

const server = http.createServer((req, res) => {
    getData(req, res)
})

server.listen(port, hostname, () => {
    console.log(`Server is running at ${hostname}:${port}`)
})