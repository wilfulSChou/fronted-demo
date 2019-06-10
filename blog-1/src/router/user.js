const { login } = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')
const { set } = require('../db/redis')

// 设置cookie过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
}

const handleUserRouter = (req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]

    //用户登录
    if (method === 'POST' && path === '/api/user/login'){
        const {username, password} = req.body
        const result = login({username, password})
        return result.then(data => {
            if(data.username) {
                // 设置session
                req.session.username = data.username
                req.session.realname = data.realname
                // 同步到redis
                set(req.sessionId, req.session)
                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        })
    }

    // 用户登录测试
    if (method === 'GET' && path === '/api/user/login-test'){
        if (req.session.username) {
            return Promise.resolve(new SuccessModel({
                session: req.session
            }))
        }
        return Promise.resolve(new ErrorModel('尚未登录'))
    }

}

module.exports = handleUserRouter