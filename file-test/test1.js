const fs = require('fs')
const path = require('path')

const filename = path.resolve(__dirname, 'data.txt')

// // 读取文件内容
// fs.readFile(filename, (err, data) => {
//     if (err) {
//         console.error(err)
//         return
//     }
//     // data是二进制类型，需要转成字符串
//     console.log(data.toString())
// })

// // 写入文件
// const content = '这是新写入的内容\n'
// const opt = {
//     flag: 'a' // 追加写入，覆盖写入用'w'
// }
// fs.writeFile(filename, content, opt, (err) => {
//     if (err) {
//         console.error(err)
//     }
// })

// // 判断文件是否存在
// fs.exists(filename, (exist) => {
//     console.log('exist', exist)
// })
