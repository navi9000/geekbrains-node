const fs = require('fs')
const path = require('path')
const pug = require('pug')
require('dotenv').config()
const {FolderItem} = require('../models/FolderItem')

function getTemplate(filename) {
    return pug.compileFile(`views/${filename}.pug`)
}

function logRequestInfo(statusCode, req) {
    console.log(statusCode, req.method, req.url)
}

function handleError(req, res) {
    logRequestInfo(404, req)
    res.writeHead(404, {'Content-Type': 'text/html'})
    const output = getTemplate('error')()
    res.end(output)
}

function getFolder(req, res) {
    const folderDir = path.join(process.env.PUBLIC_ROOT, req.url)
    res.writeHead(200, {'Content-Type': 'text/html'})
    logRequestInfo(200, req)
    const itemsList = fs.readdirSync(folderDir).map(content => new FolderItem(content, folderDir))
    const output = getTemplate('folder')({items: itemsList, url: req.url})
    res.end(output)
}

function getFile(req, res) {
    const fileDir = path.join(process.env.PUBLIC_ROOT, req.url)
    const fileContent = fs.createReadStream(fileDir)
    if (req.url.match(/\.ico$/)) {
        res.writeHead(200, {'Content-Type': 'image/x-icon'})
    } else if (req.url.match(/\.png$/)) {
        res.writeHead(200, {'Content-Type': 'image/png'})
    } else if (req.url.match(/\.css$/)) {
        res.writeHead(200, {'Content-Type': 'text/css'})
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain'})
    }
    logRequestInfo(200, req)
    fileContent.pipe(res)
}

function getData(req, res) {
    try {
        const isFile = fs.lstatSync(path.join(process.env.PUBLIC_ROOT, req.url)).isFile()
        if (isFile) {
            getFile(req, res)
        } else {
            getFolder(req, res)
        }
    } catch (err) {
        handleError(req, res)
    }
}

module.exports = {
    getData
}