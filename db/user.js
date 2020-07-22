const mongoose = require('./db');
const Schema = mongoose.Schema;
const userSchema = mongoose.Schema({
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  status:{
    type:Number,
    min:0,
    max:1,
    default:0
  },
  info:{
    type: Schema.Types.ObjectId,
    ref : 'userInfo'
  }
},{versionKey:false});
const userInfoSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref : 'user'
  },
  company:{
    type: Schema.Types.ObjectId,
    ref : 'company'
  },
  CreatedDate: {
    type: Date,
    default: Date.now()
  },
  birth:{
    type:String,
  },
	phone:{
  	type:String,
	},
  email: String,
  name:String,
  avatar:{
    type:String,
    default:''
  },
	address:{
		type:String,
	},
  job:String,
  gender:{
    type:Number,
    min:0,
    max:1,
    default:1
  },
  identity:{
    type:String
  },
  school:{
    type:String
  },
  major:{
    type:String,
  },
  education:{
    type:String
  },
  enrollment:{
   type:String
  },
  graduation:{
    type:String
  },
  modified:{
    type:Boolean,
    default:false,
    required:true
  },
  introduction:String,
	ability:String
},{versionKey:false});
const UserModel = mongoose.model('user',userSchema,'user');
const UserInfoModel = mongoose.model('userInfo',userInfoSchema,'userInfo');
module.exports = {UserModel,UserInfoModel};
