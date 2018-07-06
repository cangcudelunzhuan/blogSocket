const socket_io = require('socket.io')
const db = require('./db')
const socketio = {}
socketio.getSocketio = function(server){ // http(s) server
    var io = socket_io.listen(server);
    io.sockets.on('connection', function (socket) {

        console.log('连接成功');

        socket.on('disconnect', function(){
          console.log('user disconnected');
        })
        socket.on('chat', function(msg){
          console.log('message: ' + msg);
          setInterval(()=>{
            socket.emit('chat', msg);
          },1000)
        })
        socket.on('login', function(msg){
          if(msg){
            db.Online.findOne({ name: msg.name }, function (err, docs) {
              if(docs){
                console.log("用户已在线")
              }else{
                new db.Online({ name: msg.name }).save(function (err) {
                  if (err) {
                    console.log("出错了")
                    return
                  }
                  console.log("上线成功")
                })
              }
            })
          }
          db.Online.find({}).exec(function (err, res) {
            console.log("res:"+res.length)
            socket.emit('getLength',{length:res.length})
            socket.broadcast.emit('getLength',{length:res.length})
          })

        })
    })
}
module.exports = socketio
