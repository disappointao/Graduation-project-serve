/*
处理文件上传的路由
 */
const multer = require('multer' );
const path = require('path');
const fs = require('fs');

const avatar_dirPath = path.join(__dirname, '..', 'public/upload/avatar');
const company_dirPath = path.join(__dirname, '..', 'public/upload/company');
const space_dirPath = path.join(__dirname, '..', 'public/upload/space');
const avatar_storage = multer.diskStorage({
  // destination: 'upload', //string时,服务启动将会自动创建文件夹
  destination: function (req, file, cb) { //函数需手动创建文件夹
    // console.log('destination()', file)
    if (!fs.existsSync(avatar_dirPath)) {
      fs.mkdir(avatar_dirPath, function (err) {
        if (err) {
          console.log(err)
        } else {
          cb(null, avatar_dirPath)
        }
      })
    } else {
      cb(null, avatar_dirPath)
    }
  },
  filename: function (req, file, cb) {
    // console.log('filename()', file)
    var ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
});
const company_storage = multer.diskStorage({
  // destination: 'upload', //string时,服务启动将会自动创建文件夹
  destination: function (req, file, cb) { //函数需手动创建文件夹
    // console.log('destination()', file)
    if (!fs.existsSync(company_dirPath)) {
      fs.mkdir(company_dirPath, function (err) {
        if (err) {
          console.log(err)
        } else {
          cb(null, company_dirPath)
        }
      })
    } else {
      cb(null, company_dirPath)
    }
  },
  filename: function (req, file, cb) {
    // console.log('filename()', file)
    var ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
});
const space_storage = multer.diskStorage({
	// destination: 'upload', //string时,服务启动将会自动创建文件夹
	destination: function (req, file, cb) { //函数需手动创建文件夹
		// console.log('destination()', file)
		if (!fs.existsSync(space_dirPath)) {
			fs.mkdir(space_dirPath, function (err) {
				if (err) {
					console.log(err)
				} else {
					cb(null, space_dirPath)
				}
			})
		} else {
			cb(null, space_dirPath)
		}
	},
	filename: function (req, file, cb) {
		// console.log('filename()', file)
		var ext = path.extname(file.originalname);
		cb(null, file.fieldname + '-' + Date.now() + ext)
	}
});
const avatar_upload = multer({storage:avatar_storage});
const avatar_uploadSingle = avatar_upload.single('avatar');

const company_upload = multer({storage:company_storage});
const company_uploadSingle = company_upload.single('company');

const space_upload = multer({storage:space_storage});
const space_uploadSingle = space_upload.single('space');

module.exports.avatar = function avatar_fileUpload(router) {

  // 上传图片
  router.post('/avatar/img/upload', (req, res) => {
    avatar_uploadSingle(req, res, function (err) { //错误处理
      if (err) {
        console.log(err);
        return res.send({
          code: 1,
          msg: '上传文件失败'
        })
      }
      var file = req.file;
      res.send({
        code: 0,
        data: {
          name: file.filename,
          url: 'http://localhost:4000/upload/avatar/' + file.filename
        }
      })

    })
  });
  router.post('/avatar/img/delete', (req, res) => {
    const {name} = req.body;
    fs.unlink(path.join(avatar_dirPath, name), (err) => {
      if (err) {
        res.send({
          code: 1,
          msg: '删除文件失败'
        })
      } else {
        res.send({
          code: 0
        })
      }
    })
  });
};
module.exports.company = function avatar_fileUpload(router) {

	// 上传图片
	router.post('/company/logo/upload', (req, res) => {
		company_uploadSingle(req, res, function (err) { //错误处理
			if (err) {
				console.log(err);
				return res.send({
					code: 1,
					msg: '上传文件失败'
				})
			}
			var file = req.file;
			res.send({
				code: 0,
				data: {
					name: file.filename,
					url: 'http://localhost:4000/upload/company/' + file.filename
				}
			})

		})
	});
	router.post('/company/logo/delete', (req, res) => {
		const {name} = req.body;
		fs.unlink(path.join(company_dirPath, name), (err) => {
			if (err) {
				res.send({
					code: 1,
					msg: '删除文件失败'
				})
			} else {
				res.send({
					code: 0
				})
			}
		})
	});
};
module.exports.space = function avatar_fileUpload(router) {

	// 上传图片
	router.post('/space/img/upload', (req, res) => {
		space_uploadSingle(req, res, function (err) { //错误处理
			if (err) {
				console.log(err);
				return res.send({
					code: 1,
					msg: '上传文件失败'
				})
			}
			var file = req.file;
			res.send({
				code: 0,
				data: {
					name: file.filename,
					url: 'http://localhost:4000/upload/space/' + file.filename
				}
			})

		})
	});
};
