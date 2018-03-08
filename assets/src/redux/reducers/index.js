/**
 * 文件说明: 根reducer
 * 详细描述:
 * 创建者: 姜赟
 * 创建时间: 16/1/31
 * 变更记录:
 */

import {combineReducers} from 'redux';
import {podCreateStore,calendarTempListStore,editTempStore,calendarStyleListStore,commonAppIdData} from './editor';
import {podStore,wxConfig,printChoiceStore,printPriceStore} from './podView';
import {noteTempListStore,insertPageListStore,innerPageListStore,initialTempDetailStore,notePodData,insertPageNumStore,noteSaveStore} from './noteBook.js';
import {commonUploadStore,bookInfoStore,podInfoStore,themeListStore,themeDetailStore,bookPriceStore,uploadedPhotoStore,userDetailStore} from './photoBook';

const rootReducer = combineReducers({
	podCreateStore,
	calendarTempListStore,
  calendarStyleListStore,
	editTempStore,
	podStore,
	wxConfig,
	printChoiceStore,
	printPriceStore,
  commonAppIdData,
	noteTempListStore,
	insertPageListStore,
	initialTempDetailStore,
	innerPageListStore,
	notePodData,
	insertPageNumStore,
	noteSaveStore,
	commonUploadStore,
	bookInfoStore,
	podInfoStore,
	themeListStore,
	themeDetailStore,
	bookPriceStore,
	uploadedPhotoStore,
	userDetailStore
});

export default rootReducer;