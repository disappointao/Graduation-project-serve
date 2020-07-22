const mongoose = require('./db');
const Schema = mongoose.Schema;
const spaceSchema = mongoose.Schema({
	userInfo:{
		type: Schema.Types.ObjectId,
		ref : 'userInfo'
	},
	content:{
		type:String,
		require:true,
	},
	space:{
		type:'String',
		require:true
	},
	createTime:{
		type: Date,
		default: Date.now()
	}
},{versionKey:false});
const spaceModel = mongoose.model('space',spaceSchema,'space');
module.exports = spaceModel;
