// インポート
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// 初期化
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// クライアントとのコネクションが確立したら'connected'という表示させる
io.on('connection', (socket) => {
  console.log('user connected');

  // 'sendMessage' というイベント名で受信できる
  // 第一引数には受信したメッセージが入り、ログに出力する
  socket.on('sendMessage', (message) => {
    console.log('Message has been sent: ', message);
    
    // 'receiveMessage' というイベントを発火、受信したメッセージを全てのクライアントに対して送信する
    io.emit('receiveMessage', message);
  });
});
