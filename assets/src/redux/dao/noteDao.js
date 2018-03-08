/**
 * 文件说明: 接口请求文件
 * 详细描述:
 * 创建者: 邵纪昊
 * 创建时间: 16/11/14
 * 变更记录:
 */
import Q from 'q';
import HttpClient from '../utils/httpClient';
import * as ActionsType from '../utils/ActionsType';

/*获取封面样式列表*/
export function noteTempList(params) {
    return (dispatch) =>{
        HttpClient.post('/notebook/notetemplist', params)
            .then((res)=> {
                dispatch({
                    type: ActionsType.NOTE_TEMP_LIST,
                    store: res.data
                })
            }, (err)=> {
                dispatch({
                    type: ActionsType.ERROR_MESSAGE,
                    err
                })
            });
    }
}

/*获取插页样式列表*/
export function insertPageList(params) {
    return (dispatch) =>{
        HttpClient.post('/notebook/insertpagelist', params)
            .then((res)=> {
                dispatch({
                    type: ActionsType.INSERT_PAGE_LIST,
                    store: res.data
                })
            }, (err)=> {
                dispatch({
                    type: ActionsType.ERROR_MESSAGE,
                    err
                })
            });
    }
}

/*获取纸张列表*/
export function innerPageList(params) {
    return (dispatch) =>{
        HttpClient.post('/notebook/chooseinner', params)
            .then((res)=> {
                dispatch({
                    type: ActionsType.INNER_PAGE_LIST,
                    store: res.data
                })
            }, (err)=> {
                dispatch({
                    type: ActionsType.ERROR_MESSAGE,
                    err
                })
            });
    }
}

/*翻页效果*/
export function insertPageNumClick(num){
    return (dispatch) => {
        dispatch({
            type: ActionsType.INSERT_PAGE_NUM_CLICK,
            num
        });
    }
}

/*修改封面款式*/
export function tempDetail(param,callback) {
    let defer = Q.defer();
    return (dispatch)=> {
        HttpClient.post('/notebook/tempdetail', param, {type: 'json'})
            .then((res)=> {
                if(callback&&callback.handelSuccess){
                    callback.handelSuccess(res.data);
                }
                dispatch({
                    type: ActionsType.TEMP_DETAIL,
                    store: res.data
                });
                defer.resolve(res);
            }, (err)=> {
                if(callback&&callback.handelError){
                    callback.handelError(err);
                }
                dispatch({
                    type: ActionsType.ERROR_MESSAGE,
                    error
                });
                defer.reject(err);
            });
        return defer.promise;
    }
}

/*修改台历文字*/
export function noteEditText(param,call) {
    let defer = Q.defer();
    return (dispatch)=> {
        HttpClient.post('/notebook/edittext', param, {type: 'json'})
            .then((res)=> {
                if(call){
                    call.handelSuccess(res)
                }
                dispatch({
                    type: ActionsType.NOTE_EDIT_TEXT,
                    store: res.data
                });
                defer.resolve(res);
            }, (err)=> {
                if(call){
                    call.handelError(res)
                }
                dispatch({
                    type: ActionsType.ERROR_MESSAGE,
                    error
                });
                defer.reject(err);
            });
        return defer.promise;

    }
}

/*保存记事本*/
export function noteSave(param,call) {
    let defer = Q.defer();
    return (dispatch)=> {
        HttpClient.post('/notebook/save', param, {type: 'json'})
            .then((res)=> {
                if(call){
                    call.handelSuccess(res)
                }
                dispatch({
                    type: ActionsType.NOTE_SAVE,
                    store: res.data
                });
                defer.resolve(res);
            }, (err)=> {
                if(call){
                    call.handelError(res)
                }
                dispatch({
                    type: ActionsType.ERROR_MESSAGE,
                    error
                });
                defer.reject(err);
            });
        return defer.promise;

    }
}

/*记事本文字保存*/
export function editNoteText(textData,index,page){
    return (dispatch) => {
        dispatch({
            type: ActionsType.EDIT_NOTE_TEXT,
            textData,
            index,
            page
        });
    }
}

/*记事本版式更换*/
export function replaceTemplate(temp){
    return (dispatch) => {
        dispatch({
            type: ActionsType.REPLACE_TEMPLATE,
            temp
        });
    }
}

/*记事本插页版式更换*/
export function replaceInsert(data,num,index,info,id){
    return (dispatch) => {
        dispatch({
            type: ActionsType.REPLACE_INSERT,
            data,
            num,
            index,
            info,
            id
        });
    }
}

/*替换图片*/
export function noteImgUpload(data,index,currentIndex,flag) {
    return (dispatch) => {
        dispatch({
            type: ActionsType.NOTE_IMG_UPLOAD,
            data,
            index,
            currentIndex,
            flag
        });
    }
}

/*图片裁剪*/
export function noteImageCrop(data,index,flag,page){
    return (dispatch) => {
        dispatch({
            type: ActionsType.NOTE_IMAGE_CROP,
            data,
            index,
            flag,
            page
        });
    }
}

/*插页设置*/
export function insertSet(data){
    return (dispatch) => {
        dispatch({
            type: ActionsType.INSERT_SET,
            data
        });
    }
}

/*选择纸张*/
export function selectPaper(data){
    return (dispatch) => {
        dispatch({
            type: ActionsType.SELECT_PAPER,
            data
        });
    }
}

/*获取记事本pod预览*/
export function noteBookPOD(params) {
    return (dispatch) =>{
        HttpClient.post('/book/pod', params)
            .then((res)=> {
                dispatch({
                    type: ActionsType.NOTE_BOOK_POD,
                    store: res.data
                })
            }, (err)=> {
                dispatch({
                    type: ActionsType.ERROR_MESSAGE,
                    err
                })
            });
    }
}