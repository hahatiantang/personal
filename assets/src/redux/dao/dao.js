/**
 * 文件说明: 接口请求文件
 * 详细描述:
 * 创建者: 陳明峰
 * 创建时间: 16/2/1
 * 变更记录:
 */
import Q from 'q';
import HttpClient from '../utils/httpClient';
import * as ActionsType from '../utils/ActionsType';
var CalConfig = require('../../../../config.js');

export function authorizeDao(params, cb) {
  return (dispatch) => {
    HttpClient.filterPost('http://open.v5time.net/openpod/api/authorize',params)
      .then((res) => {
        cb && cb.handleSuccess(res);
      }, (err) => {
        cb && cb.handleError(err);
      })
  }
}

//获取台历数据
export function getCalendarData(param,callback) {
  let defer = Q.defer();
  return (dispatch)=>{
    /*HttpClient.filterPost('http://open.v5time.net/openpod/pod/pod2',param,{'Content-Type': 'application/x-tf-gzip-json',
      'Content-Encoding': 'gzip'})*/
    HttpClient.post('/calendar/podcreate',param)
      .then((res)=>{
        if(callback){
          callback.success(res)
        }
        dispatch({
          type:ActionsType.POD_CREATE_STORE,
          store:res.data
        });
        defer.resolve(res);
      },(err)=>{
        if(callback){
          callback.error(err)
        }
        dispatch({
          type: ActionsType.ERROR_MESSAGE,
          err
        });
        defer.reject(err);
      });
    return defer.promise;
  }
}
/**
 * 获取台历板式列表
 * @returns {function(*)}
 */
export function getCalendarTempList(param,callback) {
  let defer = Q.defer();
  return (dispatch)=>{
    HttpClient.post('/calendar/templist',param)
      .then((res)=>{
        if(callback){
          callback.success(res.data)
        }
        dispatch({
          type:ActionsType.CALENDAR_TEMP_LIST,
          store:res.data
        })
        defer.resolve(res);
      },(err)=>{
        if(callback){
          callback.error(err)
        }
        dispatch({
          type: ActionsType.ERROR_MESSAGE,
          err
        })
        defer.reject(err);
      })
    return defer.promise;
  }
}

/**
 * 清空板式列表数据
 * @returns {function(*)}
 */
export function clTempList() {
  return (dispatch)=>{
    dispatch({
      type:ActionsType.CL_TEMP_LIST,
    })
  }
}
/**
 * 台历板式修改
 * @param param
 * @returns {function(*)}
 */
export function editTemp(param,callback) {
  let defer = Q.defer();
  return (dispatch)=>{
    HttpClient.post('/calendar/edittemp',param)
      .then((res)=>{
        if(callback){
          callback.success(res.data)
        }
        dispatch({
          type:ActionsType.EDIT_TEMP,
          store:res.data
        })
        defer.resolve(res);
      },(err)=>{
        if(callback){
          callback.error(err)
        }
        dispatch({
          type: ActionsType.ERROR_MESSAGE,
          err
        })
        defer.reject(err);
      })
    return defer.promise;
  }

}


//获取台历风格列表
export function styleListAction(params){
  let defer = Q.defer();
  return (dispatch) =>{
    HttpClient.post('/calendar/stylelist',params)
      .then((res) =>{
        dispatch({
          type:ActionsType.CALENDAR_STYLE_LIST,
          store:res.data
        });
        defer.resolve(res);
      }, (error) => {
        dispatch({
          type: ActionsType.ERROR_MESSAGE,
          error
        });
        defer.reject(error);
      });
    return defer.promise;
  }
}

//台历风格修改
export function changeStyle(param,callback) {
  let defer = Q.defer();
  return (dispatch)=>{
    HttpClient.post('/calendar/changestyle',param)
      .then((res)=>{
        if(callback){
          callback.success(res.data)
        }
        defer.resolve(res);
      },(err)=>{
        if(callback){
          callback.error(err)
        }
        dispatch({
          type: ActionsType.ERROR_MESSAGE,
          err
        });
        defer.reject(err);
      });
    return defer.promise;
  }
}

//更换风格确定
export function editCalendarStyle(styleData,params){
  return (dispatch) => {
    dispatch({
      type: ActionsType.EDIT_CALENDAR_STYLE,
      styleData,
      params
    });
  }
}

/**
 * 修改台历文字
 * @param param
 * @returns {function(*)}
 */
export function editText(param,call) {
  let defer = Q.defer();
  return (dispatch)=> {
    HttpClient.post('/calendar/edittext', param, {type: 'json'})
      .then((res)=> {
        if(call){
          call.handelSuccess(res)
        }
        dispatch({
          type: ActionsType.EDIT_TEXT,
          store: res.data
        })
        defer.resolve(res);
      }, (err)=> {
        if(call){
          call.handelError(err)
        }
        dispatch({
          type: ActionsType.ERROR_MESSAGE,
          err
        })
        defer.reject(err);
      })
    return defer.promise;

  }
}

//台历文字保存
export function editCalendarText(textData,index,currentIndex){
  return (dispatch) => {
    dispatch({
      type: ActionsType.EDIT_CALENDAR_TEXT,
      textData,
      index,
      currentIndex
    });
  }
}
/**
 *图片裁剪
 * @param cropData
 * @param index
 * @param currentIndex
 * @returns {function(*)}
 */
export function imageCrop(cropData,index,currentIndex) {
  return (dispatch) => {
    dispatch({
      type: ActionsType.IMAGE_CROP,
      cropData,
      index,
      currentIndex
    });
  }
}

/**
 * 更换板式数据
 * @param tempData
 * @param currentIndex
 * @returns {function(*)}
 */
export function editCalendarTemp(tempData,currentIndex){
  return (dispatch) => {
    dispatch({
      type: ActionsType.EDIT_CALENDAR_TEMP,
      tempData,
      currentIndex
    });
  }
}

//加入印刷车
export function addCart(param, successBack, errorBack) {
  return (dispatch) => {
    HttpClient.post('/cart/add', param, {type: 'json'})
      .then((res) => {
        successBack&&successBack.handelSuccess(res);
      }, (error)=> {
        errorBack&&errorBack.handelError();
        dispatch({
          type: ActionsType.ERROR_MESSAGE,
          error
        })
      })
  }
}

//立即购买
export function calendarPay(param, successBack, errorBack) {
  return (dispatch) => {
    HttpClient.post('/order/h5create', param, {type: 'json'})
      .then((res) => {
        successBack&&successBack.handelSuccess(res);
      }, (error)=> {
        errorBack&&errorBack.handelError();
        dispatch({
          type: ActionsType.ERROR_MESSAGE,
          error
        })
      })
  }
}

export function judgeType(param, successBack, errorBack) {
  return (dispatch) => {
    HttpClient.post('/order/checkAppId', param, {type: 'json'})
      .then((res) => {
        successBack&&successBack.handelSuc(res);
      }, (error)=> {
        errorBack&&errorBack.handelErr();
        dispatch({
          type: ActionsType.ERROR_MESSAGE,
          error
        })
      })
  }
}

//获取台历纪念日列表
export function memoryListAction(param,callBack) {
  return (dispatch) => {
    HttpClient.post('/calendar/memorylist', param, {type: 'json'})
      .then((res) => {
        if(callBack&&callBack.handelSu){
          callBack.handelSu(res);
        }
      }, (error) => {
        if(callBack&&callBack.handelError){
          callBack.handelError(error);
        }
        dispatch({
          type: ActionsType.ERROR_MESSAGE,
          error
        })
      })
  }
}

//新增或修改纪念日
export function addMemoryAction(param,callback) {
  return (dispatch) =>{
    HttpClient.post('/calendar/editmemory', param, {type: 'json'})
      .then((res) =>{
        callback&&callback.handSuc(res);
      }, (error) => {
        if(callback&&callback.handErr){
          callback.handErr(error);
        }
        dispatch({
          type: ActionsType.ERROR_MESSAGE,
          error
        })
      })
  }
}

//纪念日保存
export function memoryHand(memoryData,currentIndex){
  return (dispatch) => {
    dispatch({
      type: ActionsType.MEMORY_EDIT,
      memoryData,
      currentIndex
    });
  }
}


/*
 * STS授权
 * */
function uploadImageApi(params,handleCb) {
  let defer = Q.defer();
  if(!window.STSOBJEACT){
    HttpClient.post(CalConfig.ALiConfig.aLiSTS, {url: CalConfig.ALiConfig.aLiUploadUrl, dir: CalConfig.ALiConfig.aLiUploadDir })
      .then((res) => {
        console.warn('授权请求完成，开始计算文件 MD5',new Date());
        window.STSOBJEACT = res;
        //计算图片  MD5
        calculateImageMD5(params,handleCb);
        defer.resolve(res);
      }, (err)=> {
        defer.reject(err);
      });
  }else{
    calculateImageMD5(params,handleCb);
  }
  return defer.promise;
}
//阿里云上传
function uploadForALiYun(param, filename, handleCb) {
  let defer = Q.defer();
  let params = {
    name: 'file',
    file: param.file,
    fields: [
      {name: 'key', value: window.STSOBJEACT.dir + filename},
      {name: 'policy', value: window.STSOBJEACT.policy},
      {name: 'OSSAccessKeyId', value: window.STSOBJEACT.accessid},
      {name: 'success_action_status', value: 200},
      {name: 'signature', value: window.STSOBJEACT.signature}
    ]
  };
  let imageALiPath = 'http://' + CalConfig.ALiConfig.aLiUploadUrl + '/' + CalConfig.ALiConfig.aLiUploadDir + filename;
  //上传图片
  HttpClient.upload('http://'+CalConfig.ALiConfig.aLiUploadUrl, params)
    .then(() => {
      console.warn('阿里云上传完成，开始获取图片信息',new Date());
      //获取图片地址
      HttpClient.get(imageALiPath + '@infoexif')
        .then((result)=> {
          let image_result_object = {
            "data": {

            },
            "error_code": 10000,
            "info": "接口响应正常！"
          };
          image_result_object.data.rotate = result.Orientation&&result.Orientation.value || '0';
          image_result_object.data.width = result.ImageWidth.value;
          image_result_object.data.height = result.ImageHeight.value;
          image_result_object.data.url = imageALiPath;
          image_result_object.data.image_date = result.DateTimeOriginal&&new Date(result.DateTimeOriginal.value.split(" ")[0])
              .getTime()/1000 || new Date().getTime()/1000;
          console.log('image_result_object',image_result_object);
          //处理成功回调
          handleCb&&handleCb.handleSuccess(Object.assign({},image_result_object));
          defer.resolve(Object.assign({},image_result_object));
        }, (err)=> {
          defer.reject(err);
        });
      defer.resolve();
    }, (err)=> {
      if(err.code == 403){
        window.STSOBJEACT = null;
        uploadImageApi(params,handleCb);
      }else{
        handleCb&&handleCb.handleError(Object.assign({},err));
      }

      defer.reject(err);
    });
  return defer.promise;
}


// 上传照片
export function uploadImg(params,callback) {
  return (dispatch) => {
    imageCompress(params,callback, dispatch);
  }
}

const imageCompress = (param, callback, dispatch) => {
  getSTSAuth(param, {
    handleSuccess: (res) => {
      let result = Object.assign({}, res);
      dispatch({
        type: ActionsType.UPLOAD_IMG,
        store: result.data
      });
      callback && callback.handSuc(result);
      defer.resolve(result);
    },handleError: (err)=>{
      dispatch({
        type: ActionsType.ERROR_MESSAGE,
        error: err
      });
      callback && callback.handErr(err);
    }
  }).then((res) => {
    //授权成功
  }, (err) => {
     dispatch({
        type: ActionsType.ERROR_MESSAGE,
        error: err
    });
  });
}

//得到文件后缀名
const getSuffix = (filename) => {
  let pos = filename.lastIndexOf('.')
  let suffix = ''
  if (pos != -1) {
    suffix = filename.substring(pos)
  }
  return suffix;
}
//计算文件的 MD5 值
const calculateImageMD5 = (params, handleCb) => {
  let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    file = params.file,
    chunkSize = 2097152,                             // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();
  fileReader.onload = function (e) {
    //console.log('read chunk nr', currentChunk + 1, 'of', chunks);
    spark.append(e.target.result);                   // Append array buffer
    currentChunk++;

    if (currentChunk < chunks) {
      loadNext();
    } else {
      //console.log('finished loading');
      let filename = '/' + spark.end() + getSuffix(params.file.name);
      console.info('computed hash', filename);  // Compute hash

      console.warn('文件 MD5计算完成，开始阿里云上传', new Date());
      //开始阿里云上传
      uploadForALiYun(params, filename, handleCb);
    }
  };

  fileReader.onerror = function () {
    console.warn('oops, something went wrong.');
  };

  function loadNext() {
    var start = currentChunk * chunkSize,
      end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }

  loadNext();
}

/*
 * STS授权
 * */
function getSTSAuth(params, handleCb) {
  let defer = Q.defer();
  if (!window.STSOBJEACT) {
    HttpClient.filterPost('http://auth.timeface.cn/web/sts', {url: 'img1.timeface.cn', dir: 'times'})
      .then((res) => {
        console.warn('授权请求完成，开始计算文件 MD5', new Date());
        window.STSOBJEACT = res;
        //计算图片  MD5
        calculateImageMD5(params, handleCb);
        defer.resolve(res);
      }, (err) => {
        defer.reject(err);
      });
  } else {
    calculateImageMD5(params, handleCb);
  }
  return defer.promise;
}
//阿里云上传
function uploadForALiYun(param, filename, handleCb) {
  let defer = Q.defer();
  let params = {
    name: 'file',
    file: param.file,
    fields: [
      {name: 'key', value: window.STSOBJEACT.dir + filename},
      {name: 'policy', value: window.STSOBJEACT.policy},
      {name: 'OSSAccessKeyId', value: window.STSOBJEACT.accessid},
      {name: 'success_action_status', value: 200},
      {name: 'signature', value: window.STSOBJEACT.signature},
    ]
  }
  let imageALiPath = 'http://img1.timeface.cn/times' + filename;
  //判断图片存在与否
  HttpClient.head(imageALiPath).then(()=>{
    //直接得到图片信息
    getImageInfo(imageALiPath,handleCb);
  },()=>{
    //上传图片
    HttpClient.upload('http://img1.timeface.cn', params)
      .then(() => {
        getImageInfo(imageALiPath,handleCb);
        defer.resolve();
      }, (err) => {
        //没有权限
        if (err.code == 403) {
          window.STSOBJEACT = null;
          getSTSAuth(params, handleCb);
        }
        defer.reject(err);
      });
  });
  return defer.promise;
}

//获取上传照片图片信息
function getImageInfo(imageALiPath,handleCb){
  let defer = Q.defer();
  console.warn('阿里云上传完成，开始获取图片信息', new Date());
  //获取图片地址
  HttpClient.get(imageALiPath + '@infoexif')
    .then((result) => {
      let image_result_object = {
        "data":{
            "originalHeight": 0,
            "rotate":0,
            "remark":"",
            "width":0,
            "originalTime": "",
            "userRotate": 0,
            "url": "",
            "yurl": "",
            "id":0,
            "height": 0,
            "hasRead":0,
            "uploadtime": "",
            "containsShotTime":0,
            "originalWidth":0,
            "localurl": ''
          },
            "code":"000"
      };
      image_result_object.data.rotate = result.Orientation && result.Orientation.value || '0';
      image_result_object.data.width = result.ImageWidth.value;
      image_result_object.data.height = result.ImageHeight.value;
      image_result_object.data.url = imageALiPath;
      image_result_object.data.yurl = imageALiPath;
      image_result_object.data.uploadtime = new Date().valueOf();
      image_result_object.data.originalflag = new Date().valueOf() + '_' + imageALiPath;
      image_result_object.data.originalTime = result.DateTimeOriginal && new Date(result.DateTimeOriginal.value.split(" ")[0].replace(/:/g,'-'))
          .getTime() ||'-28800000';
      //console.log('image_result_object', image_result_object);
      //处理成功回调
      handleCb && handleCb.handleSuccess(Object.assign({}, image_result_object));
      defer.resolve(Object.assign({}, image_result_object));
    }, (err) => {
      handleCb && handleCb.handleError(err);
      defer.reject(err);
    });
  return defer.promise;
}
/**
 * 图片上传
 * @param data
 * @param index
 * @param currentIndex
 * @returns {function(*)}
 */
export function imgUpload(data,index,currentIndex) {
  return (dispatch) => {
    dispatch({
      type: ActionsType.IMG_UPLOAD,
      data,
      index,
      currentIndex
    });
  }
}

export function saveBook(params,callBack) {
  return (dispatch) =>{
    HttpClient.post('/calendar/save', params)
      .then((res)=> {
        if(callBack){
          callBack.handSuc(res)
        }
        dispatch({
          type: ActionsType.SAVE_BOOK,
          store: res.data
        })
      }, (err)=> {
        if(callBack){
          callBack.handErr(err)
        }
        dispatch({
          type: ActionsType.ERROR_MESSAGE,
          err
        })
      });
  }
}

/**------------------------记事本-----------------------*/
/* 获取记事本配置选项 */
export function printchoice(param, successBack, errorBack) {
  return (dispatch) => {
    HttpClient.post('/order/printchoice', param, {type: 'json'})
        .then((res) => {
          console.log(successBack, 'successBack');
          successBack && successBack.handelSuccess(res);
          dispatch({
            type: ActionsType.PRINT_CHOICE,
            store: res.data
          })
        }, (error)=> {
          errorBack && errorBack.handelError();
          dispatch({
            type: ActionsType.ERROR_MESSAGE,
            error
          })
        })
  }
}
/* 获取记事本价格 */
export function bookprice(param, successBack, errorBack) {
    return (dispatch) => {
        HttpClient.post('/order/bookprice', param, {type: 'json'})
            .then((res) => {
              successBack&&successBack.handelSuccess(res);
              dispatch({
                type: ActionsType.PRINT_PRICE,
                store: res.data
              })
            }, (error)=> {
                errorBack&&errorBack.handelError();
                dispatch({
                    type: ActionsType.ERROR_MESSAGE,
                    error
                })
            })
    }
}
