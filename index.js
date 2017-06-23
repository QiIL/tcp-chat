/**
 * 模块依赖
 */
var net = require('net');

/**
 * 追踪链接数
 */
var count = 0
  , users = []
/**
 * 创建服务器
 */
var server = net.createServer(function (conn) {
  //handle connnection
  conn.setEncoding('utf8')
  var nickname;
  conn.write(
    '\n > welcome to \033[92m node-chat\033[39m!' +
    '\n > ' + count + " other people are connected at this time." +
    '\n > please write your name and press enter; '
  );
  count++;
  //监听断开链接事件
  conn.on('close', function () {
    count--;
    delete users[nickname];
    boardcast('\033[90m > ' + nickname + '  left the room:\033[39m\n')
  });
  //设置一个广播函数
  function boardcast (msg, exceptMyself){
    for (var i in users){
      if (i != nickname){
        users[i].write(msg)
      }
    }
  }
  //监听data事件
  conn.on('data', function (data) {
    data = data.replace('\r\n', '');
    if (!nickname) {
      //第一个data一定要是姓名
      if (users[data]) {
        conn.write('\033[93m nickname already in use. try again:\033[39m!')
        return;
      } else {
        nickname = data;
        users[nickname] = conn;
        boardcast('\033[90m > ' + nickname + '  joined the room:\033[39m\n')
      }
    } else {
        boardcast('\033[96m > ' + nickname + ':\033[39m ' + data + '\n')
    }
  });
});

/**
 * 监听
 */
server.listen(3000, function () {
  console.log('\033[96m    server listening on *:3000\033[39m');
});
