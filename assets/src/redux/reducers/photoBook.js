/**
 * 文件说明: 照片书
 * 详细描述:
 * 创建者: 胡许彬
 * 创建时间: 17/2/14
 * 变更记录:
 */
import * as ActionsType from '../utils/ActionsType';

// 阿里云公共上传
export function commonUploadStore(state = {datas:[]},action) {

    switch (action.type) {

        case ActionsType.COMMON_UPLOAD:

            let oldData = state.datas||[];

            // 上传成功的替换占位图
            let deleteIndex = 0;
            for(let i=0;i<oldData.length;i++){
                if(oldData[i].progressBar == 1){
                    deleteIndex = i;
                    break;
                }
            }
            oldData.splice(deleteIndex,1,action.store);
            let newData = oldData;

            //let newData = oldData.concat(action.store);

            return Object.assign({datas:newData});

        case ActionsType.DOWNLOAD_PHOTO:
            let oldDownloadData = state.datas||[];

            // 上传成功的替换占位图
            let cancelIndex = 0;
            for(let i=0;i<oldDownloadData.length;i++){
                if(oldDownloadData[i].progressBar == 1){
                    cancelIndex = i;
                    break;
                }
            }
            oldDownloadData.splice(cancelIndex,1,action.store);
            let newDownloadData = oldDownloadData;
            return Object.assign({datas:newDownloadData});

        default:
            return state;
    }
}

// 获取已上传的照片
export function uploadedPhotoStore(state = {}, action) {
    switch (action.type) {

        case ActionsType.UPLOADED_PHOTO:
            return action.store;
        default:
            return state;
    }
}


/*照片书基本信息*/
export function bookInfoStore(state = {}, action) {
    switch (action.type) {
        case ActionsType.BOOK_INFO_STORE:
            return action.store;
        default:
            return state;
    }
}

/*POD基本信息*/
export function podInfoStore(state = {}, action) {
    switch (action.type) {
        case ActionsType.POD_INFO_STORE:
            return action.store;

        case ActionsType.EDIT_TEXT_LIST:

            let indexs = action.data;
            let forwardData = action.store.data.element_list||[];

            let datas = state.content_list[indexs.coverPageIndex].element_list||[];
            // 扉页
            let titleDatas = state.content_list[indexs.titlePageIndex].element_list||[];

            let setIndex = 0;
            datas.splice(indexs.nameIndex,1,forwardData[setIndex]);
            if(indexs.authorIndex){
                datas.splice(indexs.authorIndex,1,forwardData[++setIndex]);
            }
            titleDatas.splice(indexs.titlePageName,1,forwardData[++setIndex]);
            if(indexs.titlePageAuthor){
                titleDatas.splice(indexs.titlePageAuthor,1,forwardData[++setIndex]);
            }
            return state;


        case ActionsType.EDIT_PHOTO_TEXT: // 扉页书名、作者、文字

            let oldEditData = state.content_list || [];
            let restEditStore = [];

            let coverPageIndex = action.store.indexs.coverPageIndex;
            if(coverPageIndex){
                let oldTextData = oldEditData[action.store.indexs.coverPageIndex].element_list||[];
                oldTextData.splice(action.store.indexs.elementId,1,action.res.data.element_list[1]);
            }

            oldEditData.map((item,index)=>{
                if(!(item.content_type == 3 || item.content_type == 6 || item.element_list.length == 0)){
                    restEditStore.push(item);
                }
            });

            let editTextData = restEditStore[action.store.indexs.coverIndex].element_list||[];
            editTextData.splice(action.store.indexs.index,1,action.res.data.element_list[0]);

            return state;

        case ActionsType.UPLOAD_SINGLE:
            let pageIndex = action.data[0].pageIndex;
            let coverIndex = action.data[0].coverIndex;
            let getData = action.store.data;
            let oldData = state.content_list || [];
            let restStore = [];

            let type = action.data[0].type; // 内页编辑和封面编辑

            if(type == 'inner'){
                oldData.map((item,index)=>{
                    if(!(item.content_type == 3 || item.content_type == 6 || item.element_list.length == 0)){
                        restStore.push(item);
                    }
                });
            }else{
                restStore = oldData;
            }

            restStore.map((list,index)=>{
                if(index == pageIndex){
                    ((list.element_list) || []).map((item,idx)=>{
                        if(idx == coverIndex){

                            let imgScale = 0;
                            if(getData.width > 4096 && getData.height < 4096){
                                imgScale = 4096 / getData.width;
                                item.image_content_expand.image_width = 4096;
                                item.image_content_expand.image_height = getData.height;
                            }
                            if(action.store.data.width < 4096 && action.store.data.height > 4096){
                                imgScale = 4096 / getData.height;
                                item.image_content_expand.image_width = getData.width;
                                item.image_content_expand.image_height = 4096;
                            }
                            if(action.store.data.width > 4096 && action.store.data.height > 4096){
                                if(action.width>action.height){
                                    imgScale = 4096 / getData.width;
                                    item.image_content_expand.image_width = 4096;
                                    item.image_content_expand.image_height = getData.height*imgScale;
                                }else{
                                    imgScale = 4096 / getData.height;
                                    item.image_content_expand.image_width = getData.width*imgScale;
                                    item.image_content_expand.image_height = 4096;
                                }
                            }
                            let imgWidth = getData.width;
                            let imgHeight = getData.height;
                            if(parseInt(getData.image_orientation) == 8 || parseInt(getData.image_orientation) == 6){
                                imgWidth = getData.height;
                                imgHeight = getData.width;
                            }

                            let scale;
                            let feste = imgWidth / imgHeight;
                            var cenWidth = item.element_width - (item.element_content_left + item.element_content_right);
                            var cenHeight = item.element_height - (item.element_content_top + item.element_content_bottom);
                            var hinten = cenWidth/cenHeight;
                            if(feste < hinten){
                                scale = cenWidth/imgWidth;
                                let imgTop = (imgHeight * scale - cenHeight) /2;
                                item.image_content_expand.image_start_point_y = Math.floor(-imgTop);
                                item.image_content_expand.image_start_point_x = 0;
                            }else{
                                scale = cenHeight/imgHeight;
                                let imgLeft = (imgWidth * scale - cenWidth) /2;
                                item.image_content_expand.image_start_point_x = Math.floor(-imgLeft);
                                item.image_content_expand.image_start_point_y = 0;
                            }
                            item.image_content_expand.image_scale = scale.toFixed(4);

                            // 标记
                            item.is_edited = true;

                            item.element_content = getData.url;
                            item.image_content_expand.image_url = getData.url;

                            item.image_content_expand.image_width = getData.width;
                            item.image_content_expand.image_height = getData.height;
                        }
                    });
                }
            });

            state.content_list = oldData;

            return Object.assign({},state);


        case ActionsType.PHOTO_CROP:

            let currentIndex = action.data.currentIndex;
            let imageIndex = action.data.imageIndex;

            let imageScale = action.data.data.image_scale;
            let imageRotation = action.data.data.image_rotation; // 旋转参数
            let imageStartPointX = action.data.data.image_start_point_x;
            let imageStartPointY = action.data.data.image_start_point_y;
            let currentData = state.content_list || [];
            let restCurrentStore = [];
            currentData.map((item)=>{
                if(!(item.content_type == 3 || item.content_type == 6 || item.element_list.length == 0)){
                    restCurrentStore.push(item);
                }
            });

            restCurrentStore.map((list,index)=>{
                if(index == currentIndex){
                    ((list.element_list) || []).map((item,idx)=>{
                        if(idx == imageIndex){
                            item.image_content_expand.image_start_point_x = (imageStartPointX * 1000).toFixed(0)/1000;
                            item.image_content_expand.image_start_point_y = (imageStartPointY * 1000).toFixed(0)/1000;
                            item.image_content_expand.image_scale = (imageScale * 1000).toFixed(0)/1000;
                            item.image_content_expand.image_rotation = imageRotation;
                        }
                    });
                }
            });

            state.content_list = currentData;
            return Object.assign({},state);

        default:
            return state;
    }
}


/*主题列表*/
export function themeListStore(state = {}, action) {
    switch (action.type) {

        case ActionsType.THEME_LIST:
            return action.store;

        default:
            return state;
    }
}

/*主题详情*/
export function themeDetailStore(state = {}, action) {
    switch (action.type) {

        case ActionsType.THEME_DETAIL:
            return action.store;

        default:
            return state;
    }
}

/*获取照片书价格*/
export function bookPriceStore(state = {}, action) {
    switch (action.type) {

        case ActionsType.BOOK_PRICE:
            return action.store;

        default:
            return state;
    }
}

/*获取用户信息*/
export function userDetailStore(state = {}, action) {
    switch (action.type) {
        case ActionsType.UESR_DETAIL:
            return action.store;

        default:
            return state;
    }
}
