const express = require('express')

//本次http请求的实例
const app = express()

app.use((req, res, next) => {
    console.log('请求开始。。。', req.method, req.url)
    next()
})

app.use((req, res, next) => {
    // 假设在处理cookie
    req.cookie = {
        userId: 'ab123'
    }
    next()
})

app.use((req, res, next) => {
    //假设在处理post data
    // 异步
    setTimeout(() => {
        req.body = {
            a: 100,
            b: 200
        }
        next()
    })
})

app.use('/api', (req, res, next) => {
    console.log('处理 /api 路由')
    next()
})

app.get('/api', (req, res, next) => {
    console.log('get /api 路由')
    next()
})

app.post('/api', (req, res, next) => {
    console.log('post /api 路由')
    next()
})

// 模拟登陆验证
function loginCheck(req, res, next) {
    setTimeout(() => {
        console.log('模拟登陆失败');
        res.json({
            errno: -1,
            msg: '登陆失败'
        })
        // console.log('模拟登陆成功');
        // next()
    })
    
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    console.log('get /api/get-cookie')
    res.json({
        errno: 0,
        data: req.cookie
    })
})

app.post('/api/post-cookie', (req, res, next) => {
    console.log('post /api/post-cookie')
    res.json({
        errno: 0,
        data: req.body
    })
})

app.use((req, res, next) => {
    console.log('处理404')
    res.json({
        errno: -1,
        msg: '404 Not Found'
    })
})

app.listen(3000, () => {
    console.log('server 运行在 3000 端口')
})