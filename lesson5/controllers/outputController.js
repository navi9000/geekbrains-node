const fs = require('fs')
const path = require('path')
const pug = require('pug')
const { outputModifier } = require('../helpers')
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

async function getFile(req, res) {
    const fileDir = path.join(process.env.PUBLIC_ROOT, req.url)
    if (req.url.match(/\.ico$/)) {
        const fileContent = fs.createReadStream(fileDir)
        res.writeHead(200, {'Content-Type': 'image/x-icon'})
        logRequestInfo(200, req)
        fileContent.pipe(res)
    } else if (req.url.match(/\.png$/)) {
        const fileContent = fs.createReadStream(fileDir)
        res.writeHead(200, {'Content-Type': 'image/png'})
        logRequestInfo(200, req)
        fileContent.pipe(res)
    } else if (req.url.match(/\.css$/)) {
        const fileContent = fs.readFileSync(fileDir, 'utf-8')
        if (process.env.PATTERN) {
            const modifiedFileContent = await outputModifier(fileContent)
            console.log(modifiedFileContent)
        }
        res.writeHead(200, {'Content-Type': 'text/css'})
        logRequestInfo(200, req)
        res.end(fileContent)
    } else {
        const fileContent = fs.readFileSync(fileDir, 'utf-8')
        if (process.env.PATTERN) {
            const modifiedFileContent = await outputModifier(fileContent)
            console.log(modifiedFileContent)
        }
        res.writeHead(200, {'Content-Type': 'text/plain'})
        logRequestInfo(200, req)
        res.end(fileContent)
    }
}

async function getData(req, res) {
    try {
        const isFile = fs.lstatSync(path.join(process.env.PUBLIC_ROOT, req.url)).isFile()
        if (isFile) {
            await getFile(req, res)
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