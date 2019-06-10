const crypto = require('crypto')  // Nodejs自带的加密库

// 密匙
const SECRET_KEY = 'ghgtgj_%fd23'

// md5加密
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex') //十六进制
}

// 加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

module.exports = {
    genPassword
}

