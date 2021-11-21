#!/usr/local/bin/node
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const inquirer = require('inquirer');
const colors = require('colors');
const yargs = require('yargs');

const options = yargs
    .usage('Usage: -d <directory> -p <pattern>')
    .option('d', {
        alias: 'directory',
        describe: 'Custom directory',
        type: 'string',
        demandOption: false,
    })
    .option('p', {
        alias: 'pattern',
        describe: 'Pattern to search',
        type: 'string',
        demandOption: false,
    })
    .argv;

function buildRegexPattern() {
    if (!options.p) return null
    const splitInput = options.p.split('/')
    if (splitInput.length === 3 && splitInput[0] === '') {
        const firstNonFlag = splitInput[2].search(/[^gimy]/)
        if (firstNonFlag === -1 || splitInput[2] === '') {
            return new RegExp('(' + splitInput[1] + ')', splitInput[2])
        }
    }
    return new RegExp('(' + options.p + ')', 'ig')
}

let executionDir = options.d ? path.resolve(__dirname, options.d) : process.cwd();
const pattern = buildRegexPattern()

try {
    fs.readdirSync(executionDir)
} catch (e) {
    console.error(colors.red('Directory not found'))
    process.exit()
}

const isFile = (fileName) => fs.lstatSync(executionDir + '\\' + fileName).isFile();
const isDir = (dirName) => fs.lstatSync(executionDir + '\\' + dirName).isDirectory();

const list = dirName => fs.readdirSync(dirName).filter(isFile);
const dirList = dirName => fs.readdirSync(dirName).filter(isDir).map(dir => '\\' + dir);

showInquire([...dirList(executionDir), ...list(executionDir)])

async function showInquire(choices) {
    const choice = await inquirer.prompt([
        {
            name: 'fileName',
            type: 'list',
            message: 'Choose a file to read:',
            choices: choices,
        },
    ])

    if (choice.fileName[0] === '\\') {
        executionDir += choice.fileName
        showInquire([...dirList(executionDir), ...list(executionDir)])
    } else {
        const fullFilePath = path.join(executionDir, choice.fileName);
        let data = fs.readFileSync(fullFilePath, 'utf-8');

        if (pattern) {
            data = data.replace(pattern, colors.green('$1'))
        }

        console.log(data);
    }
}
