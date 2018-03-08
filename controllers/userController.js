/**
 * 文件说明:
 * 详细描述:
 * 创建者: 姜赟
 * 创建时间: 16/2/2
 * 变更记录:
 */
var request = require('superagent');
var q = require('q');
var config = require('../config');
const express = require('express');
const app = express();
const env = app.get('env');

var BASE_URL = config.API_PROXY_CONFIG.API_HOST + config.API_PROXY_CONFIG.API_PATH;
var OPEN_URL = config.API_OPEN.host + config.API_OPEN.path;
var PHOTO_URL = config.PHOTO_API.host + config.PHOTO_API.path;


/**
 *
 */
exports.getCalendarDetail = function (data,headers) {
	console.log('headers',headers);
	var defer = q.defer();
	var url = BASE_URL + '/calendar/podcreate';
	console.log(url,'接口地址');
	request.post(url)
		.set(headers)
		.timeout(10*10000)
		.type('json')
		.send(data)
		.end((err,res) =>{
			if(err){
				console.log('获取台历数据失败')
				defer.reject(err);
			}else{
				defer.resolve(res.body);
			}
		});
	return defer.promise;
};

/**
 * 获取台历预览数据
 * */
exports.getPodData = function (data,headers) {
  var defer = q.defer();
  var url = BASE_URL + '/book/pod';
  request.post(url)
    .set(headers)
    .timeout(10*10000)
    .type('json')
    .send(data)
    .end((err,res) =>{
      if(err){
        console.log('获取台历数据失败');
        defer.reject(err);
      }else{
        defer.resolve(res.body);
      }
    });
  return defer.promise;
};

/*获取打印信息*/
exports.getPrintData = function (data,headers) {
  var defer = q.defer();
  var url = BASE_URL + '/order/printchoice';
  request.post(url)
    .set(headers)
    .timeout(10*10000)
    .type('json')
    .send(data)
    .end((err,res) =>{
      if(err){
        console.log('获取打印数据失败');
        defer.reject(err);
      }else{
        defer.resolve(res.body);
      }
    });
  return defer.promise;
};

/*获取价格信息*/
exports.getPriceData = function (data,headers) {
  var defer = q.defer();
  var url = BASE_URL + '/order/bookprice';
  request.post(url)
    .set(headers)
    .timeout(10*10000)
    .type('json')
    .send(data)
    .end((err,res) =>{
      if(err){
        console.log('获取打印数据失败');
        defer.reject(err);
      }else{
        defer.resolve(res.body);
      }
    });
  return defer.promise;
};

/**
 * 获取微信JSSDK初始化配置
 * @param param
 * @returns {jQuery.promise|*|promise.promise|r.promise|promise|d.promise}
 */
exports.getWechatConfig = function (param) {
  var defer = q.defer();
  var url = 'http://wechat.timeface.cn/wxopen/common/signature';
  if (env == 'development' || env == 'test') {
    url = 'http://wechat.v5time.net/wxopen/common/signature'
  }
  console.log('url----->', url);
  request.post(url)
    .timeout(10 * 10000)
    .query({url: param})
    .end((err, res) => {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve(res.body);
      }
    });
  return defer.promise;
};

/**
 * 获取微信JSSDK初始化配置
 * @param param
 * @returns {jQuery.promise|*|promise.promise|r.promise|promise|d.promise}
 */
exports.getUserToken = function (param) {
  var defer = q.defer();
  request.post(BASE_URL + '/common/usertoken')
    .timeout(10*10000)
    .type('json')
    .send(param)
    .end((err, res) => {
      if (err) {
        defer.reject(err);
      } else {
        console.log('获取token',res.body)
        defer.resolve(res.body);
      }
    });
  return defer.promise;
};

//通过appId得到台历类型
exports.getUserAppId = function (param) {
  var defer = q.defer();
  request.post(BASE_URL + '/calendar/getThemeByAppId')
    .timeout(10*10000)
    .type('json')
    .send(param)
    .end((err, res) => {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve(res.body);
      }
    });
  return defer.promise;
};

/***************************************记事本服务端请求*******************************************************/

/*获取创建记事本*/
exports.notePodCreate = function (data,headers) {
    var defer = q.defer();
    var url = BASE_URL + '/notebook/podcreate';
    request.post(url)
        .set(headers)
        .timeout(10*10000)
        .type('json')
        .send(data)
        .end((err,res) =>{
            if(err){
                console.log('创建记事本失败');
                defer.reject(err);
            }else{
                defer.resolve(res.body);
            }
        });
    return defer.promise;
};

/*获取记事本预览数据 */
exports.getNotePodData = function (data, headers) {
    var defer = q.defer();

    var url = BASE_URL + '/book/pod';
    if(data.dj ==1){
      url = BASE_URL + '/book/openpod';
      data.podId = data.id
    }
    console.log('url',url)
  console.log('data',data)
    request.post(url)
        .set(headers)
        .timeout(10*10000)
        .type('json')
        .send(data)
        .end((err,res) =>{

            if(err){

                console.log('获取记事本预览数据失败');
                defer.reject(err);
            }else{
                defer.resolve(res.body);
            }
        });
    return defer.promise;
};

// 获取照片书信息
exports.bookInfoSelect = function(data,headers){
    var defer = q.defer();
    var url = PHOTO_URL + '/photo/bookInfo';

    //var url = BASE_URL + '/photoBook/bookInfo';

    console.log(headers,'header');
    var datas = "";
    if(data.bookId){
        datas = "bookId="+data.bookId;
    }
    request.post(url)
        .set(headers)
        .timeout(60 * 1000)
        .send(datas)
        .end((err, res) => {
            if (err) {
                console.log(err);
                console.log("获取书信息失败");
                defer.reject(errDataHandle(err,res));
            }else{
                defer.resolve(res.body);
            }
        });
    return defer.promise;
};

/**
 *开放平台授权接口
 */
exports.authorize = function (data) {
    console.log(data,'data');
    var defer = q.defer();
    var url = OPEN_URL + '/api/authorize';
    request.post(url)
        .timeout(10 * 1000)
        .type('form')
        .send(data)
        .end((err, res) => {
            if (err) {
                console.log("开放平台授权失败");
                defer.reject(errDataHandle(err,res));
            } else {
                defer.resolve(res.body);
            }
        });
    return defer.promise;
};

/**
 *获取POD预览信息接口
 */
exports.PODInfo = function (data) {
    console.log(data,'data');
    var defer = q.defer();
    var url = '';
    var podData = {};
    if(data.order_id && !data.shelves_id){
        url = OPEN_URL + '/pod/viewOrdeBook';
        podData = {
            'access_token':data.access_token,
            'unionid':data.unionid,
            'book_id':data.book_id,
            'book_type':data.book_type,
            'app_id':data.app_id,
            'order_id':data.order_id,
            'rebuild':0
        }
    }else if(data.shelves_id && !data.order_id){
        url = OPEN_URL + '/pod/viewShelvesBook';
        podData = {
            'access_token':data.access_token,
            'unionid':data.unionid,
            'book_id':data.book_id,
            'book_type':data.book_type,
            'app_id':data.app_id,
            'shelves_id':data.shelves_id,
            'rebuild':0
        }
    }else{
        url = OPEN_URL + '/pod/pod';
        podData = {
            'access_token':data.access_token,
            'unionid':data.unionid,
            'book_id':data.book_id,
            'book_type':data.book_type,
            'app_id':data.app_id,
            'rebuild':0
        }
    }
    request.post(url)
        .timeout(10 * 1000)
        .type('form')
        .send(podData)
        .end((err, res) => {
            if (err) {
                console.log("获取POD内容失败");
                defer.reject(errDataHandle(err,res));
            } else {
                defer.resolve(res.body);
            }
        });
    return defer.promise;
};

/**
 * 接口请求错误处理
 * @param err
 * @param res
 * @returns {{}}
 */
function errDataHandle(err,res){
    var errJsonData = {};
    try{
        try{
            errJsonData = {code: res.statusCode,data:JSON.parse(err.response.text)} ;
        }catch(error){
            errJsonData = {code: res.statusCode, data: res.body};
        }
    }catch (error){
        errJsonData = {code: 500, data: {}};
    }
    return errJsonData
}