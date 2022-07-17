// インポート
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// 初期化
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.Server(app);
const io = socketIo(server);


// mazsugoroku 関連の変数
let playerName = ['', ''];
let traveled = [0, 0];

// webサーバーの設定
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/src/index.html');
});
app.get('/mazreversi/', (req, res) => {
	res.sendFile(__dirname + '/src/mazreversi.html');
});
app.get('/mazsugoroku/', (req, res) => {
	res.sendFile(__dirname + '/src/mazsugoroku.html');
});
server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

// ソケット通信の設定
io.on('connection', (socket) => {
	//console.log('user connected');

	// ########    mazreversi    ########
	// 'sendMessage' というイベント名で受信できる
	// 第一引数には受信したメッセージが入り、ログに出力する
	socket.on('sendMessage', (message) => {
		console.log('Message has been sent: ', message);
		
		// 'receiveMessage' というイベントを発火、受信したメッセージを全てのクライアントに対して送信する
		io.emit('receiveMessage', '[' + socket.id + '] ' + message);
	});

	// クライアントからの要求に応じてソケットIDを返却する
	socket.on('requestId', (message) => {
		var id = socket.id;
		io.to(id).emit('responseId', id);
	});
	
	// クライアントから送られてきた操作内容を全接続者に再送する
	socket.on('sendStone', (message) => {
		io.emit('receiveStone', message);
	});
	
	
	// ########    mazsugoroku    ########

	// ログイン(着席)処理
	socket.on('mazsugoroku_login_request', (message) => {
		
		// 空席を探す
		emptyChair = -1;
		for(let i = 0; i < 2; i++){
			// 見つかれば割りあて
			if (playerName[i] == '') {
				playerName[i] = message;
				emptyChair = i;
				break;
			}
		}
		
		// 現在のプレイヤー名を返す
		let responseJson = JSON.stringify({playerName: playerName, traveled: traveled});
		io.to(socket.id).emit('mazsugoroku_login_response', responseJson); // JSON 形式への変換
	});
});
