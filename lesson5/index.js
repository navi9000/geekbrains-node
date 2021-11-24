const http = require('http')
const fs = require('fs')
const path = require('path')
const pug = require('pug')

const hostname = '127.0.0.1'
const port = 3000

let executionDir = process.cwd()

class FolderItem {
    constructor(name) {
        this.name = name
        this.type = this.getType()
    }

    getType() {
        const isFile = fs.lstatSync(path.resolve(executionDir, this.name)).isFile();
        return isFile ? 'file' : 'folder'
    }
}

const template = pug.compileFile('res/index.pug')
const contentList = dirName => fs.readdirSync(dirName)

const server = http.createServer((req, res) => {
    let type = 'folder'
    let name = ''
    
    if (req.method === 'POST') {
        let body = ''
        req.on('data', (data) => {body += data})
        req.on('end', () => {
            let params = new URLSearchParams(body.toString())
            name = params.get('name')
            type = params.get('type')
    
            if (type === 'folder') {
                executionDir = path.resolve(executionDir, name)   
            }
        })
    }

    setTimeout(() => {
        res.writeHead(200, 'Content-Type', 'text/html')
        if (type === 'file') {
            const readStream = fs.createReadStream(path.resolve(executionDir, name), 'utf-8')
            readStream.pipe(res)
        } else {
            const itemsList = contentList(executionDir).map(content => new FolderItem(content))
            const output = template({items: itemsList})
            res.end(output)
        }
    }, 5000)
})

server.listen(port, hostname, () => {
    console.log('Server is running')
})