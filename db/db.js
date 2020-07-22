const mongoose = require('mongoose');
const md5 = require('blueimp-md5');
mongoose.connect('mongodb://localhost:27017/graduationProject',{ useNewUrlParser: true,useUnifiedTopology: true  });
const db = mongoose.connection;
db.on('connected',function() {
  console.log('数据库连接成功!');
});
module.exports = mongoose;
