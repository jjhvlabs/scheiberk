//read all files in sampledata and parse as json:
const fs = require('fs')
const path = require('path')
const sampleData = {}
fs.readdirSync(path.join(__dirname, 'sampledata')).forEach(file => {
  sampleData[file.split('.')[0]] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'sampledata', file)),
  )
})

module.exports = sampleData
