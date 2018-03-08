/**
 * 文件说明:
 * 详细描述:
 * 创建者: ycl
 * 创建时间: 2016/10/24
 * 变更记录:
 */
var express = require('express');
var Q = require('q');
var router = express.Router();
var userCtrl = require('../controllers/userController');

function getToken(req) {
  const tfToken = req.cookies['tf-token'];
  const tfUid = req.cookies['tf-uid'];
  if (tfToken && tfUid) {
    return {
      'tf-token': tfToken,
      'tf-uid': tfUid
    };
  } else {
    return {};
  }
}
router.get('/preview/:bid',function (req,res,next) {
  /* res.cookie('tf-uid','665299763557');
   res.cookie('tf-token','e9113d9b1443611ed9297b8409cfc42c');*/

  console.log('parseInt(req.params.bid)',req.params.bid)
  var data = {
    id:parseInt(req.params.bid),//parseInt(req.params.bid),
    type:6
  };
  if(req.query.orderId){
    data.orderId = req.query.orderId;
  }
  userCtrl.getPodData(data,getToken(req))
    .then(function (result) {
      console.log('result',11)
      res.locals.initialState = _.merge({}, res.locals.initialState,{podStore: result});
      res.render('preview',{title:'pod'})
    },function (err) {
      console.log('err',err)
      res.redirect('/500');
    });
});

module.exports = router;