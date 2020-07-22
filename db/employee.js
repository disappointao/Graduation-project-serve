const mongoose = require('./db');
const Schema = mongoose.Schema;
const employeeSchema = mongoose.Schema({
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
	userInfo:{
		type: Schema.Types.ObjectId,
		ref : 'userInfo'
	},
	createTime:{
		type: Date,
		default: Date.now()
	}
},{versionKey:false});
const employeeModel = mongoose.model('employee',employeeSchema,'employee');
module.exports = employeeModel;
