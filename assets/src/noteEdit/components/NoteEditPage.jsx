/**
 * 文件说明:记事本编辑页面
 * 详细描述:
 * 创建者: 邵纪昊
 * 创建时间: 2016/11/11
 * 变更记录:
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import URL from 'url';

import {noteTempList,
    insertPageList,
    innerPageList,
    tempDetail,
    noteEditText,
    editNoteText,
    replaceTemplate,
    noteImgUpload,
    noteImageCrop,
    insertSet,
    insertPageNum,
    insertPageNumClick,
    replaceInsert,
    selectPaper,
    noteSave} from '../../redux/dao/noteDao.js';
import {uploadImg} from '../../redux/dao/dao.js';

import Loading from '../../common/Loading.jsx'
import NoteEditHead from './NoteEditHead.jsx';
import NoteEditBody from './NoteEditBody.jsx';
import EditTextDialog from '../../edit/components/EditTextDialog.jsx';
import '../less/noteEdit.less';

class NoteEditPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show:0, //0:设计封面 1:设计插页 2:选择纸张
            currentIndex:1,
            alertMsg:'',
            textDialog:false,
            listClose:false,
            showLoading:false,
            loadingMsg:'',
            insertPage:0,
            proportion:1
        };
        this.queryObj = URL.parse(window.location.href, true).query || {};
        this.actions = bindActionCreators({noteTempList,
            insertPageList,
            innerPageList,
            tempDetail,
            noteEditText,
            uploadImg,
            editNoteText,
            replaceTemplate,
            noteImgUpload,
            noteImageCrop,
            insertSet,
            insertPageNum,
            insertPageNumClick,
            replaceInsert,
            selectPaper,
            noteSave},props.dispatch);
    }

    componentDidMount(){
        /*获取封面样式列表*/
        this.actions.noteTempList();
        /*获取插页样式列表*/
        this.actions.insertPageList();
        /*获取插页样式列表*/
        this.actions.innerPageList();

        /*微信*/
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: wxConfig.appId, // 必填，公众号的唯一标识
            timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
            signature: wxConfig.signature,// 必填，签名，见附录1
            jsApiList: ['hideOptionMenu','chooseImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
            wx.hideOptionMenu();
        });
        /*针对部分机型比例*/
        if($(window).height() <= 550){
            this.setState({
                proportion:0.9
            })
        }
    }

    /*页面显示*/
    showActive(flag){
        this.setState({
            show:flag
        })
    }

    /*完成编辑记事本*/
    noteBookComplete(){
        this.handelAlertMsg(true,'内容保存中……');
        let data = {
            bookId:this.queryObj.bookId || "",
            json:this.props.initialTempDetailStore,
            from:3
        };
        this.actions.noteSave(data,{
            handelSuccess:(res)=>{
                let bookId = res.data || "";
                this.handelAlertMsg(false,'');
                window.location.href = "/calendar/notepreview?bookId=" + bookId;
            },
            handelError:(err)=>{
                this.handelAlertMsg(true,'内容保存中……');
            }
        });
    }

    /*编辑文字弹出层*/
    handEditTextDialog(txtConfig,page){
        this.setState({
            textConfig:txtConfig
        },()=>{
            this.setState({
                textDialog:true,
                insertPage:page
            })
        })
    }

    /*关闭修改文字弹出层*/
    closeTextDialog(){
        this.setState({
            textDialog:false
        })
    }

    /*编辑文字*/
    handelTextEdit(textConfig,index){
        this.handelAlertMsg(true,'文字保存中……');
        let calendarData =this.props.initialTempDetailStore;
        let textData = {
            noteId:calendarData.book_id,
            text:textConfig.element_list.element_content || '请输入文字',
            tempId:calendarData.template_id,
            tempInfo:textConfig.element_list
        };
        this.actions.noteEditText(textData,{
            handelSuccess:(res)=>{
                this.handelAlertMsg(false,'');
                this.handStore('editText',res.data.element_model,index)
            },
            handelError:(err)=>{
                this.handelAlertMsg(true,'文字保存中……');
            }
        });
    }

    /*修改封面版式*/
    layoutModification(data){
        this.handelAlertMsg(true,'样式更新中……');
        this.actions.tempDetail(data,{
            handelSuccess:(res)=>{
                this.handelAlertMsg(false,'');
                this.handStore('editTemp',res);
                this.setState({
                    listClose:false
                })
            },
            handelError:(err)=>{
                this.handelAlertMsg(true,'样式更新中……');
                this.setState({
                    listClose:true
                })
            }
        });
    }

    /*版式列表弹窗显示*/
    popupShow(flag){
        this.setState({
            listClose:flag
        })
    }

    /*修改内页插页样式*/
    insertEdit(data,num,page,id){
        this.setState({
            listClose:false
        });
        if(page == 0){
            this.handStore('editInsert',data,num,page,id);
        }else{
            this.handelAlertMsg(true,'样式更新中……');
            this.actions.noteEditText(data,{
                handelSuccess:(res)=>{
                    this.handelAlertMsg(false,'');
                    let info = res.data.element_model;
                    this.handStore('editInsert',info,num,page,id);
                },
                handelError:(err)=>{
                    this.handelAlertMsg(true,'样式更新中……');
                }
            });
        }
    }

    //弹框提示
    handelAlertMsg(type,msg){
        this.setState({
            showLoading:type,
            loadingMsg:msg
        });
    }

    /*上传图片*/
    handUploadImg(files,imageCFig,index,coverIndex,flag){
        if(files[0].type != 'image/jpeg' && files[0].type != 'image/jpg' && files[0].type != 'image/png'){
            this.handelAlertMsg(true,'上传图片只支持jpg或png格式！');
            return;
        }
        if (parseInt(files[0].size) > 10485760) {
            this.handelAlertMsg(true,'请选择小于10M图片！');
            return;
        }
        this.handelAlertMsg(true,'图片上传中……');
        this.actions.uploadImg({
            name: 'image',
            file: files[0],
            fields: [{name: 'type', value: 'albums'}]
        },{
            handSuc:(res)=>{
                let action = this.centerCutting(res.data,imageCFig,index,coverIndex);
                this.handStore('imgUpload',action,index,flag,coverIndex);
                this.handelAlertMsg(false,'');
            },handErr:(err)=>{
                this.handelAlertMsg(true,'图片上传失败，请重新上传！');
            }})
    }

    /*图片居中裁剪*/
    centerCutting (action,imageList) {
        var imgData = {
            image_url:action.url,
            image_width:action.width,
            image_height:action.height,
            image_orientation:action.rotate
        };
        var imgScale ;
        if(action.width > 4096 && action.height < 4096){
            imgScale = 4096 / action.width;
            imgData.image_width = 4096;
            imgData.image_height = action.height*imgScale;
        }
        if(action.width < 4096 && action.height > 4096){
            imgScale = 4096 / action.height;
            imgData.image_width = action.width*imgScale;
            imgData.image_height = 4096;
        }
        if(action.width > 4096 && action.height > 4096){
            if(action.width>action.height){
                imgScale = 4096 / action.width;
                imgData.image_width = 4096;
                imgData.image_height = action.height*imgScale;
            }else{
                imgScale = 4096 / action.height;
                imgData.image_width = action.width*imgScale;
                imgData.image_height = 4096;
            }
        }
        let imgWidth = imgData.image_width;
        let imgHeight = imgData.image_height;
        
        if(parseInt(imgData.image_orientation) == 8 || parseInt(imgData.image_orientation) == 6){
            imgWidth = imgData.image_height;
            imgHeight = imgData.image_width;
        }
        var scale;
        var feste = imgWidth / imgHeight;
        var cenWidth = imageList.element_width - (imageList.element_content_left + imageList.element_content_right);
        var cenHeight = imageList.element_height - (imageList.element_content_top + imageList.element_content_bottom);
        var hinten = cenWidth/cenHeight;
        if(feste < hinten){
            scale = cenWidth/imgWidth;
            var imgTop = (imgHeight * scale - cenHeight) /2;
            imgData.image_start_point_y = Math.floor(-imgTop);
            imgData.image_start_point_x = 0;
        }else{
            scale = cenHeight/imgHeight;
            var imgLeft = (imgWidth * scale - cenWidth) /2;
            imgData.image_start_point_x = Math.floor(-imgLeft);
            imgData.image_start_point_y = 0;
        }
        imgData.image_scale = scale.toFixed(4);

        return imgData;
    }

    //操作数据保存
    handStore(type,data,index,flag,coverIndex){
        switch (type){
            //更换文本内容
            case 'editText':
                this.actions.editNoteText(data,index,this.state.insertPage);
                break;
            //更换版式
            case 'editTemp':
                this.actions.replaceTemplate(data);
                break;
            //图片裁剪
            case 'crop':
                this.actions.noteImageCrop(data,index,flag,coverIndex);
                break;
            //图片替换
            case 'imgUpload':
                this.actions.noteImgUpload(data,index,flag,coverIndex);
                break;
            //设置插页
            case 'insertSet':
                this.actions.insertSet(data);
                break;
            //更换插页版式
            case 'editInsert':
                this.actions.replaceInsert(data,index,flag,this.props.insertPageListStore,coverIndex);
                break;
            case 'selectPaper':
                this.actions.selectPaper(data);
                break;
        }
    }

    render(){
        /*获取封面样式列表*/
        let noteTempListStore = this.props.noteTempListStore || [];
        /*获取插页样式列表*/
        let insertPageListStore = this.props.insertPageListStore || [];
        /*获取纸张列表*/
        let innerPageListStore = this.props.innerPageListStore || [];
        /*获取书本相应信息*/
        let initialTempDetailStore = this.props.initialTempDetailStore || {};
        /*获取页数*/
        let insertPageNumStore = this.props.insertPageNumStore || 0;

        return (
            <div className="noteEditBox">
                {/*头部进程标题*/}
                <NoteEditHead {...this.props}
                    actions={this.actions}
                    show={this.state.show}
                    showActive={this.showActive.bind(this)}
                />

                {/*中间展示部分*/}
                <NoteEditBody {...this.props}
                    actions={this.actions}
                    show={this.state.show}
                    listClose={this.state.listClose}
                    currentIndex={this.state.currentIndex}
                    proportion={this.state.proportion}
                    noteTempListStore={noteTempListStore}
                    insertPageListStore={insertPageListStore}
                    innerPageListStore={innerPageListStore}
                    initialTempDetailStore={initialTempDetailStore}
                    insertPageNumStore={insertPageNumStore}
                    popupShow={this.popupShow.bind(this)}
                    noteBookComplete={this.noteBookComplete.bind(this)}
                    showActive={this.showActive.bind(this)}
                    handEditTextDialog={this.handEditTextDialog.bind(this)}
                    layoutModification={this.layoutModification.bind(this)}
                    handStore={this.handStore.bind(this)}
                    handUploadImg={this.handUploadImg.bind(this)}
                    insertEdit={this.insertEdit.bind(this)}
                />

                {/*编辑文字*/}
                {this.state.textDialog ?
                    <EditTextDialog
                        textConfig={this.state.textConfig}
                        noteTextShow={"13"}
                        handelTextEdit={this.handelTextEdit.bind(this)}
                        closeTextDialog={this.closeTextDialog.bind(this)}
                    />: null
                }
                {/*弹窗*/}
                {this.state.showLoading ? <Loading msg={this.state.loadingMsg}
                                                   timeing={20000}
                                                   handelAlertMsg={this.handelAlertMsg.bind(this)} /> : null}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        noteTempListStore: state.noteTempListStore,
        insertPageListStore: state.insertPageListStore,
        innerPageListStore: state.innerPageListStore,
        initialTempDetailStore: state.initialTempDetailStore,
        insertPageNumStore: state.insertPageNumStore,
        noteSaveStore: state.noteSaveStore
    }
}
export default connect(mapStateToProps)(NoteEditPage)