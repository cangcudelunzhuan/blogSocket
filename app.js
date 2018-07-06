const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParse = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const router = require('./server/router')
const app = express()
const http = require('http').Server(app)
const sockets = require('./server/socket')


const resolve = file => path.resolve(__dirname, file)

app.use('/dist', express.static(resolve('./dist')))
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({ extended: true }))
app.use(router)
sockets.getSocketio(http)
// session
// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'blog',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: true,
//     maxAge: 2592000000
//   },
//   store: new MongoStore({
//     url: 'mongodb://localhost:32768/blogs'
//   })
// }))

app.get('*', function (req, res) {
  let html = fs.readFileSync(resolve('./' + 'index.html'), 'utf-8')
  res.send(html)
})
http.listen(4000, function () {
  console.log('访问地址为 localhost:4000')
})
