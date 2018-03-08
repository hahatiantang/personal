/**
 * 获取用户 token
 * Created by MFChen on 12/10/2016.
 */
var express = require('express');
var router = express.Router();
var URL = require('url');
var Q = require('q');
var merge = require('lodash.merge');
var userCtrl = require('../controllers/userController');
var config = require('../config');

// 裁剪路径中的uid
router.use(function (req, res, next) {
  // 生成裁剪正则
  var ua = req.headers['user-agent'];
  console.log('req.query',req.query);
  console.log('req.hostname',req.path);
  var uidRegexp = new RegExp('^(' + config.NEED_CUT_UID_PATH.join('|') + ')/([a-z0-9]+)');
  console.log('uidRegexp',uidRegexp);
  if (uidRegexp.test(req.path)) {
    var uid = req.path.match(uidRegexp)[2];
    console.log('用户uid',uid)
    var redirectUrl = req.path.match(uidRegexp)[1];
    res.cookie('tf-uid', uid);
    var url = URL.format({
      pathname: redirectUrl,
      query: req.query
    });
    res.redirect(url);
  } else {
    next();
  }

});

router.use(function (req,res,next) {
  // 获取微信config
  var url = URL.format({
    protocol: req.protocol,
    hostname: req.hostname,
    pathname: req.path,
    query: req.query
  });
  userCtrl.getWechatConfig(url).then((wxInfo)=>{
    res.locals.initialState = merge({}, res.locals.initialState, {wxConfig: wxInfo.data});
    next();
  },(err)=>{

  })
});

router.use(function (req, res, next) {
  // 获取用户信息
  var uid = req.cookies['tf-uid'];
  var pathRegexp = new RegExp('^(' + config.NEED_CUT_UID_PATH.join('|')+')' );
  var urlList = req.originalUrl.split('?');
  console.log('uid',uid);
  if (uid&&uid!='null') {
    if(pathRegexp.test(req.path)){
      if(urlList.length > 1 && (urlList[1].split('&')).indexOf('share=1') > -1){
        res.cookie('tf-token','');
        res.cookie('tf-uid','');
        next()
      }else{
        userCtrl.getUserToken({uid: uid}).then((tokenInfo)=>{
          var token = tokenInfo.data;
          global.token = token;
          res.cookie('tf-token',token);
          next()
        },(err)=>{

        });
      }
    }else{
      next();
    }
  } else {
    if(pathRegexp.test(req.path)){
      var url = URL.format({
        protocol: req.protocol,
        hostname: config.AUTH_RELATED.host || 'wechat.v5time.net',
        pathname: config.AUTH_RELATED.pathname
      });
      console.log('url',url);
      var ua = req.headers['user-agent'];
      var type = 2;
      if (ua.indexOf('MicroMessenger') > -1) {
        type = 0;
      }
      if (ua.indexOf('QQ/') > -1) {
        type = 1;
      }
      var trueUrl = [];
      urlList[0].split('/').map((u)=>{
        if(u){
          trueUrl.push(u)
        }
      });
      var useUrl = 'http://'+req.headers.host+'/'+trueUrl.join('/');
      if(urlList.length > 1){
        useUrl = useUrl +'?'+urlList[1]
      }
      var urlObj = URL.format({
        protocol: req.protocol,
        hostname: config.AUTH_RELATED.newHost || 'stg2.v5time.net',
        pathname: "/hd/deskCalendar/auth",
        query: {
          md5Id: req.query.f || '',//'d028906de187a0cb',
          url: useUrl,
          type: type,
          uidFlag:1
        }
      });
      var callUrl =  encodeURIComponent(useUrl);
      var redirectUrl = encodeURIComponent(url+'?url='+callUrl);
      var reCallUrl = encodeURIComponent(urlObj);
      console.log('redirectUrl-----',req.originalUrl);
      console.log('useUrl-----',useUrl);
      console.log('reCallUrl-----',reCallUrl);
      if(urlList.length > 1 && (urlList[1].split('&')).indexOf('share=1') > -1){
        res.cookie('tf-token','');
        res.cookie('tf-uid','');
        next()
      }else{
        if (ua.indexOf('MicroMessenger') > -1) {
          res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+config.AUTH_RELATED.appid+'&redirect_uri='+redirectUrl+'&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect')
        } else if (ua.indexOf('QQ/') > -1) {
          res.redirect('https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101006551&redirect_uri=' + reCallUrl + '%26type%3D1&scope=1');
        } else {
          res.redirect('https://api.weibo.com/oauth2/authorize?client_id=2889481671&response_type=code&redirect_uri=' + reCallUrl + '%26type%3D2#');
        }
        res.end();
      }
    }else{
      next()
    }
  }
});

module.exports = router;