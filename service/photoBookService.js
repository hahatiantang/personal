/**
 * 文件说明: 照片书 service
 * 详细描述:
 * 创建者  : 胡许彬
 * 创建时间: 2017/2/13
 * 变更记录:
 */
import Q from 'q';
import HttpClient from '../assets/src/redux/utils/httpClient';
import Config from '../config';

import $ from 'jquery';

// 获取sys授权
export function getSignature(handleCb) {

    HttpClient.post('http://auth.v5time.net/web/sts', {url:'img1.timeface.cn',dir:'times'})
        .then((res)=>{

            window.STSOBJEACT = res;
            handleCb.handleSuccess(res);

        },(err)=>{

            handleCb && handleCb.handelError(err);
        });
}

// 获取配置
export function getConfig(param,handleCb){

    let url = Config.PHOTO_API.host + Config.PHOTO_API.path + '/photo/config';
    $.ajax({
        type:'POST',
        data:param,
        url:url,
        success:function(res){
            handleCb.handleSuccess(res);
        },
        error:function(err){
            handleCb && handleCb.handelError(err);
        }
    });
}

// 拆分书接口
export function splitBookApi(param,handleCb,header){

    let url = Config.PHOTO_API.host + Config.PHOTO_API.path + '/photo/split';
    $.ajax({
        type:'POST',
        data:param,
        url:url,
        success:function(res){
            handleCb && handleCb.handleSuccess(res);
        },
        error:function(err){
            handleCb && handleCb.handelError(err);
        }
    });
}

// 判断sts授权是否成功
export function uploadPhotos(params,handleCb) {
    let defer = Q.defer();
    //auth.timeface.cn

    window.STSOBJEACT = params.signature;
    if(!window.STSOBJEACT){
        HttpClient.post('http://auth.timeface.cn/web/sts', {url: 'img1.timeface.cn', dir: 'times' })
            .then((res) => {
                //console.warn('授权请求完成，开始计算文件 MD5',new Date());
                window.STSOBJEACT = res;
                //计算图片 MD5
                calculateImageMD5(params,handleCb);
                defer.resolve(res);
            },(err)=>{
                if(err.code = 'timeout'){
                    err.uploadtime = params.uploadtime;
                    handleCb && handleCb.handelError(err);
                }
            });
    }else{
        calculateImageMD5(params,handleCb);
    }

    return defer.promise;
}

// 编辑照片书替换照片
export function uploadSinglePhoto(param,handleCb){
    HttpClient.upload('/common/openuploadimg',param)
        .then((res)=>{
            handleCb.handleSuccess(res);
        },(err)=>{
            handleCb && handleCb.handelError(err);
        });
}

// 编辑保存
export function saveEdit(param,handleCb){
    HttpClient.post(Config.API_OPEN.host + '/openpod/pod/editpodv2',param,{accesstoken:param.accesstoken,unionid:param.unionid})
        .then((res)=>{
            handleCb.handleSuccess(res);
        },(err)=>{
            handleCb && handleCb.handelError(err);
        });
}

// 封面封底编辑同步
export function editCover(param,handleCb){

    let url = Config.PHOTO_API.host + Config.PHOTO_API.path + '/photo/editCover';
    $.ajax({
        type:'POST',
        data:param,
        url:url,
        success:function(res){
            handleCb.handleSuccess(res);
        },
        error:function(err){
            handleCb && handleCb.handelError(err);
        }
    });
}

// 内页编辑同步
export function podChangePic(param,handleCb){

    HttpClient.post(Config.PHOTO_API.host + Config.PHOTO_API.path + '/photo/podChangePic',param)
        .then((res)=>{
            handleCb.handleSuccess(res);
        },(err)=>{
            handleCb && handleCb.handelError(err);
        });
}

// 编辑内页文字
export function editText(param,handleCb){
    HttpClient.post(Config.API_OPEN.host + '/openpod/pod/edittextlist',{'element_list':param.tempInfo},{accesstoken:param.accesstoken,unionid:param.unionid})
        .then((res)=>{
            handleCb.handleSuccess(res);
        },(err)=>{
            handleCb && handleCb.handelError(err);
        });
}

// 编辑文字
export function editTextlist(param,handleCb){
    HttpClient.post(Config.API_OPEN.host + '/openpod/pod/edittextlist',param,{accesstoken:param.accesstoken,unionid:param.unionid})
        .then((res)=>{
            handleCb.handleSuccess(res);
        },(err)=>{
            handleCb && handleCb.handelError(err);
        });
}

//得到文件后缀名
const getSuffix = (filename)=> {
    let pos = filename.lastIndexOf('.');
    let suffix = '';
    if (pos != -1){
        suffix = filename.substring(pos);
    }
    return suffix;
};

// 文件MD5
const calculateImageMD5 = (params,handleCb)=>{
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        file = params.file,
        chunkSize = 2097152, // Read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();
    fileReader.onload = function (e) {
        //console.log('read chunk nr', currentChunk + 1, 'of', chunks);
        spark.append(e.target.result);  // Append array buffer
        currentChunk++;

        if(currentChunk < chunks){
            loadNext();
        }else{
            let filename = '/a' + spark.end() + getSuffix(params.file.name); // 缓存问题 +a
            //console.info('computed hash', filename);  // Compute hash

            //console.warn('文件 MD5计算完成，开始阿里云上传',new Date());
            //开始阿里云上传
            uploadForALiYun(params,filename,handleCb);
        }
    };

    fileReader.onerror = function () {
        //console.warn('oops, something went wrong.');
    };

    function loadNext() {
        var start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();
};

// 获取图片信息
function getImageInfo(imageALiPath,handleCb){
    let defer = Q.defer();
    const IMAGE_DEFAULT_OBJECT = {
        id:0,
        containsShotTime:0,
        originalTime:0,
        height:	0,
        originalHeight:	0,
        rotate:	0,
        remark:	'',
        hasRead:0,
        width:	0,
        originalWidth:0,
        uploadtime:0,
        url:0,
        yurl:0,
        userRotate:0
    };

    // 获取图片地址
    HttpClient.get(imageALiPath + '@infoexif')
        .then((result)=> {
            let image_result_object = Object.assign({},IMAGE_DEFAULT_OBJECT);
            image_result_object.rotate = result.Orientation ? result.Orientation.value : 1;
            image_result_object.originalTime = result.DateTimeOriginal ? (new Date(result.DateTimeOriginal.value.split(" ")[0].replace(/:/g,'-')).getTime() ? new Date(result.DateTimeOriginal.value.split(" ")[0].replace(/:/g,'-')).getTime(): '-28800000') : '-28800000';
            image_result_object.containsShotTime = result.DateTimeOriginal ? (new Date(result.DateTimeOriginal.value.split(" ")[0].replace(/:/g,'-')).getTime() ? 1 : 0 ) : 0;
            image_result_object.width = result.ImageWidth.value;
            image_result_object.height = result.ImageHeight.value;
            image_result_object.url = imageALiPath;

            //处理成功回调
            handleCb && handleCb.handleSuccess(image_result_object);
        },(err)=>{
            // 获取图片信息报错
            err.data = '上传非RGB格式';
            // handleCb && handleCb.handelError(err);
            handleCb.handelError(err);
        });
    return defer.promise;
}

//阿里云上传
function uploadForALiYun(param,filename,handleCb) {
    let defer = Q.defer();
    let params = {
        fields: [
            {name: 'key', value: window.STSOBJEACT.dir + filename},
            {name: 'policy', value: window.STSOBJEACT.policy},
            {name: 'OSSAccessKeyId', value: window.STSOBJEACT.accessid},
            {name: 'success_action_status', value: 200},
            {name: 'signature', value: window.STSOBJEACT.signature}
        ],
        name: 'file',
        file: param.file
    };

    let imageALiPath = 'http://img1.timeface.cn/times'+ filename;

    HttpClient.head(imageALiPath).then(()=>{
        // 直接得到图片信息
        getImageInfo(imageALiPath,handleCb);
    },()=>{
        // 上传图片
        HttpClient.upload('http://img1.timeface.cn', params)
            .then(()=>{
                getImageInfo(imageALiPath,handleCb);
            },(err)=>{
                // 上传报错
                if(err.code == 403){ // 没有权限
                    window.STSOBJEACT = null;
                    uploadPhotos(params,handleCb);
                    //defer.reject(err);
                }else{
                    handleCb && handleCb.handelError(err);
                    //defer.resolve(err);
                }
            });
    });

    return defer.promise;
}

//下载
export function downloadPhoto(param,handleCb){
    let url = Config.PHOTO_API.host + Config.PHOTO_API.path + '/photo/downloadimg';
    HttpClient.post(url,param,{type:'form'})
        .then((res)=>{
            handleCb.handleSuccess(res);
        },(err)=>{
            handleCb && handleCb.handelError(err);
        });
}

//一键成书
export function makeBook(param,handleCb){
    let url = Config.PHOTO_API.host + Config.PHOTO_API.path + '/photo/save';

    $.ajax({
        type:'POST',
        data:param,
        url:url,
        success:function(res){
            handleCb.handleSuccess(res);
        },
        error:function(err){
            handleCb && handleCb.handelError(err);
        }
    });

}

// 获取主题列表
export function getThemeList(param,handleCb){
    let url = Config.PHOTO_API.host + Config.PHOTO_API.path + '/photo/themeList';

    $.ajax({
        type:'POST',
        data:param,
        url:url,
        success:function(res){
            handleCb.handleSuccess(res);
        },
        error:function(err){
            handleCb && handleCb.handelError(err);
        }
    });
}


// 获取主题详情
export function getThemeDetail(param,handleCb){
    let url = Config.PHOTO_API.host + Config.PHOTO_API.path + '/photo/theme';

    $.ajax({
        type:'POST',
        data:param,
        url:url,
        success:function(res){
            handleCb.handleSuccess(res);
        },
        error:function(err){
            console.log(err,'0256');
            handleCb && handleCb.handelError(err);
        }
    });
}

//更换主题
export function updateTheme(param,handleCb){
    let url = Config.PHOTO_API.host + Config.PHOTO_API.path + '/photo/changeTheme';

    $.ajax({
        type:'POST',
        data:param,
        url:url,
        success:function(res){
            handleCb.handleSuccess(res);
        },
        error:function(err){
            handleCb && handleCb.handelError(err);
        }
    });
}

// 获取照片列表
export function getPhotoList(param,handleCb){

    let url = Config.PHOTO_API.host + Config.PHOTO_API.path + '/photo/imglist';

    HttpClient.post(url,param,{type:'form'})
        .then((res)=>{
            handleCb.handleSuccess(res);
        },(err)=>{
            handleCb && handleCb.handelError(err);
        });
}

// 获取价格
export function getBookPrice(param,handleCb){

    let url = Config.PHOTO_API.host + Config.PHOTO_API.path + '/photo/price';

    $.ajax({
        type:'POST',
        data:param,
        url:url,
        success:function(res){
            handleCb.handleSuccess(res);
        },
        error:function(err){
            handleCb && handleCb.handelError(err);
        }
    });
}

