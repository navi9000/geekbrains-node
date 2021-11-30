const fs = require('fs')
const path = require('path')

class FolderItem {
    constructor(name, dir) {
        this.name = name
        this.dir = dir
        this.type = this.getType()
    }

    getType() {
        const isFile = fs.lstatSync(path.resolve(this.dir, this.name)).isFile();
        return isFile ? 'file' : 'folder'
    }
}

module.exports = {
    FolderItem
}

