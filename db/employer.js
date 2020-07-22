const mongoose = require('./db');
const Schema = mongoose.Schema;
const employerSchema = mongoose.Schema({
	job:{
		type: Schema.Types.ObjectId,
		ref : 'job',
		required:true
	},
	salary:{
		type:String,
		required:true
	},
	brief: {
		type:String,
		required:true
	},
	require: {
		type:String,
		required:true
	},
	jobType:{
		type:String,
		require:true
	},
	eduRequire:{
		type:String,
		require: true
	},
	userInfo:{
		type: Schema.Types.ObjectId,
		ref : 'userInfo'
	},
	company:{
		type: Schema.Types.ObjectId,
		ref : 'company',
		required:true
	},
	createTime:{
		type: Date,
		default: Date.now()
	}
},{versionKey:false});
const employerModel = mongoose.model('employe',employerSchema,'employer');
module.exports = employerModel;
