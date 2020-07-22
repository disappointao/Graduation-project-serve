module.exports = function (server) {
	const messageModel = require('./db/message');
	const io = require('socket.io')(server);
	io.on('connection',function (socket) {
		console.log('有客户端连接上了服务器')
		socket.on('sendMessage',function ({from,to,content}) {
			console.log('服务器接收到数据', {from, to, content});
			const chat_id = [from, to].sort().join('_');
			const create_time = Date.now();
			console.log(chat_id,from,to,create_time,content)
			messageModel({chat_id, from, to, create_time, content}).save(function (err,chatMsg) {
				//保存完后，向所有连接客户端发送消息
				io.emit('receiveMessage', chatMsg)
				console.log('向所有连接的客户端发送消息', chatMsg)
			})
		})
	})
}