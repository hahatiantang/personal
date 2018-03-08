/**
 * 文件说明:照片书上传
 * 详细描述:
 * 创建者: hxb
 * 创建时间: 2017/2/9
 * 变更记录:
 */
import React,{ PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';

import ProgressBar from './ProgressBar.jsx';
import * as photoBookAction from '../../redux/actions/photoBookAction.js';

import '../less/photoBookUpload.less';

class PhotoBookUpload extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            uploadLoad:true,
            showLoading:false
        };
        this.deletePhotoIds = [];
        this.actions = bindActionCreators(Object.assign({},photoBookAction),props.dispatch);
        // 尺寸处理
        this.clientWidth = document.documentElement.clientWidth;
        document.documentElement.style.fontSize = this.clientWidth / 7.5 + 'px';
        this.baseSize = this.clientWidth / 7.5;
    }

    render(){

        let commonUploadStore = this.props.commonUploadStore || {};
        let commonData = commonUploadStore.datas || [];

        let uploadedPhotoStore = this.props.uploadedPhotoStore || {};
        let uploadedData = uploadedPhotoStore.datas || [];

        this.mergeData = uploadedData.concat(commonData);

        this.totalLength = this.mergeData.length || 0;

        let ua = navigator.userAgent.toLowerCase();//获取判断用的对象
        let deviceMsg = /android/.test(ua); // false为iphone

        return(
            <div style={{paddingBottom:'0.01rem'}}>
                <div className="upload-layout">

                    <div className="upload-title">
                        选择成书的照片
                        <span className="upload-text">( 单次最多可选100张 )</span>
                    </div>
                    {
                        this.photoList(this.mergeData)
                    }
                    <div className="upload-add">
                        {
                            deviceMsg ? <input type="button" className="wx-input-file" onClick={this.wxChooseImage.bind(this)}/>
                                :<input type="file" multiple="multiple" className="input-file" onChange={this.beforeUpload.bind(this)}/>
                        }
                    </div>
                </div>
                <div className="makeBook" onClick={this.makeBook.bind(this)}>一键成书（已选照片{this.totalLength}张）</div>

                {
                    this.state.showLoading ? <div id="loadingToast" style={{'fontSize':'18px'}} className="weui_loading_toast">
                        <div className="weui_mask_transparent"></div>
                        <div className="weui_toast">
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
        )
    }

    componentDidMount(){

        /*微信*/
        wx.config({
            debug: false,
            appId: wxConfig.appId, // 必填，
            timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
            signature: wxConfig.signature,// 必填，签名
            jsApiList: ['previewImage','chooseImage','uploadImage'] // 必填，需要使用的JS接口列表
        });

        let bookInfo = this.props.bookInfoStore || {};
        let args = {
            uid:Cookies('tf-uid'),
            articleId:bookInfo.articleId,
            sort:0,
            type:1
        };
        this.actions.imglistAction(args,{
            handleSuccess:(res)=>{

            }
        },{
            handelError:(err)=>{

            }
        });

    }

    // 微信选择照片
    wxChooseImage(){

        let commonUploadStore = this.props.commonUploadStore || {};
        let unsavedPhotos = commonUploadStore.datas || [];
        let that = this;

        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res){
                that.wxlength = res.localIds.length;
                for(let i=0;i<that.wxlength;i++){
                    unsavedPhotos.push({
                        progressBar:1,
                        uploadtime:new Date().getTime() + parseInt((Math.random()*100000).toFixed(0))
                    });
                }

                that.globalI = 0;
                that.wxUpload(res,that.globalI);
            }
        });
    }

    // 微信上传
    wxUpload(res,index){
        let that = this;
        that.setState({
            uploadLoad:true
        });

        let currentLength = res.localIds.length;// 本次上传的数量
        wx.uploadImage({
            localId: res.localIds[index],
            isShowProgressTips: 0,
            success: function (result){

                that.actions.downloadPhotoAction({
                    picId:result.serverId
                },{
                    handleSuccess:(resp)=>{
                        let commonUploadData = (that.props.commonUploadStore || {}).datas||[];
                        let len = commonUploadData.length;
                        commonUploadData[len- currentLength + index].finish = 1;
                        ++index;
                        if(index < currentLength){
                            that.wxUpload(res,index);
                        }else{
                            // 上传结束
                        }
                    },
                    handelError:(err)=>{
                        let commonUploadData = (that.props.commonUploadStore || {}).datas||[];
                        let len = commonUploadData.length;
                        commonUploadData[len- currentLength + index].fail = 1;
                        ++index;
                        if(index < currentLength){
                            that.wxUpload(res,index);
                        }else{
                            this.setState({
                                uploadLoad:true
                            });
                            // 上传结束
                        }
                    }
                });
            }
        })
    }

    // 上传照片前处理
    beforeUpload(e){
        let files = e.target.files;

        // 已上传至阿里云未保存到数据库的数据
        let commonUploadStore = this.props.commonUploadStore || {};

        let restFiles = []; // 合格的file
        let sizeErrorNum = 0;
        let typeErrorNum = 0;

        // 获取符合要求的照片文件
        for(let j = 0;j<files.length;j++){
            if(parseInt(files[j].size) > 10485760){ //10M
                ++sizeErrorNum;
            }else if (files[j].type != 'image/jpeg' && files[j].type != 'image/png'){
                ++typeErrorNum;
            }else{
                restFiles.push(files[j]);
            }
        }

        // 生成占位图
        let unsavedPhotos = commonUploadStore.datas || [];
        let count = 0;

        for(let i=0;i<restFiles.length;i++){

            unsavedPhotos.push({
                progressBar:1,
                uploadtime:new Date().getTime() + parseInt((Math.random()*100000).toFixed(0))
            });
            ++count;
            if(count == restFiles.length){

                // 获取sts授权
                this.actions.getSignature({
                    handleSuccess:(res)=>{
                        this.signature = res;
                        this.uploadPhotos(restFiles,0);
                    }
                },{
                    handelError:(err)=>{
                        this.uploadPhotos(restFiles,0);
                    }
                });
            }
        }
    }

    // 上传照片
    uploadPhotos(files,startIndex){

        this.setState({
            uploadLoad:true
        });

        let currentLength = files.length;

        // 避免低于5张照片上传也会同时发5个并发请求
        let length = files.length > 4 ? 5 : files.length;
        let finishIndex = 0;  // 并发完成数量

        for(let i =0;i<length;i++){
            this.actions.uploadPhotosAction({
                name: 'image',
                file: files[startIndex+i],
                fields: [{name:'type',value:'times'}],
                signature:this.signature
            },{
                handleSuccess:(res)=>{
                    ++finishIndex;

                    let commonUploadData = (this.props.commonUploadStore || {}).datas||[];
                    let length = commonUploadData.length;

                    commonUploadData[length- currentLength + startIndex].finish = 1;
                    let fileLength = files.length > 100 ? 100 : files.length;

                    ++startIndex;
                    if (startIndex < fileLength && finishIndex == 5){
                        this.uploadPhotos(files,startIndex);
                    }else if(startIndex >= fileLength){
                        // 弹框提示错误图片数量
                    }
                }
            },{
                handelError:(err)=>{
                    ++finishIndex;

                    let commonUploadData = (this.props.commonUploadStore || {}).datas||[];
                    let length = commonUploadData.length;
                    commonUploadData[length- currentLength + startIndex].fail = 1;
                    commonUploadData[length- currentLength + startIndex].progressBar = 0;

                    ++startIndex;
                    let fileLength = files.length > 100 ? 100 : files.length;
                    if (startIndex < fileLength && finishIndex == 5){

                        this.uploadPhotos(files,startIndex);
                    }else if(startIndex >= fileLength){

                        this.setState({
                            uploadLoad:true
                        });

                        // 弹框提示错误图片数量
                    }
                }
            });
        }
    }

    // 照片列表
    photoList(photos){

        let width = parseInt(1.6 * this.baseSize);
        let height = parseInt(1.6 * this.baseSize);

        if(photos.length){
            let photoHtml = (photos || []).map((item,index)=>{

                return <div key={index}>

                    {/* 图片列表 */}
                    <div className="upload-image">
                        {item.url ? <img src={item.url + "@"+height+"h_"+width+"w_1e_1c_2o"} onClick={this.bigImage.bind(this,item.url)}/>:null}
                        {
                            item.fail || item.progressBar ?
                                <ProgressBar progressBar={item.progressBar} finish={item.finish} fail={item.fail}/> : null
                        }
                        {
                            item.progressBar ? null :
                                <img className="upload-delete" src={require("../images/upload_delete.png")} onClick={this.deleteImage.bind(this,item.id,index)}/>
                        }
                    </div>
                </div>
            });
            return photoHtml;
        }
    }

    // 查看大图
    bigImage(imageUrl){

        let urls = [];
        for(let item in this.mergeData){
            urls.push((this.mergeData)[item].url);
        }

        wx.previewImage({
            current: imageUrl,
            urls: urls
        });
    }
    
    // 一键成书
    makeBook(){

        this.setState({
            showLoading:true,
            loadingText:'正在保存中'
        });

        let commonUpload = this.props.commonUploadStore || {};
        let bookInfo = this.props.bookInfoStore || {};
        let args = {
            type:window.localStorage.type,
            binding:window.localStorage.binding,
            size:window.localStorage.size,
            images:JSON.stringify(commonUpload.datas),
            uid:Cookies('tf-uid'),
            ids:JSON.stringify(this.deletePhotoIds),
            bookId:bookInfo.bookId
        };
        this.actions.makeBook(args,{
            handleSuccess:(res)=>{
                this.setState({
                    showLoading:false
                });
                window.location.href = '/calendar/'+res.data+'/pod';
            }
        },{
            handelError:(err)=>{

            }
        });
    }

    // 照片删除
    deleteImage(id,index){
        let commonUpload = this.props.commonUploadStore || {};
        let newUploadData = commonUpload.datas || [];
        let uploadedPhotoData = (this.props.uploadedPhotoStore||{}).datas||[]; // 已保存照片
        let uploadedLength = uploadedPhotoData.length;
        if(id){
            let idObj = {id:0};
            uploadedPhotoData.map((item,index)=>{
                if(item.id == id){
                    idObj.id = id;
                    this.deletePhotoIds.push(idObj);
                    uploadedPhotoData.splice(index,1);
                }
            });
        }else{
            // 删除清理上传未保存数据
            newUploadData.splice(index-uploadedLength,1);
        }
        this.setState({
            uploadLoad:true
        });
    }
}

function mapStateToProps(state){
    return {
        commonUploadStore:state.commonUploadStore,
        uploadedPhotoStore:state.uploadedPhotoStore,
        bookInfoStore:state.bookInfoStore
    };
}

export default connect(mapStateToProps)(PhotoBookUpload);