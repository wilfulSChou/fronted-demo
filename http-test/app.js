const http = require('http')
const querystring = require('querystring')

// const server = http.createServer((req, res) => {
//     console.log('method:', req.method)
//     const url = req.url
//     console.log('url:', url)
//     req.query = querystring.parse(url.split('?')[1])
//     console.log('query:', req.query)
//     res.end(JSON.stringify(req.query))
// })

const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    const query = url.split('?')[1]

    // 设置返回格式为JSON
    res.setHeader('Content-type', 'application/json')

    // 返回的数据
    const resData = {
        method,
        url,
        path,
        query
    }

    // 返回
    if (method === 'GET') {
        res.end(JSON.stringify(resData))
    }
    if (method === 'POST') {
         let postData = ''
         req.on('data', chunk => {
             postData += chunk.toString()
         })
         req.on('end', () => {
             resData.postData = postData
             res.end(JSON.stringify(resData))
         })
    }
})

server.listen(3000, () => {
    console.log('OK')
})