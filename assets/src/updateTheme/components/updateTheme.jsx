/**
 * 文件说明:更换主题
 * 详细描述:
 * 创建者: 胡许彬
 * 创建时间: 2017/2/23
 * 变更记录:
 */
import React from 'react';
import Slick from 'react-slick';


import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as photoBookAction from '../../redux/actions/photoBookAction.js';


import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '../less/updateTheme.less';


class UpdateTheme extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex:0,
            dialogFlag:0,
            showLoading:false
        };
        this.themeInfinite = true;
        this.themeSwipe = true;
        this.actions = bindActionCreators(Object.assign({},photoBookAction),props.dispatch);
    }

    render(){

        let themeListLength = ((this.props.themeListStore||{}).datas||[]).length;
        if(themeListLength < 3){
            this.themeInfinite = false;
            this.themeSwipe = false;
        }else{
            this.themeInfinite = true;
            this.themeSwipe = true;
        }

        let singleThemeConfig = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows:false
        };

        let themeListConfig = {
            dots: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows:false,
            infinite:this.themeInfinite,
            swipe:this.themeSwipe,
            className:'themeListSlick'
        };

        let themeDetailData = (this.props.themeDetailStore||{}).datas||[];
        let themeDetailLength = themeDetailData.length;

        // 书信息
        let bookData = this.props.bookInfoStore||{};
        let bookSize = bookData.size||0;

        console.log('size='+bookSize);


        return (
            <div>

                <Slick {...singleThemeConfig}>
                    {
                        themeDetailLength > 0 ?

                            ((this.props.themeDetailStore||{}).datas||[]).map((item,index) =>
                                <div key={index} className="themeDetail">
                                    <img className="singleThemeImg" src={item}/>
                                </div>
                            ):<div></div>
                    }
                </Slick>

                <div className="selectThemeText">选择主题</div>

                <Slick {...themeListConfig}>
                    {
                        themeListLength > 0 ?

                        ((this.props.themeListStore||{}).datas||[]).map((item,index) =>
                            <div key={index} className="themeList" onClick={this.selectTheme.bind(this,index,item.id)}>

                                <img className="themeListImg" src={item.url}/>

                                <div className={this.state.selectIndex==index? bookSize == '228'?"weui_mask selectBgBig16":"weui_mask selectBg":"notSelected"}>
                                    <i className="weui_icon_success selectIcon"></i>
                                </div>
                            </div>
                        ):<div></div>
                    }
                </Slick>

                <div className="themeButton">
                    <div className="cancelButton" onClick={this.cancel.bind(this)}>取消</div>
                    <div className="sureButton" onClick={this.openTip.bind(this)}>确定</div>
                </div>

                <div className={this.state.dialogFlag?"weui_dialog":"dialogNone"} style={{fontSize:'0.35rem'}}>
                    <div className="weui_dialog_hd"><strong className="weui_dialog_title">提示</strong></div>
                    <div className="weui_dialog_bd">更换主题后，当前主题的图片会重新排版，请谨慎选择！</div>
                    <div className="weui_dialog_ft">
                        <a href="javascript:;" className="weui_btn_dialog default" onClick={this.updateTheme.bind(this,0)}>取消</a>
                        <a href="javascript:;" className="weui_btn_dialog primary" onClick={this.updateTheme.bind(this,1)}>确定</a>
                    </div>
                </div>

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
                            <p className="weui_toast_content">更换主题中</p>
                        </div>
                    </div>:null
                }

            </div>
        );

    }

    componentDidMount() {

        // 书信息
        let bookData = this.props.bookInfoStore||{};
        let args = {
            type:bookData.type,
            size:bookData.size,
            uid:bookData.uid
        };
        this.actions.getThemeList(args,{
            handleSuccess:(res)=>{

                this.themeId = res.data.datas[0].id;
                let args2 = {
                    uid : Cookies('tf-uid'),
                    id:this.themeId
                };
                this.actions.getThemeDetail(args2,{
                    handleSuccess:(res)=>{
                        console.log(res,'5555555555');
                    }
                },{
                    handleError:()=>{

                    }
                });
            }
        },{
            handleError:(err)=>{

            }
        });
    }


    // 选择主题
    selectTheme(index,themeId){
        this.setState({
            selectIndex:index
        });

        let args = {
            uid : Cookies('tf-uid'),
            id:themeId
        };
        this.actions.getThemeDetail(args,{
            handleSuccess:(res)=>{
                this.themeId = themeId;
            }
        },{
            handleError:()=>{

            }
        });
    }

    // 更换主题
    updateTheme(flag){
        this.setState({
            dialogFlag:false
        });
        let bookInfoStore = this.props.bookInfoStore || {};
        let bookId = bookInfoStore.bookId;
        let args = {
            uid : Cookies('tf-uid'),
            themeId:this.themeId,
            podId:bookId
        };
        if(flag){
            this.setState({
                showLoading:true
            });
            this.actions.updateTheme(args,{
                handleSuccess:(res)=>{
                    this.setState({
                        showLoading:false
                    });
                    window.location.href = "/calendar/"+bookId+"/pod";
                }
            },{
                handleError:()=>{
                }
            });
        }
    }

    // 打开弹框
    openTip(){
        this.setState({
            dialogFlag:true
        });
    }

    // 取消
    cancel(){
        let bookInfoStore = this.props.bookInfoStore || {};
        let bookId = bookInfoStore.bookId;
        window.location.href = "/calendar/"+bookId+"/pod";
    }
}

function mapStateToProps(state) {
    return {
        themeListStore:state.themeListStore,
        themeDetailStore:state.themeDetailStore,
        bookInfoStore:state.bookInfoStore
    };
}

export default connect(mapStateToProps)(UpdateTheme)