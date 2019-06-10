// 标准输入输出
// process.stdin.pipe(process.stdout)

// const http = require('http')
// const server = http.createServer((req, res) => {
//     if (req.method === 'POST') {
//         req.pipe(res) //最主要
//     }
// })
// server.listen(8000)


// // 复制文件
// const fs = require('fs')
// const path = require('path')

// const filename1 = path.resolve(__dirname, 'data.txt')
// const filename2 = path.resolve(__dirname, 'data-bak.txt')

// const readStream = fs.createReadStream(filename1)
// const writeStream = fs.createWriteStream(filename2)

// readStream.pipe(writeStream)
// readStream.on('data', chunk => {
//     console.log(chunk.toString())
// })
// readStream.on('end', () => {
//     console.log('copy done')
// })

const fs = require('fs')
const path = require('path')
const http = require('http')
const filename1 = path.resolve(__dirname, 'data.txt')
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const readStream = fs.createReadStream(filename1)
        readStream.pipe(res)
    }
})
server.listen(8000)
