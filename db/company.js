const mongoose = require('./db');
const companySchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  shortName:{
    type:String
  },
  address:{
    type:String
  },
	logo:{
  	type:String
	},
  scale:{
    type:String
  },
  stage:{
    type:String
  },
	brief:{
  	type:String
	}
},{versionKey:false});
const companyModel = mongoose.model('company',companySchema,'company');
module.exports = companyModel;
