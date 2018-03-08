/**
 * 文件说明: 记事本
 * 详细描述:
 * 创建者: 邵纪昊
 * 创建时间: 16/11/11
 * 变更记录:
 */
/** ░░░░░░░░▌▒█░░░░░░░░░░░▄▀▒▌   **/
/** ░░░░░░░░▌▒▒█░░░░░░░░▄▀▒▒▒▐   **/
/** ░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐   **/
/** ░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐   **/
/** ░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌   **/
/** ░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒   **/
/** ░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐  **/
/** ░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄  **/
/** ░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒  **/
/** ▀▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒  **/

/* Developed by ${USER}                                   */
/* The single doge JUST LOOKING AT YOU without any words. */
/* 单身犬默默地看着你，一句话也不说。                          */

import * as ActionsType from '../utils/ActionsType';
import _ from 'lodash';

/*获取记事本封面样式列表*/
export function noteTempListStore(state = [], action) {
    switch (action.type) {
        case ActionsType.NOTE_TEMP_LIST:
            return action.store;
        default:
            return state;
    }
}

/*获取记事本插页样式列表*/
export function insertPageListStore(state = [], action) {
    switch (action.type) {
        case ActionsType.INSERT_PAGE_LIST:
            return action.store;
        default:
            return state;
    }
}

/*获取记事本纸张列表*/
export function innerPageListStore(state = [], action) {
    switch (action.type) {
        case ActionsType.INNER_PAGE_LIST:
            return action.store;
        default:
            return state;
    }
}

/*插页页码*/
export function insertPageNumStore(state = 0, action) {
    switch (action.type) {
        case ActionsType.INSERT_PAGE_NUM_CLICK:
            if((state == 0 && action.num < 0) || !action.num ){
                state = 0;
            }else if(state == 11 && action.num > 0){
                state = 11;
            }else{
                state = state + action.num;
            }
            return state;
        default:
            return state;
    }
}

/*获取记事本默认封面内容*/
export function initialTempDetailStore(state = {}, action) {
    switch (action.type) {
        //获取默认内容
        case ActionsType.INITIAL_TEMP_DETAIL:
            return action.store;
        //选择纸张
        case ActionsType.SELECT_PAPER:
            state.content_list.inner[0].page_image = action.data.img;
            state.content_list.inner[0].template_id = action.data.id;
            return _.assign({},state);
        //更换插页版式
        case ActionsType.REPLACE_INSERT:
            state.content_list.insert[action.num].template_id = action.id;
            if(action.index == 0){
                var contentOneId = state.content_list.insert[action.num].content_id;
                _.assign(state.content_list.insert[action.num],action.data);
                state.content_list.insert[action.num].content_id = contentOneId;
            }else{
                var imgInfo = _.filter(state.content_list.insert[action.num].element_list,(list) => {
                    return list.element_type == 1;
                })[0];
                var contentId = state.content_list.insert[action.num].content_id;
                var imgDataUrl = imgInfo.image_content_expand.image_url;
                var imgData = imgInfo.element_content;
                _.assign(state.content_list.insert[action.num],action.info[action.index].PAGE);
                state.content_list.insert[action.num].content_id= contentId;
                if(imgData){
                    _.assign(_.filter(state.content_list.insert[action.num].element_list,(list) => {
                        return list.element_type == 2;
                    })[0],action.data);
                    _.filter(state.content_list.insert[action.num].element_list,(list) => {
                        return list.element_type == 1;
                    })[0].image_content_expand.image_url = imgDataUrl;
                    _.filter(state.content_list.insert[action.num].element_list,(list) => {
                        return list.element_type == 1;
                    })[0] = imgData;
                }
            }
            return _.assign({},state);
        //插页设置
        case ActionsType.INSERT_SET:
            state.insert_type = action.data;
            return _.assign({},state);
        //裁剪图片
        case ActionsType.NOTE_IMAGE_CROP:
            if(action.flag == 'cover'){
                _.assign(state.content_list.cover[0].element_list[action.index].image_content_expand,action.data)
            }else{
                _.assign(state.content_list.insert[action.page].element_list[action.index].image_content_expand,action.data)
            }
            return _.assign({},state);
        //替换图片
        case ActionsType.NOTE_IMG_UPLOAD:
            if(action.flag == 'cover'){
                state.content_list.cover[0].element_list[action.index].element_content = action.data.image_url;
                _.assign(state.content_list.cover[0].element_list[action.index].image_content_expand,action.data)
            }else{
                state.content_list.insert[action.currentIndex].element_list[action.index].element_content = action.data.image_url;
                _.assign(state.content_list.insert[action.currentIndex].element_list[action.index].image_content_expand,action.data)
            }
            return _.assign({},state);
        //更换封面版式
        case ActionsType.REPLACE_TEMPLATE:
            state.template_id = parseInt(action.temp.content_list[0].template_id);
            _.assign(state.content_list.cover[0],action.temp.content_list[0]);
            return _.assign({},state);
        //更改封面文字
        case ActionsType.EDIT_NOTE_TEXT:
            if(action.index.flag == 'cover'){
                if(action.index.element_flag ==1){
                    state.book_title = action.textData.element_content
                }
                _.assign(state.content_list.cover[action.index.coverIndex].element_list[action.index.index], action.textData);
            }else if(action.index.flag == 'insert'){
                _.assign(state.content_list.insert[action.page].element_list[action.index.index], action.textData);
            }
            return _.assign({}, state);
        default:
            return state;
    }
}

/*获取记事本插页样式列表*/
export function noteSaveStore(state = {}, action) {
    switch (action.type) {
        case ActionsType.NOTE_SAVE:
            return action.store;
        default:
            return state;
    }
}

/*获取记事本预览页面内容*/
export function notePodData(state = {}, action) {
    switch (action.type){
        case ActionsType.NOTE_BOOK_POD:
            return action.store;
        default:
            return state;
    }
}