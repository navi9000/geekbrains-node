const fs = require('fs')
const path = require('path')

class Folder {
    constructor(url) {
        this.url = this.trimUrl(url)
        this.dir = path.join(process.env.PUBLIC_ROOT, this.url)
        this.visited = this.fetchVisitors()
    }

    fetchVisitors() {
        try {
            const fileData = fs.readFileSync(path.resolve(process.env.APP_ROOT, 'res', 'log.json')).toString()
            const parsedData = JSON.parse(fileData)
            const updatedNumber = parsedData[this.url] + 1 || 1
            fs.writeFileSync(path.resolve(process.env.APP_ROOT, 'res', 'log.json'), JSON.stringify({...parsedData, [this.url]: updatedNumber}))
            return updatedNumber

        } catch {
            fs.writeFileSync(path.resolve(process.env.APP_ROOT, 'res', 'log.json'), JSON.stringify({[this.url]: 1}))
            return 1
        }
    }

    trimUrl(url) {
        if (url !== '/' && url.endsWith('/')) return url.slice(0, -1)
        return url
    }
    
    getVisitors() {
        return this.visited
    }
}

module.exports = {
    Folder
}