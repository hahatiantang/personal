/**
 * 文件说明: 封面封底编辑
 * 详细描述:
 * 创建者: 胡许彬
 * 创建时间: 2017/3/9
 * 变更记录:
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as photoBookAction from '../../redux/actions/photoBookAction.js';

import CoverDetail from './coverDetail.jsx';


import '../less/coverEdit.less';

class CoverEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCover:true,  // 是否在封面页
            actionMenus:false,
            showLoading:false,
            weuiDialog:false
        };
        this.actions = bindActionCreators(Object.assign({},photoBookAction),props.dispatch);
    }

    render(){

        let podInfo = this.props.podInfoStore || {};
        let contentType = this.state.isCover?3:6;

        // 封面 content_type == 3
        let coverStore = podInfo.content_list || [];
        coverStore.map((item,index)=>{
            if(item.content_type == contentType){
                this.pageIndex = index;
            }
        });

        let bookStyle = {
            book_width:podInfo.book_width,
            book_height:podInfo.book_height,
            content_width:podInfo.content_width,
            content_height:podInfo.content_height,
            content_padding_left:podInfo.content_padding_left,
            content_padding_top:podInfo.content_padding_top
        };

        return (
            <div>

                <div className="coverLayout">
                    <div className={this.state.isCover ? "coverEdit coverBg":"coverEdit"} onClick={this.selectCover.bind(this,true)}>封面</div>
                    <div className={this.state.isCover ? "backCoverEdit":"backCoverEdit coverBg"} onClick={this.selectCover.bind(this,false)}>封底</div>
                </div>

                <div>
                    <CoverDetail
                        pageStore={coverStore[this.pageIndex]}
                        handUploadImg={this.handUploadImg.bind(this)}
                        currentIndex={0}
                        bookStyle={bookStyle}
                        handEditTextDialog={this.handEditTextDialog.bind(this)}
                        handStore={this.handStore.bind(this)}
                        bookType={podInfo.book_type}
                        bookSize={this.props.bookInfoStore.size}
                        theme={this.props.bookInfoStore.theme}>
                    </CoverDetail>
                </div>

                <div className="editMsg" onClick={this.openEditMsg.bind(this)}>
                    编辑书本信息(必填) <span style={{marginLeft:'3.5rem'}}> > </span>
                </div>

                <div style={{height:'1.4rem'}}></div>

                <div className="editButton">
                    <div className="editBook" onClick={this.cancel.bind(this)}>取消</div>
                    <div className="publish" onClick={this.saveEdit.bind(this)}>确定</div>
                </div>

                <div id="actionSheet_wrap" className={this.state.actionMenus ? 'openFg':'closeFg'}>
                    <div className="weui_mask_transition weui_fade_toggle" id="mask" style={{display:'block',zIndex:'25'}}></div>
                    <div className="weui_actionsheet weui_actionsheet_toggle" id="weui_actionsheet" style={{zIndex:'25'}}>
                        <div className="editPhotoMsg">编辑图书信息</div>
                        <input type="text" ref="bookName" placeholder="输入书名" className="bookNameMsg"/>
                        <input type="text" ref="authorName" placeholder="输入作者名(选填)" className="bookNameMsg"/>
                        <div className="editSure" onClick={this.finishEditMsg.bind(this)}>确定</div>
                    </div>
                </div>

                {
                    this.state.showLoading ? <div id="loadingToast" style={{'fontSize':'18px'}} className="weui_loading_toast">
                        <div className="weui_mask_transparent"></div>
                        <div className="weui_toast" style={{zIndex:20}}>
                            <div className="weui_loading">
                                <div className="weui_loading_leaf weui_loading_leaf_0"></div>
                                <div className="weui_loading_leaf weui_loading_leaf_1"></div>
                                <div className="weui_loading_leaf weui_loading_leaf_2"></div>
                                <div className="weui_loading_leaf weui_loading_leaf_3"></div>
                                <div className="weui_loading_leaf weui_loading_leaf_4"></div>
                                <div className="weui_loading_leaf weui_loading_leaf_5"></div>
                                <div className="weui_loading_leaf weui_loading_leaf_6"></div>
                                <div className="weui_loading_leaf weui_loading_leaf_7"></div>
                                <div className="weui_loading_leaf weui_loading_leaf_8"></div>
                                <div className="weui_loading_leaf weui_loading_leaf_9"></div>
                                <div className="weui_loading_leaf weui_loading_leaf_10"></div>
                                <div className="weui_loading_leaf weui_loading_leaf_11"></div>
                            </div>
                            <p className="weui_toast_content">{this.state.loadingText}</p>
                        </div>
                    </div>:null
                }

                {
                    this.state.weuiDialog ?
                        <div className="weui_dialog_alert" id="dialog2">
                            <div className="weui_mask" style={{'zIndex':20}}></div>
                            <div className="weui_dialog" style={{'zIndex':26,'fontSize':'20px'}}>
                                <div className="weui_dialog_hd"><strong className="weui_dialog_title">提示</strong></div>
                                <div className="weui_dialog_bd">{this.state.weuiDialogText}</div>
                                <div className="weui_dialog_ft">
                                    <a href="javascript:;" className="weui_btn_dialog primary" onClick={this.closeDialog.bind(this)}>确定</a>
                                </div>
                            </div>
                        </div>:null
                }

            </div>
        );
    }

    // 上传照片
    handUploadImg(files,imageCfig,index,coverIndex){

        if(files[0].type != 'image/jpeg' && files[0].type != 'image/jpg' && files[0].type != 'image/png'){
            this.setState({
                weuiDialog:true,
                weuiDialogText:'请上传jpg或png格式图片'
            });
            return;
        }

        if(parseInt(files[0].size) > 10485760){
            this.setState({
                weuiDialog:true,
                weuiDialogText:'请上传小于10M图片'
            });
            return;
        }

        this.setState({
            showLoading:true,
            loadingText:'上传中'
        });

        this.actions.uploadSinglePhoto({
            name: 'image',
            file: files[0],
            fields: [{name:'type',value:'times'}],
            changeData:[{pageIndex:this.pageIndex,coverIndex:index}]
        },{
            handleSuccess:(res)=>{
                this.setState({
                    showLoading:false
                });
            }
        },{
            handelError:(err)=>{
                this.setState({
                    showLoading:false,
                    weuiDialog:true,
                    weuiDialogText:'当前网络不佳，请稍后重新上传'
                });
            }
        });

    }

    handEditTextDialog(){}

    handStore(){}

    // 完成书名、书作者编辑
    finishEditMsg(){
        let bookName = this.refs.bookName.value;

        if(!(bookName).trim()){
            this.setState({
                actionMenus:false,
                weuiDialog:true,
                weuiDialogText:'请先填写书名'
            });
        }else{

            this.setState({
                actionMenus:false
            });

            let authorName = this.refs.authorName.value;
            let podInfo = this.props.podInfoStore || {};



            let contentList = podInfo.content_list || [];

            contentList.map((list,index)=>{
                if(list.content_type == 3){

                    this.coverPageIndex = index;

                    let elementList = list.element_list || [];
                    elementList.map((item,idx)=>{
                        if(item.element_name == "bookname"){
                            this.nameIndex = idx;
                            item.element_content = bookName;
                            //item.text_content_expand.text_content = this.bookName;
                        }else if(item.element_name == "bookauthor"){
                            this.authorIndex = idx;
                            item.element_content = authorName;
                            //item.text_content_expand.text_content = this.authorName;
                        }
                    });
                }else if(list.content_type == 8 && list.element_list.length > 0){

                    // 扉页
                    this.titlePageIndex = index;
                    let elementList = list.element_list || [];
                    elementList.map((item,idx)=>{
                        if(item.element_name == "bookname"){
                            this.titlePageName = idx;
                            item.element_content = bookName;
                        }else if(item.element_name == "bookauthor"){
                            this.titlePageAuthor = idx;
                            item.element_content = authorName;
                        }
                    });
                }
            });

            let bookInfo = this.props.bookInfoStore || {};
            let accessToken = bookInfo.accesstoken;
            let unionid = bookInfo.unionid;

            let elementArray = [];
            // 封面
            elementArray.push(contentList[this.coverPageIndex].element_list[this.nameIndex]);

            // 封面可能没有作者 如毕业纪念册某主题
            if(this.authorIndex){
                elementArray.push(contentList[this.coverPageIndex].element_list[this.authorIndex]);
            }

            // 扉页
            elementArray.push(contentList[this.titlePageIndex].element_list[this.titlePageName]);
            // 可能没有作者
            if(this.titlePageAuthor){
                elementArray.push(contentList[this.titlePageIndex].element_list[this.titlePageAuthor]);
            }

            let args = {
                element_list:elementArray,
                accesstoken:accessToken,
                unionid:unionid,
                indexs:{
                    coverPageIndex:this.coverPageIndex,
                    nameIndex:this.nameIndex,
                    authorIndex:this.authorIndex,
                    titlePageIndex:this.titlePageIndex,
                    titlePageName:this.titlePageName,
                    titlePageAuthor:this.titlePageAuthor
                }
            };
            this.actions.editTextlist(args,{
                handleSuccess:(res)=>{
                    // loading消失
                    this.setState({
                        showLoading:false
                    });
                }
            },{
                handelError:(err)=>{

                }
            });
        }
    }

    // 打开标题作者编辑
    openEditMsg(){
        let podInfo = this.props.podInfoStore || {};
        let coverStore = podInfo.content_list || [];
        (coverStore[0].element_list).map((item,index)=>{
            if(item.element_name == "bookname"){
                this.refs.bookName.value = item.element_content;
            }else if(item.element_name == "bookauthor"){
                this.refs.authorName.value = item.element_content;
            }
        });
        this.setState({
            actionMenus:true
        })
    }

    closeDialog(){
        this.setState({
            weuiDialog:false
        })
    }

    // 切换封面封底
    selectCover(flag){
        this.setState({
            isCover:flag
        });
    }


    // 取消编辑
    cancel(){
        let podInfo = this.props.podInfoStore || {};
        window.location.href = '/calendar/'+podInfo.book_id+'/pod';
    }

    // 保存编辑
    saveEdit(){

        this.setState({
            showLoading:true,
            loadingText:'数据保存中'
        });

        let podInfo = this.props.podInfoStore || {};
        let contentList = podInfo.content_list || [];
        contentList.map((list,index)=>{
            if(list.content_type == 3){
                this.coverContentIndex = index;
            }else if(list.content_type == 6){
                this.backCoverContentIndex = index;
            }else if(list.content_type == 8 && list.element_list.length > 0){
                this.titlePageContentIndex = index;
            }
        });

        let bookInfo = this.props.bookInfoStore || {};
        let accessToken = bookInfo.accesstoken;
        let unionid = bookInfo.unionid;
        let bookId = bookInfo.bookId;
        let editList = [];
        editList.push(contentList[this.coverContentIndex]);
        editList.push(contentList[this.backCoverContentIndex]);
        editList.push(contentList[this.titlePageContentIndex]); // 扉页

        let args = {
            add_content_list:[],
            book_id:bookId,
            content_list:editList,
            delete_content_ids:[],
            edit_cover:true,
            accesstoken:accessToken,
            unionid:unionid
        };
        this.actions.saveEdit(args,{
            handleSuccess:(res)=>{
                let bookName = bookInfo.name;
                let bookAuthor = bookInfo.creator.nickname;
                // 同步到接口
                let changeData = {
                    uid:Cookies('tf-uid'),
                    book_title:this.refs.bookName.value || bookName,
                    book_auth:this.refs.authorName.value || bookAuthor,
                    book_id:bookId,
                    book_cover:res.data.book_cover[0]
                };
                this.actions.editCover(changeData,{
                    handleSuccess:(res)=>{
                        this.setState({
                            showLoading:false
                        });
                        window.location.href = '/calendar/'+bookId+'/pod';
                    }
                },{
                    handelError:(err)=>{
                    }
                });
            }
        },{
            handelError:(err)=>{

            }
        });

    }

}

function mapStateToProps(state) {
    return {
        podInfoStore:state.podInfoStore,
        bookInfoStore:state.bookInfoStore
    }
}

export default connect(mapStateToProps)(CoverEdit)