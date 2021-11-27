const fs = require('fs')
const path = require('path')
const pug = require('pug')
require('dotenv').config()
const {FolderItem} = require('../models/FolderItem')


const template = pug.compileFile('res/index.pug')

function logRequestInfo(statusCode, req) {
    console.log(statusCode, req.method, req.url)
}

function handleError(req, res) {
    logRequestInfo(404, req)
    res.writeHead(404, {'Content-Type': 'text/html'})
    res.end('<h1>404. Not Found.</h1>')
}

function getFolder(req, res, urlParams) {
    try {
        const folderDir = path.resolve(process.env.PUBLIC_ROOT, ...urlParams)
        res.writeHead(200, {'Content-Type': 'text/html'})
        logRequestInfo(200, req)
        const itemsList = fs.readdirSync(folderDir).map(content => new FolderItem(content, folderDir))
        const output = template({items: itemsList, url: req.url.trimRight('/')})
        res.end(output)
    } catch (err) {
        handleError(req, res)
    }
}

function getFile(req, res, urlParams) {
    try {
        const fileDir = path.resolve(process.env.PUBLIC_ROOT, ...urlParams)
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
    } catch (err) {
        handleError(req, res)
    }
}

function getData(req, res) {
    try {
        const urlParams = req.url.split('/')
        const isFile = fs.lstatSync(path.resolve(process.env.PUBLIC_ROOT, ...urlParams)).isFile()
        if (isFile) {
            getFile(req, res, urlParams)
        } else {
            getFolder(req, res, urlParams)
        }
    } catch (err) {
        handleError(req, res)
    }
}

module.exports = {
    getData
}