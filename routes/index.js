var express = require('express');
var _ = require('lodash');
var Q = require('q');
var URL = require('url');
var router = express.Router();
var handleToken = require('./handleToken');
var userCtrl = require('../controllers/userController');
var config = require('../config');
// console.log('ENV',config.API_PROXY_CONFIG.ENV);
var wxBookRouter = require('./wxBook');
router.use(handleToken);

function getToken(req) {
  const tfToken = req.cookies['tf-token'] || global.token;
  const tfUid = req.cookies['tf-uid'];
  console.log('tf-token',global.token)
  console.log('tfUid',tfUid)
  if (tfToken && tfUid) {
    return {
      'tf-token': tfToken,
      'tf-uid': tfUid
    };
  } else {
    return {};
  }
}

function brows(ua) { //移动终端浏览器版本信息
  var os = {}, browser = {},
    webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
    android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
    osx = !!ua.match(/\(Macintosh\; Intel /),
    ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
    iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
  // win = /Win\d{2}|Windows/.test(platform),
    wp = ua.match(/Windows Phone ([\d.]+)/),
    touchpad = webos && ua.match(/TouchPad/),
    kindle = ua.match(/Kindle\/([\d.]+)/),
    silk = ua.match(/Silk\/([\d._]+)/),
    blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
    bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
    rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
    playbook = ua.match(/PlayBook/),
    chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
    firefox = ua.match(/Firefox\/([\d.]+)/),
    firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
    ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
    webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
    safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);

  // Todo: clean this up with a better OS/browser seperation:
  // - discern (more) between multiple browsers on android
  // - decide if kindle fire in silk mode is android or not
  // - Firefox on Android doesn't specify the Android version
  // - possibly devide in os, device and browser hashes

  if (browser.webkit = !!webkit) browser.version = webkit[1]

  if (android) os.android = true, os.version = android[2]
  if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
  if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
  if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
  if (wp) os.wp = true, os.version = wp[1]
  if (webos) os.webos = true, os.version = webos[2]
  if (touchpad) os.touchpad = true
  if (blackberry) os.blackberry = true, os.version = blackberry[2]
  if (bb10) os.bb10 = true, os.version = bb10[2]
  if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
  if (playbook) browser.playbook = true
  if (kindle) os.kindle = true, os.version = kindle[1]
  if (silk) browser.silk = true, browser.version = silk[1]
  if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
  if (chrome) browser.chrome = true, browser.version = chrome[1]
  if (firefox) browser.firefox = true, browser.version = firefox[1]
  if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
  if (ie) browser.ie = true, browser.version = ie[1]
  if (safari && (osx || os.ios )) {
    browser.safari = true
    if (!os.ios) browser.version = safari[1]
  }
  if (webview) browser.webview = true

  os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
  (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
  os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
  (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
  (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
  return os;
}

//错误页面路由
router.get('/calendar/500',function (req, res, next) {
  var message = req.query.msg;
  if(!message){
    message = '暂未找到该内容'
  }
  res.render('error',{msg: message});
});

/* 戴光强台历首页 */
router.get('/calendar/dgq',function (req,res,next) {
  res.render('dgqIndex');
});
router.get('/calendar/healthy',function (req,res,next) {
  res.render('gtqIndex');
});
/*郭老师台历首页*/
router.get('/calendar/teacher',function (req,res,next) {
  res.render('guoIndex');
});
//第三方台历页面
router.get('/calendar/thirdwork',function (req,res,next) {
  var data = {
    appUid:req.query.appid || '',
    podTag:1
  };
  userCtrl.getUserAppId(data)
    .then(function (result) {
      res.locals.initialState = _.merge({},res.locals.initialState,{commonAppIdData:result.data});
      res.render('thirdWork');
    },function (err) {
      console.log('err',err);
      res.redirect('/calendar/500');
    })
});

router.get('/calendar/index',function (  req, res, next) {
  // 判断是否是移动端
  const $a = brows(req.headers['user-agent']);
  var locaUrl = '';
  if (/wechat\.timeface/.test(req.hostname)) {
    locaUrl = "www.timeface.cn";
  } else{
    locaUrl = "stg2.v5time.net";
  }
  const redirectUrl = URL.format({
    protocol: 'http',
    hostname: locaUrl,
    pathname: '/calendar'
  });
  if (!$a.phone) {
    res.redirect(redirectUrl);
    return;
  }
  var data = {
    appUid:req.query.appid || '',
    podTag:1
  };
  userCtrl.getUserAppId(data)
    .then(function (result) {
      res.locals.initialState = _.merge({},res.locals.initialState,{commonAppIdData:result.data});
      res.render('index');
    },function (err) {
      console.log('err',err);
      res.redirect('/calendar/500');
    })
});
router.get('/calendar/edit',function (req,res,next) {
  /*if(config.API_PROXY_CONFIG.ENV == 'development') {
    console.log('lalalallalalal')
    res.cookie('tf-uid', '580682498792');
    res.cookie('tf-token', '099e396d514e4572f99204307046f0cc');
  }*/
  var dgqTitle = '制作台历';
  if(req.query.style == 251){
    dgqTitle = '制作戴光强健康台历';
  }
  res.render('edit',{title: dgqTitle});
  /*var data = {
    flag:req.query.style || 232,
    id:req.query.bookId || '',
    app_id:req.query.appid || '',
    year:2018
  }
  console.log('参数',data);
  userCtrl.getCalendarDetail(data,getToken(req))
    .then(function (result) {
      console.log('result',result);
      res.locals.initialState = _.merge({}, res.locals.initialState,{podCreateStore: result.data});
      res.render('edit',{title: 'Express'})
    },function (err) {
      console.log('err',err);
      res.redirect('/calendar/500');
    })*/
});

router.get('/calendar/preview',function (req,res,next) {

  // 判断是否是移动端
  const $a = brows(req.headers['user-agent']);
  var localUrl = '';
  if (/wechat\.timeface/.test(req.hostname)) {
    localUrl = "www.timeface.cn";
  } else{
    localUrl = "stg2.v5time.net";
  }
  const redirectUrl = URL.format({
    protocol: 'http',
    hostname: localUrl,
    pathname: '/calendar/'+parseInt(req.query.bid)+'/pod'
  });
  console.log('redirectUrl',redirectUrl)
  if (!$a.phone) {
    res.redirect(redirectUrl);
    return;
  }

 console.log('parseInt(req.params.bid)',req.query.bid)
  var data = {
    id:parseInt(req.query.bid),//parseInt(req.params.bid),
    type:6
  };

  console.log('static',req.query.bid)
  if(req.query.orderId){
    data.orderId = req.query.orderId;
  }
  userCtrl.getPodData(data,getToken(req))
    .then(function (result) {
      console.log('result',11)
      res.locals.initialState = _.merge({}, res.locals.initialState,{podStore: result});
      userCtrl.getPrintData({bookId:req.query.bid,type:6},getToken(req))
        .then(function (reslt) {
          res.locals.initialState = _.merge({}, res.locals.initialState,{printChoiceStore: reslt.data});
          var priceData = {
            type: 6,
            split: 0,
            bookId: req.query.bid,      //书本id
            bind: reslt.data.bind[0].id,
            size: reslt.data.size[0].id,
            paper:reslt.data.paper[0].id,
            color:1
          };
          userCtrl.getPriceData(priceData,getToken(req))
            .then(function (rslt) {
              res.locals.initialState = _.merge({}, res.locals.initialState,{printPriceStore: rslt.data});
              res.render('preview',{title:result.book_title});
            },function (err) {
              console.log('err1',err);
              res.redirect('/calendar/500');
            });
        },function (err) {
          console.log('err2',err);
          res.redirect('/calendar/500');
        });
    },function (err) {
      console.log('err3',err);
      res.redirect('/calendar/500?msg='+err.body.msg);
    });
});


/****************************************记事本路由*******************************************************/
/*记事本编辑页面*/
router.get('/calendar/noteedit',function (req,res,next) {
    var data = {};
    if(req.query.bookId){
        data = {
            bookId:req.query.bookId
        }
    }
    data.app_id =  req.query.appid || '';
    console.log('data',data)
    userCtrl.notePodCreate(data,getToken(req))
        .then(function (result) {
            console.log('result',result);
            res.locals.initialState = _.merge({}, res.locals.initialState,{initialTempDetailStore: result});
            res.render('noteEdit',{title: '时光记事本'});
        },function (err) {
            console.log('err',err);
            res.redirect('/calendar/500');
        })
});

/*记事本首页*/
router.get("/calendar/noteindex", function (req, res) {
    // 判断是否是移动端
    const $a = brows(req.headers['user-agent']);
    var locaUrl = '';
    /*if (/wechat\.timeface/.test(req.hostname)) {
        locaUrl = "www.timeface.cn";
    } else{
        locaUrl = "stg2.v5time.net";
    }*/
    const redirectUrl = URL.format({
        protocol: 'http',
        hostname: locaUrl,
        pathname: '/notebook'
    });
    if (!$a.phone) {
        res.redirect(redirectUrl);
        return;
    }
    res.render('noteIndex',{title: "时光记事本"});

});

/*记事本预览页面*/
router.get("/calendar/notepreview", function (req, res) {
    // 判断是否是移动端
    const $a = brows(req.headers['user-agent']);
    var localUrl = '';
    if (/wechat\.timeface/.test(req.hostname)) {
        localUrl = "www.timeface.cn";
    } else{
        localUrl = "stg2.v5time.net";
    }
    const redirectUrl = URL.format({
        protocol: 'http',
        hostname: localUrl,
        pathname: '/notebook/'+parseInt(req.query.bookId)+'/pod'
    });

    if (!$a.phone) {
        res.redirect(redirectUrl);
        return;
    }

    var bookId = req.query.bookId ? req.query.bookId : "";
    var data = {
        id: parseInt(bookId),
        type: 10,
        dj:req.query.dj || ''
    };

    userCtrl.getNotePodData(data, getToken(req))
        .then(function (result) {
            res.locals.initialState = _.merge({}, res.locals.initialState, {notePodData: result});
            res.render('notePreview',{title: result.book_title});

        },function (err) {
            res.redirect('/calendar/500');
        });

});

/****************************************照片书路由****************************************/

// 样板图片展示 => 选择照片书类型、尺寸() => 上传照片(一键成书) => 预览照片书(继续编辑)

/*照片书样本展示*/
router.get("/calendar/bookIndex",function(req, res){
    // 判断是否是移动端
    const $a = brows(req.headers['user-agent']);
    var localUrl = '';
    if(/wechat\.timeface/.test(req.hostname)){
        localUrl = "www.timeface.cn";
    }else{
        localUrl = "stg2.v5time.net";
    }
    const redirectUrl = URL.format({
        protocol: 'http',
        hostname: localUrl,
        pathname: '/photobook'
    });
    if(!$a.phone){
        res.redirect(redirectUrl);
        return;
    }
    res.render('bookIndex',{title: "照片书"});
});

/*照片书配置选择*/
router.get("/calendar/photoBookType",function(req,res){
    // 判断是否是移动端
    const $a = brows(req.headers['user-agent']);
    var localUrl = '';
    if(/wechat\.timeface/.test(req.hostname)){
        localUrl = "www.timeface.cn";
    }else{
        localUrl = "stg2.v5time.net";
    }
    const redirectUrl = URL.format({
        protocol: 'http',
        hostname: localUrl,
        pathname: '/photobook'
    });
    if(!$a.phone){
        res.redirect(redirectUrl);
        return;
    }
    var statusOne = _.assign({},{'uid':req.cookies['tf-uid']});
    res.locals.initialState = _.merge({}, res.locals.initialState,{userDetailStore: statusOne});
    res.render('selectType',{title: "选择图书样式"});
});

/*照片书上传*/
router.get("/calendar/photoBookUpload",function(req,res){

    // 获取pod信息
    var bookId = req.query.bookId || '';
    var localUrl = 'http://'+ req.headers.host;

    console.log('bookId='+bookId);
    if(bookId){
        //取得书基本信息
        userCtrl.bookInfoSelect({bookId:bookId},getToken(req))
            .then(function (resultOne){

                console.log(resultOne,'oneone');

                var statusOne = _.assign({},resultOne.data,{'bookId':bookId,url:localUrl,local:req.headers.host});
                res.locals.initialState = _.merge({}, res.locals.initialState,{bookInfoStore: statusOne});
                res.render("photoBookUpload",{title:"照片书"});
            });
    }else{
        res.render("photoBookUpload",{title:"照片书"});
    }

});

/*封面封底编辑*/
router.get("/calendar/coverEdit",function(req,res){

    // 获取pod信息
    var bookId = req.query.bookId || '';
    var orderId = req.query.orderId || '';
    var shelveId = req.query.shelveId || '';
    var localUrl = 'http://'+ req.headers.host;
    var followShow = req.query.followShow || 0;



    if(bookId){
        //取得书基本信息
        userCtrl.bookInfoSelect({bookId:bookId,orderId:orderId,shelveId:shelveId},getToken(req))
            .then(function (resultOne){
                var statusOne = _.assign({},resultOne.data,{'bookId':bookId,url:localUrl,local:req.headers.host,'orderId':orderId,'shelveId':shelveId,'followShow':followShow});
                res.locals.initialState = _.merge({}, res.locals.initialState,{bookInfoStore: statusOne});
                console.log(statusOne,'11111111111');

                var uid = statusOne.creator.nickname || '';
                //取得开放平台授权
                userCtrl.authorize({
                    'app_id':statusOne.appId,
                    'app_secret':statusOne.appSecret,
                    'user_object':statusOne.userObject
                })
                    .then(function (resultTwo){
                        var statusTwo = resultTwo.data;

                        statusOne = _.assign({},resultOne.data,{'accesstoken':statusTwo.access_token,'unionid':statusTwo.unionid});
                        res.locals.initialState = _.merge({}, res.locals.initialState,{bookInfoStore: statusOne});

                        //取得POD详细信息
                        userCtrl.PODInfo({
                            'access_token':statusTwo.access_token,
                            'unionid':statusTwo.unionid,
                            'book_id':bookId,
                            'book_type':statusOne.theme,
                            'app_id':statusOne.appId,
                            'bookSize':statusOne.size,
                            'shelves_id':shelveId,
                            'order_id':orderId
                        })
                            .then(function (resultThree){

                                console.log(resultThree,'3333333333333333333');

                                var statusThree = _.assign({},resultThree.data);
                                res.locals.initialState = _.merge({}, res.locals.initialState,{podInfoStore: statusThree});
                                res.render("coverEdit",{title:"编辑封面"});
                            },function (err){
                                res.redirect("/")
                            });
                    },function (err){
                        res.redirect("/")
                    });
            },function (err){
                res.redirect("/")
            });
    }else{
        res.redirect("/")
    }

});

/*照片书预览*/
router.get("/calendar/:bookId/pod",function(req,res){

    // 判断是否是移动端
    const $a = brows(req.headers['user-agent']);
    var localUrl = '';
    if(/wechat\.timeface/.test(req.hostname)){
        localUrl = "www.timeface.cn";
    }else{
        localUrl = "stg2.v5time.net";
    }

    const redirectUrl = URL.format({
        protocol: 'http',
        hostname: localUrl,
        pathname: '/photobook/'+parseInt(req.query.bookId)+'/pod'
    });
    if(!$a.phone){
        res.redirect(redirectUrl);
        return;
    }

    // 获取pod信息
    var bookId = req.params.bookId || '';
    var orderId = req.query.orderId || '';
    var shelveId = req.query.shelveId || '';
    var localUrl = 'http://'+ req.headers.host;
    var followShow = req.query.followShow || 0;
    if(bookId){
        //取得书基本信息
        userCtrl.bookInfoSelect({"bookId":bookId,"orderId":orderId,"shelveId":shelveId},getToken(req))
            .then(function (resultOne){

                var statusOne = _.assign({},resultOne.data,{'bookId':bookId,url:localUrl,local:req.headers.host,'orderId':orderId,'shelveId':shelveId,'followShow':followShow},getToken(req));
                res.locals.initialState = _.merge({}, res.locals.initialState,{bookInfoStore: statusOne});
                var uid = statusOne.creator.nickname || '';
                //取得开放平台授权
                userCtrl.authorize({
                    'app_id':statusOne.appId,
                    'app_secret':statusOne.appSecret,
                    'user_object':statusOne.userObject
                })
                    .then(function (resultTwo){

                        console.log(resultTwo,'2222222222222222');
                        var statusTwo = resultTwo.data;

                        //取得POD详细信息
                        userCtrl.PODInfo({
                            'access_token':statusTwo.access_token,
                            'unionid':statusTwo.unionid,
                            'book_id':bookId,
                            'book_type':statusOne.theme,
                            'app_id':statusOne.appId,
                            'bookSize':statusOne.size,
                            'shelves_id':shelveId,
                            'order_id':orderId
                        })
                            .then(function (resultThree){

                                console.log(resultThree,'3333333333');

                                var statusThree = _.assign({},resultThree.data);
                                res.locals.initialState = _.merge({}, res.locals.initialState,{podInfoStore: statusThree});
                                res.render('photoBookPreview',{
                                    title:'预览照片书'
                                });
                            },function (err){
                                res.redirect("/")
                            });
                    },function (err){
                        res.redirect("/")
                    });
            },function (err){
                res.redirect("/")
            });
    }else{
        res.redirect("/")
    }
});

/*照片书内页编辑*/
router.get("/calendar/:bookId/photoBookEdit",function(req,res){

    // 判断是否是移动端
    const $a = brows(req.headers['user-agent']);
    var localUrl = '';
    if (/wechat\.timeface/.test(req.hostname)) {
        localUrl = "www.timeface.cn";
    } else{
        localUrl = "stg2.v5time.net";
    }
    const redirectUrl = URL.format({
        protocol: 'http',
        hostname: localUrl,
        pathname: '/photobook/'+parseInt(req.query.bookId)+'/pod'
    });

    if (!$a.phone) {
        res.redirect(redirectUrl);
        return;
    }

    // 获取pod信息
    var bookId = req.params.bookId || '';
    var orderId = req.query.orderId || '';
    var shelveId = req.query.shelveId || '';
    var localUrl = 'http://'+ req.headers.host;
    var followShow = req.query.followShow || 0;

    if(bookId){
        //取得书基本信息
        userCtrl.bookInfoSelect({"bookId":bookId,"orderId":orderId,"shelveId":shelveId},getToken(req))
            .then(function (resultOne){
                var statusOne = _.assign({},resultOne.data,{'bookId':bookId,url:localUrl,local:req.headers.host,'orderId':orderId,'shelveId':shelveId,'followShow':followShow});
                res.locals.initialState = _.merge({}, res.locals.initialState,{bookInfoStore: statusOne});
                var uid = statusOne.creator.nickname || '';
                //取得开放平台授权
                userCtrl.authorize({
                    'app_id':statusOne.appId,
                    'app_secret':statusOne.appSecret,
                    'user_object':statusOne.userObject
                })
                    .then(function (resultTwo){
                        var statusTwo = resultTwo.data;
                        statusOne = _.assign({},resultOne.data,{'accesstoken':statusTwo.access_token,'unionid':statusTwo.unionid});
                        res.locals.initialState = _.merge({}, res.locals.initialState,{bookInfoStore: statusOne});

                        //取得POD详细信息
                        userCtrl.PODInfo({
                            'access_token':statusTwo.access_token,
                            'unionid':statusTwo.unionid,
                            'book_id':bookId,
                            'book_type':statusOne.theme,
                            'app_id':statusOne.appId,
                            'bookSize':statusOne.size,
                            'shelves_id':shelveId,
                            'order_id':orderId
                        })
                            .then(function (resultThree){

                                console.log(resultThree,'3333333333333333333');

                                var statusThree = _.assign({},resultThree.data);
                                res.locals.initialState = _.merge({}, res.locals.initialState,{podInfoStore: statusThree});
                                res.render('photoBookEdit',{
                                    title:'编辑照片书'
                                });
                            },function (err){
                                res.redirect("/")
                            });
                    },function (err){
                        res.redirect("/")
                    });
            },function (err){
                res.redirect("/")
            });
    }else{
        res.redirect("/")
    }
});

/*照片书更换主题*/
router.get("/calendar/photoBookTheme",function(req,res){

    // 判断是否是移动端
    const $a = brows(req.headers['user-agent']);
    var localUrl = '';
    if (/wechat\.timeface/.test(req.hostname)) {
        localUrl = "www.timeface.cn";
    } else{
        localUrl = "stg2.v5time.net";
    }
    const redirectUrl = URL.format({
        protocol: 'http',
        hostname: localUrl,
        pathname: '/photobook/'+parseInt(req.query.bookId)+'/pod'
    });

    if (!$a.phone) {
        res.redirect(redirectUrl);
        return;
    }

    var bookId = req.query.bookId || '';
    var orderId = req.query.orderId || '';
    var shelveId = req.query.shelveId || '';
    var localUrl = 'http://'+ req.headers.host;
    var followShow = req.query.followShow || 0;

    console.log('bookId='+bookId);

    if(bookId){
        //取得书基本信息
        userCtrl.bookInfoSelect({"bookId":bookId,"orderId":orderId,"shelveId":shelveId},getToken(req))
            .then(function (resultOne){

                var statusOne = _.assign({},resultOne.data,{'bookId':bookId,url:localUrl,local:req.headers.host,'orderId':orderId,'shelveId':shelveId,'followShow':followShow});
                res.locals.initialState = _.merge({}, res.locals.initialState,{bookInfoStore: statusOne});
                res.render("updateTheme",{title:"更换主题"});

            },function (err){
                res.redirect("/");
            });
    }else{
        res.redirect("/")
    }

});
//微信公众号内容书路由
router.use(wxBookRouter);

module.exports = router;
