const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    console.log(req.method) // GET
    const url = req.url // 获取请求的完整url
    req.query = querystring.parse(url.split('?')[1]) // 解析querystring
    res.end(JSON.stringify(req.query)) //将querystring返回
})

server.listen(3000, () => {
    console.log('listening on 3000 port')
})