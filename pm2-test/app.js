const http = require('http')

const server = http.createServer((req, res) => {
    console.log('模拟日志', Date.now());
    console.error('假装出错', Date.now());
    if (req.url === '/err') {
        throw new Error('error...')
    }
    res.setHeader('Content-type', 'application/json')
    res.end(
        JSON.stringify({
            errno: 0,
            msg: 'pm2 test server 3'
        })
    )
})

server.listen(3000, () => {
    console.log('server运行在3000端口');
})