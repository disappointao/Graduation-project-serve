const mongoose = require('./db');
const jobSchema = mongoose.Schema({
	name:{
		type:String,
		required:true
	}
},{versionKey:false});
const jobModel = mongoose.model('job',jobSchema,'job');
module.exports = jobModel;
