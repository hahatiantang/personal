/**
 * 文件说明: 照片书编辑
 * 详细描述:
 * 创建者: 胡许彬
 * 创建时间: 2017/3/3
 * 变更记录:
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';

import EditBook from './editBook.jsx';
import EditText from './EditText.jsx';
import * as photoBookAction from '../../redux/actions/photoBookAction.js';

import '../less/photoBookEdit.less';

class PhotoBookEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex:0,
            textDialog:false,
            showLoading:false,
            loadingText:'',
            errorDialog:false,
            errorDialogText:''
        };
        this.actions = bindActionCreators(Object.assign({},photoBookAction),props.dispatch);
    }

    handStore(type,data,imageIndex){

        switch (type){

            //图片裁剪
            case 'crop':
                let cropData = {
                    data:data,
                    currentIndex:this.state.currentIndex,
                    imageIndex:imageIndex
                };
                this.actions.imageCrop(cropData);
                break;
        }

    }

    render(){

        let podCreateStore =  this.props.podInfoStore || {};
        let editStore = podCreateStore.content_list || [];
        this.restStore = [];

        editStore.map((item,index)=>{
            if(!(item.content_type == 3 || item.content_type == 6 || item.element_list.length == 0)){
                (this.restStore).push(item);
            }
        });

        // 当前页类型:扉页、内页
        this.currentContentType = (this.restStore[this.state.currentIndex] || []).content_type;

        let bookStyle = {
            book_width:podCreateStore.book_width,
            book_height:podCreateStore.book_height,
            content_width:podCreateStore.content_width,
            content_height:podCreateStore.content_height,
            content_padding_left:podCreateStore.content_padding_left,
            content_padding_top:podCreateStore.content_padding_top
        };

        return (
            <div className="editLayout">
                <div className="editBox">
                    <EditBook
                        pageStore={this.restStore[this.state.currentIndex]}
                        handUploadImg={this.handUploadImg.bind(this)}
                        currentIndex={this.state.currentIndex}
                        bookStyle={bookStyle}
                        handEditTextDialog={this.handEditTextDialog.bind(this)}
                        handStore={this.handStore.bind(this)}
                        bookType={podCreateStore.book_type}
                        bookSize={this.props.bookInfoStore.size}>
                    </EditBook>

                    {
                        this.state.textDialog ? <EditText
                            textConfig={this.state.textConfig}
                            handelTextEdit={this.handelTextEdit.bind(this)}
                            closeTextDialog={this.closeTextDialog.bind(this)} />: null
                    }

                    {
                        this.state.showLoading ? <div id="loadingToast" style={{'fontSize':'18px'}} className="weui_loading_toast">
                            <div className="weui_mask_transparent"></div>
                            <div className="weui_toast" style={{'zIndex':'20'}}>
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
                </div>

                <div className="editButton">
                    <div className="editBook" onClick={this.cancel.bind(this)}>取消</div>
                    <div className="pageShow">
                        <span id="currentPage">
                            {this.currentContentType==8 ? '扉页':(this.state.currentIndex + '/' +((this.restStore).length-1))}
                        </span>
                    </div>
                    <div className="publish" onClick={this.saveEdit.bind(this)}>保存</div>
                </div>

                {
                    this.state.errorDialog?
                        <div className="weui_dialog_alert" id="dialog2" style={{fontSize:'20px'}}>
                            <div className="weui_mask"></div>
                            <div className="weui_dialog">
                                <div className="weui_dialog_hd"><strong className="weui_dialog_title">提示</strong></div>
                                <div className="weui_dialog_bd">{this.state.errorDialogText}</div>
                                <div className="weui_dialog_ft">
                                    <a href="javascript:;" className="weui_btn_dialog primary" onClick={this.closeDialog.bind(this)}>确定</a>
                                </div>
                            </div>
                        </div>:null
                }
            </div>
        )
    }


    handEditTextDialog(txtConfig){
        this.setState({
            textConfig:txtConfig
        },()=>{
            this.setState({
                textDialog:true
            })
        })
    }

    componentDidMount(){

        let editBox = $(".calendar_min_box")[0];

        //滑动处理

        var startX, startY, moveEndX, moveEndY, X, Y;
        let that = this;

        let canMove = 1;
        editBox.addEventListener('touchstart', function(e) {
            //e.preventDefault();
            canMove = 1;
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        }, false);

        editBox.addEventListener('touchmove', function(e) {
            //e.preventDefault();
            moveEndX = e.changedTouches[0].pageX;
            moveEndY = e.changedTouches[0].pageY;
            X = moveEndX - startX;
            Y = moveEndY - startY;
            if ( Math.abs(X) > Math.abs(Y) && X > 10 ) {
                if(canMove){
                    canMove = 0;
                    that.handelLeftTight("left");
                }
            }else if ( Math.abs(X) > Math.abs(Y) && X < 0 && Math.abs(X) > 10) {
                if(canMove){
                    canMove = 0;
                    that.handelLeftTight("right");
                }
            }
        },false);

    }

    // 上一页 下一页
    handelLeftTight(flag){
        let index = this.state.currentIndex;
        if(flag == 'right'){
            if(index > this.restStore.length - 1){
                return false;
            }
            index = index + 1;
            this.setState({
                currentIndex:index
            });
        }else{
            if(index < 1){
                return false;
            }
            index = index - 1;
            this.setState({
                currentIndex:index
            });
        }
    }

    // 上传照片处理
    handUploadImg(files,imageCfig,index,coverIndex){

        if(files[0].type != 'image/jpeg' && files[0].type != 'image/jpg' && files[0].type != 'image/png'){
            this.setState({
                errorDialog:true,
                errorDialogText:'请上传jpg或png格式图片'
            });
            return;
        }

        if(parseInt(files[0].size) > 10485760){
            this.setState({
                errorDialog:true,
                errorDialogText:'请上传小于10M图片'
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
            changeData:[{pageIndex:coverIndex,coverIndex:index,type:'inner'}]
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
                    errorDialog:true,
                    errorDialogText:'当前网络不佳，请稍后重新上传'
                });
            }
        });
    }

    // 取消编辑
    cancel(){
        // pod信息
        let podInfoStore = this.props.podInfoStore || {};
        window.location.href = '/calendar/'+podInfoStore.book_id+'/pod';
    }

    // 保存
    saveEdit(){

        this.setState({
            showLoading:true,
            loadingText:'数据保存中'
        });

        // pod信息
        let podInfoStore =  this.props.podInfoStore || {};
        let bookInfoStroe = this.props.bookInfoStore || {};
        let data = {
            add_content_list:[],
            delete_content_ids:[],
            book_id:podInfoStore.book_id,
            edit_cover:false,
            accesstoken:bookInfoStroe.accesstoken,
            unionid:bookInfoStroe.unionid,
            content_list:podInfoStore.content_list
        };
        this.actions.saveEdit(data,{
            handleSuccess:(res)=>{

                let content_list = [];
                let elementObj = {};
                let resourceList = [];
                let imageContentExpand = {};
                let contentList = podInfoStore.content_list || [];
                contentList.map((list,index)=>{
                    (list.element_list||[]).map((item,idx)=>{
                        if(item.is_edited){
                            elementObj.re_sub_content_id = item.re_sub_content_id;
                            imageContentExpand = item.image_content_expand;
                            resourceList.push(imageContentExpand);
                            elementObj.resource_list = resourceList;
                            content_list.push(elementObj);
                        }
                    });
                });

                // elementObj.re_sub_content_id = podInfoStore.content_list[4].element_list[0].re_sub_content_id;
                // let imageContentExpand = podInfoStore.content_list[4].element_list[0].image_content_expand;
                // resourceList.push(imageContentExpand);
                // elementObj.resource_list = resourceList;
                // content_list.push(elementObj);

                // 同步到接口
                let changeData = {
                    uid:Cookies('tf-uid'),
                    content_list:JSON.stringify(content_list)
                };
                this.actions.podChangePic(changeData,{
                    handleSuccess:(res)=>{
                        this.setState({
                            showLoading:false
                        });
                        window.location.href = '/calendar/'+podInfoStore.book_id+'/pod';
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

    // 编辑文字
    handelTextEdit(textConfig,index){
        let podInfoStore =this.props.podInfoStore||{};

        let bookInfoStroe = this.props.bookInfoStore || {};
        let elementList = [];
        elementList.push(textConfig.element_list);
        index.coverIndex = this.state.currentIndex;

        let elementName = textConfig.element_list.element_name;

        (podInfoStore.content_list).map((list,idx)=>{
            if(list.content_type == 3){
                (list.element_list).map((item,id)=>{
                    if(item.element_name == elementName){
                        item.element_content = textConfig.element_list.element_content;
                        elementList.push(item);
                        index.coverPageIndex = idx;
                        index.elementId = id;
                    }
                });
            }
        });

        let textData = {
            id:podInfoStore.book_id,
            text:textConfig.element_list.element_content || '请输入文字',
            tempId:podInfoStore.template_id,
            tempInfo:elementList,
            accesstoken:bookInfoStroe.accesstoken,
            unionid:bookInfoStroe.unionid,
            indexs:index
        };
        this.actions.editText(textData,{
            handleSuccess:(res)=>{

                console.log(textConfig,'textConfig');

                this.setState({
                    editLoad:true
                });
            }
        },{
            handelError:(err)=>{

            }
        });
    }

    //关闭修改文字弹出层
    closeTextDialog(){
        this.setState({
            textDialog:false
        })
    }

    // 关闭弹框
    closeDialog(){
        this.setState({
            errorDialog:false
        });
    }

}

function mapStateToProps(state) {
    return {
        podInfoStore:state.podInfoStore,
        bookInfoStore:state.bookInfoStore
    }
}

export default connect(mapStateToProps)(PhotoBookEdit)