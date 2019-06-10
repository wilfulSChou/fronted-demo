const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 文件名
const fullFileName = path.join(__dirname, '../', '../', 'logs', 'access.log')
console.log('fullFileName', )
// 创建read stream
const readStream = fs.createReadStream(fullFileName)

const rl = readline.createInterface({
    input: readStream
})

let sum = 0
let chromeNum = 0
rl.on('line', lineData => {
    if (!lineData) {
        return
    }
    sum++
    const arr = lineData.split('--')
    if (arr[3] && arr[3].indexOf('Chrome') > 0) {
        chromeNum++
    }
})

rl.on('close', () => {
    console.log('Chrome占比：', chromeNum/sum)
})