const mongoose = require('./db');
const messageSchema = mongoose.Schema({
		from: {type: String, required: true},
		to: {type: String, required: true},
		chat_id: {type: String, required: true},
		content: {type: String, required: true},
		read: {type:Boolean, default: false},
		create_time: {type: Number}
},{versionKey:false});
const messageModel = mongoose.model('message',messageSchema,'message');
module.exports = messageModel;
