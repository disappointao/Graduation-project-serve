var express = require('express');
var router = express.Router();

var md5 = require('blueimp-md5');
var mongoose = require('mongoose');
var User = require('../db/user');
var companyModel = require('../db/company');
var jobModel = require('../db/job');
var employeeModel = require('../db/employee');
var employerModel = require('../db/employer');
var spaceModel = require('../db/space');
var messageModel = require('../db/message')
var {avatar,company,space} = require('./file-upload');

var user = User.UserModel;
var userInfo =User.UserInfoModel;
var ObjectId = mongoose.Types.ObjectId;

mongoose.set('useFindAndModify', false);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



//登录路由
router.post('/login',function(req,res) {
  const {username,password} = req.body;
  user.findOne({username,password:md5(password)},{password:0},function(err,user) {
    if(err){
      res.send({code:1,msg:'服务器错误，请稍后再试'});
      return;
    }
    if(!user){
      res.send({code:1,msg:'用户或密码错误'});
      return;
    }else{
      userInfo.findOne({user:user._id},function(err,data) {
        if(err){
          res.send({code:1,msg:'服务器错误，请稍后再试'});
          return;
        }

        //出现个bug直接使用user对象无法直接添加新属性
        var obj = {
          status:user.status,
          _id:user._id,
          username:user.username,
          modified: data.modified,
	        userInfo:user.info
        };
        res.cookie('username',user.username,{maxAge:24*69*60*1000});
        res.cookie('userId',user._id,{maxAge:24*69*60*1000});
        res.cookie('userStatus',user.status,{maxAge:24*69*60*1000});
        res.cookie('userInfo',data._id,{maxAge:24*69*60*1000})
        res.send({code:0,data:obj});
      })
    }
  })
});

// 注册路由设置
router.post('/register',function(req,res,next) {
  const {username,password,status} = req.body;
  user.findOne({username},function(err,data) {
    if(err){
      res.send({code:1,msg:'服务器错误，请稍后再试'});
    }
    if(data){
      res.send({code:1,msg:'此用户名已存在'});
    }else{
      user({
        username,
        password:md5(password),
        status:status
      }).save(function(err,data) {
        if(err){
          res.send({code:1,msg:'注册失败，请稍后再试'});
          return;
        }
        userInfo({
          user:data._id
        }).save(function(err,doc) {
          if(err){
            res.send({code:1,msg:'注册失败，请稍后再试'});
          }else{
          	user.findOneAndUpdate({username:username},{info:doc._id},function (err,data) {
		          res.send({code:0,data:{_id:data._id,username,status:data.status}});
	          })
          }
        });
      })
    }
  });
});

//请求用户信息
router.post('/userInfo',function(req,res) {
	let obj ={};
	if(req.body.username){
		obj={
			username:req.body.username
		}
	}else if(req.body.id){
		obj = {
			_id:new ObjectId(req.body.id)
		}
	}
  const {username} = req.body;
  user.aggregate([{
      $lookup: {
        from:'userInfo',
        localField:'_id',
        foreignField:'user',
        as:"userInfo"
      }
    },{
      $match:obj
    },{
      $project:{
        status:1,
        userInfo:1
      }
    }],function(err,doc) {
      if(err){
        res.send({code:1,msg:'服务器忙稍后重试'});
        return
      }
      res.send({code:0,data:doc[0]});
    })
});
//获取用户具体信息
router.post('/getUserInfoData',function (req,res) {
	userInfo.findOne({
		_id:req.body.id
	},function(err,doc){
		if(err){
			res.send({
				code:1,msg:'服务器错误请稍后重试'
			})
		}
		res.send({
			code:0,data:doc
		})
	})
})
//注册用户信息
router.post('/userInfoUpdate',function(req,res) {
  const username = req.cookies.username || 'admin';
  const data = req.body;
  user.findOne({username:username},function(err,doc) {
    if(err){
      res.send({code:1,msg:'服务器忙稍后重试'});
      return;
    }
    const userId = doc._id;
    userInfo.findOneAndUpdate({user:userId},data,function(err,doc) {
      if(err){
        res.send({code:1,msg:'服务器忙稍后重试'});
        return;
      }
      res.send({code:0,doc});
    });
  });
});
//用户添加公司
router.post('/userCompany',function(req,res) {
  const username = req.cookies.username || 'admin';
  const companyName = req.body.name;
  let companyId = '';
  user.findOne({username:username},function(err,user) {
    if(err){
      res.send({code:1,msg:'服务器忙稍后重试'});
      return;
    }
    const userId = user._id;
    companyModel.findOne({name:companyName},function(err,doc) {
      if(err){
        res.send({code:1,msg:'服务器忙稍后重试'});
        return;
      }
      if(doc){
        companyId = doc._id;
      }else{
        companyModel({name:companyName}).save(function(err,company) {
          companyId = company._id;
        })
      }
    }).then(()=>{
      userInfo.findOneAndUpdate({user:userId},{company:companyId},{new:true},function(err,userInfo) {
        if(err){
          res.send({code:1,msg:'服务器忙稍后重试'});
          return;
        }
        res.send({code:0,userInfo});
      });
      }

    );
  });
});
//修改用户身份
router.post('/changeStatus',function (req,res) {
	const {username,status,modified} = req.body
	user.findOneAndUpdate({username:username},{status:status},function (err,doc) {
		if(err){
			res.send({code:1,msg:'服务器忙稍后重试'});
		}
		userInfo.findOneAndUpdate({_id:doc.info},{modified:modified},function (err,data) {
			if (err){
				res.send({code:1,msg:'服务器忙稍后重试'});
			}
			res.send({code:0})
		})
	})
})
//根据公司名字搜索公司
router.post('/searchCompany',function(req,res) {
  const name = req.body.name;
  let query= new RegExp(name, 'i');
  companyModel.find({
    name:{
      $regex:query
    }
  },null,{limit:6 },function(err,doc) {
    if(err){
      res.send({code:1})
    }else{
      res.send({code:0,data:doc})
    }
  })
});
router.post('/getCompany',function(req,res) {
  companyModel.findOne({
    ...req.body
  },function(err,doc) {
    if(err){
      res.send({code:1})
    }else{
      res.send({code:0,data:doc})
    }
  })
});
//获取所有的公司
router.post('/getAllCompany',function(req,res) {
	companyModel.find({
	},function(err,doc) {
		if(err){
			res.send({code:1})
		}else{
			res.send({code:0,data:doc})
		}
	})
});
router.post('/setCompany',function(req,res) {
  companyModel(req.body).save(function(err,company) {
    if(err){
      res.send({code:1,msg:'服务器忙稍后重试'});
      return;
    }
    res.send({code:0,data:company});
  })
});

router.post('/getJobs',function (req,res) {
	jobModel.find({},function (err,jobs) {
		if(err){
			res.send({code:1,msg:'服务器忙稍后重试'});
			return;
		}
		res.send({code:0,data:jobs});
	})
})
//发布找工作信息
router.post('/postJob',function (req,res) {
	const username = req.cookies.username || 'admin2';
	user.find({username:username},function (err,doc) {
		if(err){
			res.send({code:1});
			return;
		}
		employeeModel({
			userInfo:doc[0].info,
			...req.body
		}).save(function (err,data) {
			if(err){
				res.send({code:1,msg:'服务器忙稍后重试'});
				return;
			}
			res.send({code:0,data:data});
		})
	})
})
//发布招聘信息
router.post('/postRequire',function (req,res) {
	const username = req.cookies.username || 'admin';
	user.find({username:username},function (err,doc) {
		if(err){
			res.send({code:1,msg:'服务器忙稍后重试'});
			return;
		}
		userInfo.findById(doc[0].info,function (err,data) {
			const {job,salary,brief,require,jobType,eduRequire} = req.body;
			employerModel({
				userInfo:doc[0].info,
				job:job,
				salary:salary,
				brief:brief,
				require:require,
				jobType:jobType,
				eduRequire:eduRequire,
				company:data.company
			}).save(function (err,data2) {
				if(err){
					res.send({code:1,msg:'服务器忙稍后重试'});
					return;
				}
				res.send({code:0,data:data2});
			})
		})
	})
})

//获取employerList列表
router.post('/getEmployerList',function (req,res) {
	let obj ={};
	if(req.body.job){
		obj={
			job:new ObjectId(req.body.job)
		}
	}else if(req.body.company){
		obj={
			company:new ObjectId(req.body.company)
		}
	}else if(req.body.userInfo){
		obj={
			userInfo:new ObjectId(req.body.userInfo)
		}
	} else if(req.body.id){
		obj = {
			_id:new ObjectId(req.body.id)
		}
	}
	employerModel.aggregate([
		{
			$lookup:{
				from:"job",
				localField: "job",
				foreignField: "_id",
				as: "jobInfo"
			}
		},
		{
			$lookup:{
				from:"userInfo",
				localField: "userInfo",
				foreignField: "_id",
				as: "userData"
			}
		},
		{
			$lookup:{
				from:"company",
				localField: "company",
				foreignField: "_id",
				as: "companyInfo"
			}
		},
		{
			$match:obj
		},
		{
			$sort:{
				_id:-1
			}
		}
	],function(err,docs){
		if(err){
			res.send({code:1,msg:'服务器忙稍后重试'})
		}
		res.send({code:0,data:docs});
	})
})
//获取employeeList列表
router.post('/getEmployeeList',function (req,res) {
	let obj ={};
	if(req.body.job){
		obj={
			job:new ObjectId(req.body.job)
		}
	}else if(req.body.userInfo){
		obj={
			userInfo:new ObjectId(req.body.userInfo)
		}
	} else if(req.body.id){
		obj = {
			_id:new ObjectId(req.body.id)
		}
	}
	employeeModel.aggregate([
		{
			$lookup:{
				from:"job",
				localField: "job",
				foreignField: "_id",
				as: "jobInfo"
			}
		},
		{
			$lookup:{
				from:"userInfo",
				localField: "userInfo",
				foreignField: "_id",
				as: "userData"
			}
		},
		{
			$match:obj
		},
		{
			$sort:{
				_id:-1
			}
		}
	],function(err,docs){
		if(err){
			res.send({code:1,msg:'服务器忙稍后重试'})
		}
		res.send({code:0,data:docs});
	})
})
router.post('/postSpace',function (req,res) {
	spaceModel({
		...req.body
	}).save(function (err,data) {
		if(err){
			res.send({code:1,msg:'服务器忙稍后重试'})
		}
		res.send({
			code:0,
			data:data
		})
	})
})
router.post('/getSpace',function (req,res) {
	let obj ={}
	if(req.body.userInfo){
		obj={
			userInfo:new ObjectId(
				req.body.userInfo
			)
		}

	}
	spaceModel.find(obj
	,function (err,data) {
		if(err){
			res.send({code:1,msg:'服务器忙稍后重试'})
		}
		res.send({
			code:0,
			data:data
		})
	})
})
//获取消息列表
router.post('/getMsgList',function (req,res) {
	let userId = req.body.id
	userInfo.find(function (err,doc) {
		const users = {};
		doc.forEach(doc=>{
			users[doc._id] = {name:doc.name,avatar:doc.avatar}
		})
		messageModel.find({'$or': [{from: userId}, {to:userId}]},function (err,msgList) {
			res.send({code:0,data:{users,msgList}})
		})
	})
})
//修改消息为已读
router.post('/readMsg',function (req,res) {
	const from = req.body.from;
	const to = req.body.to;
	messageModel.update({from,to,read:false},{read:true},{multi:true},function (err,doc) {
		res.send({code: 0, data: doc.nModified})
	})
})
//添加管理员账号并进行测试

// user({
//   username:'admin',
//   password:md5('admin'),
//   status:1
// }).save(function(err,data) {
//   if(err){
//     console.log(err);
//     return;
//   }
//   userInfo({
//     email:'1147608791@qq.com',
//     user:data._id
//   }).save(function(err) {
//     if(err){
//       console.log(err);
//       return;
//     }
//   });
//   console.log('创建成功',data);
// });
avatar(router);
company(router);
space(router);
module.exports = router;
