const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
    constructor() {
        // 存放中间件的列表
        this.routes = {
            all: [], // app.use(...)
            get: [], // app.get(...)
            post: [] // app.post(...)
        }
    }

    register(path) {
        const info = {}
        if (typeof path === "string") {
            info.path = path
            // 从第二个参数开始，转换成数组，存入stack
            info.stack = slice.call(arguments, 1)
        } else {
            info.path = '/'
            // 从第一个参数开始，转换成数组，存入stack
            info.stack = slice.call(arguments, 0)
        }
        // console.log('info:', info)
        return info
    }

    use() {
        const info = this.register.apply(this, arguments)
        this.routes.all.push(info)
    }

    get() {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }

    post() {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }

    match (method, url) {
        // console.log(method, url)
        let stack = []
        if (url === '/favicon.ico') {
            return stack
        }
        // 获取routes
        let curRoutes = []
        // console.log('this.routes:', this.routes);
        
        curRoutes = curRoutes.concat(this.routes.all)
        curRoutes = curRoutes.concat(this.routes[method])
        // console.log('curRoutes:', curRoutes)

        curRoutes.forEach(routeInfo => {
            console.log(url, routeInfo.path, url.indexOf(routeInfo.path), routeInfo.stack)
            if (url.indexOf(routeInfo.path) === 0) {
                // url === '/api/get-cookie' 且 routeInfo.path === '/'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api/get-cookie'
                // console.log('routeInfo.stack===', routeInfo.stack[routeInfo.stack.length -1]);
                
                stack = stack.concat(routeInfo.stack)
            }
        })
        return stack
    }
    // 核心的next机制
    handle(req, res, stack) {
        const next = () => {
            // 拿到第一个匹配的中间件
            const middleware = stack.shift()
            console.log('middleware:', middleware)
            if (middleware) {
                // 执行中间件函数
                middleware(req, res, next)
            }
        }
        next()
    }

    callback() {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
            }
            const url = req.url
            const method = req.method.toLowerCase()

            const resultList = this.match(method, url)
            console.log('resultList:', resultList)
            this.handle(req, res, resultList)
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

// 工厂函数
module.exports = () => {
    return new LikeExpress()
}