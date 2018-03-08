/**
 * 文件说明: 上传照片 action
 * 详细描述:
 * 创建者  : 胡许彬
 * 创建时间: 2017/2/13
 * 变更记录:
 */
import Q from 'q';
import * as ActionsType from '../utils/ActionsType';
import * as uploadService from '../../../../service/photoBookService';

// 获取sys签名
export function getSignature(successBack,errorBack){
    return (dispatch) => {
        let defer = Q.defer();
        uploadService.getSignature({
            handleSuccess:(res)=>{
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
        return defer.promise;
    }
}


// 根据照片类型获取尺寸和装帧方式
export function getConfig(param,successBack,errorBack) {
    return (dispatch) => {
        uploadService.getConfig(param,{
            handleSuccess:(res)=>{
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}

// 上传照片
export function uploadPhotosAction(param,successBack,errorBack) {
    return (dispatch) => {

        uploadService.uploadPhotos(param,{
            handleSuccess:(res)=>{
                dispatch({
                    type: ActionsType.COMMON_UPLOAD,
                    store: res
                });
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        }).then((res)=>{
            //授权成功
        },(err)=>{
            errorBack.handelError(err);
        });
    }
}

// 编辑照片书替换照片
export function uploadSinglePhoto(param,successBack,errorBack) {
    return (dispatch) => {

        uploadService.uploadSinglePhoto(param,{
            handleSuccess:(res)=>{
                dispatch({
                    type: ActionsType.UPLOAD_SINGLE,
                    store: res,
                    data:param.changeData
                });
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}

// 图片裁剪
export function imageCrop(param) {
    return (dispatch) => {

        dispatch({
            type: ActionsType.PHOTO_CROP,
            data:param
        });
    }
}


// 内页文字编辑
export function editText(param,successBack,errorBack){
    return (dispatch) => {

        uploadService.editText(param,{
            handleSuccess:(res)=>{
                dispatch({
                    type: ActionsType.EDIT_PHOTO_TEXT,
                    store: param,
                    res:res
                });
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}

// 编辑保存
export function saveEdit(param,successBack,errorBack) {
    return () => {
        uploadService.saveEdit(param,{
            handleSuccess:(res)=>{
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}

// 封面封底同步
export function editCover(param,successBack,errorBack) {
    return () => {
        uploadService.editCover(param,{
            handleSuccess:(res)=>{
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}

// 内页同步
export function podChangePic(param,successBack,errorBack) {
    return () => {
        uploadService.podChangePic(param,{
            handleSuccess:(res)=>{
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}

// 编辑文字
export function editTextlist(param,successBack,errorBack) {
    return (dispatch) => {
        uploadService.editTextlist(param,{
            handleSuccess:(res)=>{
                dispatch({
                    type: ActionsType.EDIT_TEXT_LIST,
                    store: res,
                    data:param.indexs
                });
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}



// 微信上传图片后下载
export function downloadPhotoAction(param,handleCb) {
    return (dispatch) => {

        uploadService.downloadPhoto(param,{
            handleSuccess:(res)=>{
                dispatch({
                    type: ActionsType.DOWNLOAD_PHOTO,
                    store: res.data
                });
                handleCb.handleSuccess(res);
            },
            handelError:(err)=>{
                handleCb.handelError(err);
            }
        });

    }
}


// 一键成书
export function makeBook(param,successBack,errorBack) {
    return (dispatch) => {

        uploadService.makeBook(param,{
            handleSuccess:(res)=>{
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}

// 获取主题列表
export function getThemeList(param,successBack,errorBack) {
    return (dispatch) => {

        uploadService.getThemeList(param,{
            handleSuccess:(res)=>{

                dispatch({
                    type:ActionsType.THEME_LIST,
                    store:res.data
                });
                
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}

// 获取主题详情
export function getThemeDetail(param,successBack,errorBack) {
    return (dispatch) => {

        uploadService.getThemeDetail(param,{
            handleSuccess:(res)=>{

                dispatch({
                    type:ActionsType.THEME_DETAIL,
                    store:res.data
                });

                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}

//更换主题
export function updateTheme(param,successBack,errorBack) {
    return (dispatch) => {

        uploadService.updateTheme(param,{
            handleSuccess:(res)=>{

                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}

// 获取照片列表
export function imglistAction(param,successBack,errorBack) {
    return (dispatch) => {

        uploadService.getPhotoList(param,{
            handleSuccess:(res)=>{

                dispatch({
                    type:ActionsType.UPLOADED_PHOTO,
                    store:res.data
                });

                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}


// 获取价格
export function getBookPrice(param,successBack,errorBack) {
    return (dispatch) => {

        uploadService.getBookPrice(param,{
            handleSuccess:(res)=>{
                dispatch({
                    type:ActionsType.BOOK_PRICE,
                    store:res.data
                });
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}

// 拆分书接口
// 根据照片类型获取尺寸和装帧方式
export function splitBookAction(param,successBack,errorBack) {
    return (dispatch) => {
        uploadService.splitBookApi(param,{
            handleSuccess:(res)=>{
                successBack.handleSuccess(res);
            },
            handelError:(err)=>{
                errorBack.handelError(err);
            }
        });
    }
}



