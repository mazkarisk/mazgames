// インポート
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// 初期化
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.Server(app);
const io = socketIo(server);

// webサーバーの設定
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/src/index.html');
});
app.get('/test', (req, res) => {
	res.sendFile(__dirname + '/src/test.html');
});
server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

// ソケット通信の設定
io.on('connection', (socket) => {
	console.log('user connected');

	// 初回接続時にクライアントからくる、接続IDの要求に対する処理
	socket.on('requestId', (message) => {
		io.emit('responseId', socket.id);
		console.log('新規接続開始。ソケットID： ', socket.id);
	});

	// 'sendMessage' というイベント名で受信できる
	// 第一引数には受信したメッセージが入り、ログに出力する
	socket.on('sendMessage', (message) => {
		console.log('Message has been sent: ', message);
		
		// 'receiveMessage' というイベントを発火、受信したメッセージを全てのクライアントに対して送信する
		io.emit('receiveMessage', message);
	});
});
