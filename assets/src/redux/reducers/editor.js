/**
 * 文件说明: 小编信息
 * 详细描述:
 * 创建者: 姜赟
 * 创建时间: 16/1/31
 * 变更记录:
 */
import * as ActionsType from '../utils/ActionsType';
import _ from 'lodash';
/**
 * 获取台历数据
 * @param state
 * @param action
 * @returns {*}
 */
export function podCreateStore(state = {}, action) {
	switch (action.type) {
		case ActionsType.POD_CREATE_STORE:
			return action.store;
		case ActionsType.IMG_UPLOAD:
			state.content_list[action.currentIndex].element_list[action.index].element_content = action.data.image_url
			_.assign(state.content_list[action.currentIndex].element_list[action.index].image_content_expand,action.data)
			return _.assign({},state)
		//更改版式
		case ActionsType.EDIT_CALENDAR_TEMP:
			console.log('yuchenglong',action.tempData.content_list[0])
			_.assign(state.content_list[action.currentIndex], action.tempData.content_list[0]);
			console.log('maomao',state.content_list[action.currentIndex])
			return _.assign({},state);
		//更改风格
		case ActionsType.EDIT_CALENDAR_STYLE:
			state.content_list.map((item,index)=>{
				if(index > 0 && index < 25){
					item.element_list.map((list)=>{
            if(item.page_type){
              if(list.element_type == 2 && list.element_name.substring(0,list.element_name.length-1) == 'word10'){
                action.styleData[index - 1].map((style)=>{
                  if(style.element_name == list.element_name){
                  	style.element_content = list.element_content;
                  	style.element_deleted = list.element_deleted;
                  	style.image_content_expand = list.image_content_expand;
                    _.assign(list,style)
                  }
                })
              }
              if(list.element_type == 5 && list.element_name == 'month1'){
                let styleL = _.filter(action.styleData[index - 1],(item)=>{
                  return item.element_name == 'month1'
                });
                _.assign(list,styleL[0])
              }
						}else{
              if(list.element_type == 5 && list.element_name == 'month1'){
                _.assign(list,action.styleData[index - 1][0])
              }
						}
					})
				}
			});
			state.book_style = action.params.book_style;
      return _.assign({},state);
		//更改文字
		case ActionsType.EDIT_CALENDAR_TEXT:
			console.log(action,'sdf')
			_.assign(state.content_list[action.currentIndex].element_list[action.index.index], action.textData);
      if(action.currentIndex == 0){
        state.book_title = action.textData.element_content
      }
			return _.assign({},state);
		case ActionsType.IMAGE_CROP:
			console.log('sdaf',state.content_list[action.currentIndex].element_list[action.index].image_content_expand)
			console.log('action.cropData',action)
			_.assign(state.content_list[action.currentIndex].element_list[action.index].image_content_expand, action.cropData);
			return _.assign({},state);
		//纪念日编辑
		case ActionsType.MEMORY_EDIT:
			//flag为1表示删除
			if(action.memoryData.flag == 1){
				//反面
				if(action.memoryData.side == 1){
					state.content_list[action.currentIndex].element_list[action.memoryData.index].element_content = '';
					state.content_list[action.currentIndex].element_list[action.memoryData.index].text_content_expand.text_content = '';
					state.content_list[action.currentIndex].element_list[action.memoryData.index].text_content_expand.text_content = '';
				}else{
					state.content_list[action.currentIndex].element_list[action.memoryData.index].element_deleted = 1;
					state.content_list[action.currentIndex].element_list.map((list)=>{
						if(list.element_type == 2 && list.element_name.substring(0,list.element_name.length-1) == 'word10'){
							list.element_deleted = 1
						}
						if(list.element_type == 5 && list.element_name.substring(0,list.element_name.length) == 'pendant101'){
							list.element_deleted = 1
						}
					})
				}
			}else{
				if(action.memoryData.side == 1){
					state.content_list[action.currentIndex].element_list.map((list)=>{
						if(list.element_type == 2 && list.element_name.substring(0,4) == 'word'){
              list.image_content_expand.image_url = '';
              list.text_content_expand.text_content = '';
              list.element_content = '';
						}
					});
					action.memoryData.backData.map((list)=>{
						list.data.element_model.element_deleted = 0;
						_.assign(state.content_list[action.currentIndex].element_list[list.dataIndex], list.data.element_model);
					});
				}else if(action.memoryData.side == 2){
					state.content_list[action.currentIndex].element_list.map((list)=>{
						if(list.element_type == 5&&list.element_name.substring(0,5) != 'month'
							&& list.element_name.substring(0,list.element_name.length) != 'pendant101'
							&& list.element_name.substring(0,list.element_name.length) != 'rlsPendant'
							&& list.element_name.substring(0,list.element_name.length).indexOf('otherP') < 0){
							list.element_deleted = 1
						}
					});
					action.memoryData.saveData.map((item)=>{
						state.content_list[action.currentIndex].element_list.map((list)=>{
							if(list.element_type == 5&&list.element_name.substring(0,5) != 'month' && list.element_name.substring(0,list.element_name.length) != 'pendant101'){
								if(handelDate(list.element_name) == item.day && item.intro.trim()){
									list.element_deleted = 0
								}
							}
						});
					});
				}else if(action.memoryData.side == 3){
					state.content_list[action.currentIndex].element_list.map((list)=>{
						if(list.element_type == 5 && list.element_name.substring(0,list.element_name.length) == 'pendant101'){
							list.element_deleted = 1
						}
						if(list.element_type == 2 && list.element_name.substring(0,list.element_name.length-1) == 'word10'){
							list.element_deleted = 1
						}
					});
					action.memoryData.frontData.map((list)=>{
						list.data.element_model.element_deleted = 0;
						_.assign(state.content_list[action.currentIndex].element_list[list.dataIndex], list.data.element_model);
					});
					state.content_list[action.currentIndex].element_list.map((list)=>{
						if(list.element_type == 5 && list.element_name.substring(0,list.element_name.length) == 'pendant101' && action.memoryData.frontData.length > 0){
							list.element_deleted = 0
						}
					})
				}
			}
			return _.assign({},state);
		default:
			return state;
	}
}

//判断日期
function handelDate(date){
	let num = date.substring(date.length-2,date.length);
	if(parseInt(num) > 9){

	}else{
		num = num.substring(num.length-1,num.length)
	}
	return parseInt(num);
}

/**
 *  台历板式列表store
 * @param state
 * @param action
 * @returns {*}
 * @constructor
 */
export function calendarTempListStore(state = [], action) {
	switch (action.type) {
		case ActionsType.CALENDAR_TEMP_LIST:
			return action.store;
		case ActionsType.CL_TEMP_LIST:
			return [];
		default:
			return state;
	}
}
/**
 * 更改台历板式数据
 * @param state
 * @param action
 * @returns {*}
 */
export function editTempStore(state = {}, action) {
	switch (action.type) {
		case ActionsType.EDIT_TEMP:
			return action.store;
		default:
			return state;
	}
}

//台历风格数据
export function calendarStyleListStore(state = [], action) {
  switch (action.type) {
    case ActionsType.CALENDAR_STYLE_LIST:
      return action.store;
    default:
      return state;
  }
}

//台历风格数据
export function commonAppIdData(state = [], action) {
  switch (action.type) {
    case ActionsType.COMMON_APPID:
      return action.store;
    default:
      return state;
  }
}