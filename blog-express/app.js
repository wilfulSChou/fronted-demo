var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发/测试 环境
  app.use(logger('dev')); //写日志
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const logWriteStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: logWriteStream //输出流
  })); //写日志
}

app.use(express.json()); // 处理application/json格式的post data
app.use(express.urlencoded({ extended: false })); //处理urlencoded格式的post data
app.use(cookieParser()); //解析cookie
// app.use(express.static(path.join(__dirname, 'public')));  //静态文件处理

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  redisClient
})
app.use(session({
  secret: 'hfHG&$*898_',
  cookie: {
    // path: '/', // 默认配置
    // httpOnly: true, // 默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore // 将session存储到redis中
}))

// 处理路由
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// 路由错误报404
app.use(function(req, res, next) {
  next(createError(404));
});

// 程序出错处理
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
