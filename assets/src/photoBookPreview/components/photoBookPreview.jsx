/**
 * 文件说明: 照片书预览
 * 详细描述:
 * 创建者: 胡许彬
 * 创建时间: 2017/3/2
 * 变更记录:
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import URL from 'url';
import $ from 'jquery';
import '../js/main';

import OrderDialog from './orderDialog.jsx';
import EnsuDialog from './ensuDialog.jsx';
import * as photoBookAction from '../../redux/actions/photoBookAction.js';
import {addCart,calendarPay,judgeType} from '../../redux/dao/dao';

import '../less/photoBookPreview.less';
import '../less/base.min.css';
import splitLoad from '../images/ViewLoading.gif';

class PhotoBookPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionMenus:false,
            openPrint:false,
            openCart:false,
            splitImg: false
        };
        this.actions = bindActionCreators(Object.assign({addCart,calendarPay,judgeType},photoBookAction),props.dispatch);
        this.recommend = URL.parse(window.location.href, true).query.recommend || '';
    }

    render(){

        let podInfo = this.props.podInfoStore||{};
        let bookInfo = this.props.bookInfoStore||{};
        let bookPrice = this.props.bookPriceStore||{};
        let size = bookInfo.size; //尺寸
        let creator = bookInfo.creator || {};

        return (
            <div>
                <div id="main" style={{'marginTop':size==228 ?'0':'1rem'}}>
                    <div className="pageList"></div>
                </div>
                {creator.uid == bookInfo['tf-uid']?
                <div className={this.state.actionMenus || this.recommend==1 ? "closeFg" : "editButton"}>
                    <div className="editBook" onClick={e=>this.setState({actionMenus:true})}>编辑</div>
                    <div className="pageShow"><span id="currentPage">0</span>/{podInfo.book_total_page - 1}</div>
                    <div className="publish" onClick={this.publishBook.bind(this)}>印刷</div>
                </div>
                :null}
                <div id="actionSheet_wrap" className={this.state.actionMenus ? 'openFg':'closeFg'}>
                    <div className="weui_mask_transition weui_fade_toggle" id="mask" style={{display:'block',zIndex:'10'}}></div>
                    <div className="weui_actionsheet weui_actionsheet_toggle" id="weui_actionsheet" style={{zIndex:'20'}}>
                        <div className="weui_actionsheet_menu">
                            <div className="weui_actionsheet_cell" onClick={this.editOptions.bind(this,0)}>更换主题</div>
                            <div className="weui_actionsheet_cell" onClick={this.editOptions.bind(this,1)}>增删照片</div>
                            <div className="weui_actionsheet_cell" onClick={this.editOptions.bind(this,2)}>编辑封面</div>
                            <div className="weui_actionsheet_cell" onClick={this.editOptions.bind(this,3)}>编辑内页</div>
                            <div className="weui_actionsheet_cell" onClick={this.editOptions.bind(this,4)}>返回书架</div>
                        </div>
                        <div className="weui_actionsheet_action">
                            <div className="weui_actionsheet_cell" id="actionsheet_cancel" onClick={e=>this.setState({actionMenus:false})}>取消</div>
                        </div>
                    </div>
                </div>

                {this.state.openPrint ?
                    <OrderDialog
                        handelPrint={this.handelPrint.bind(this)}
                        handelAddCart={this.handelAddCart.bind(this)}
                        handelPay={this.handelPay.bind(this)}
                        podStore={podInfo}
                        bookPriceStore={bookPrice}
                    />: null}

                {this.state.openCart ?
                    <EnsuDialog
                        handelClose={this.handelClose.bind(this)}
                        textContent={this.state.textContent}
                        textBtn={this.state.textBtn}
                    /> : null}
                {this.state.splitImg ?
                  <div className="splitImg"><img src={splitLoad} /></div>
                :null}
            </div>
        );
    }

    componentDidMount() {

        let bookInfo = this.props.bookInfoStore || {};
        let podInfo = this.props.podInfoStore ||{};

        if (podInfo.book_height < 700) {
            $(".pageList").css("bottom", "30%");
        } else {
            if ($(window).height() < 500) {
                $(".pageList").css({bottom: "0", height: $(window).height()});
            } else {
                $(".pageList").css("bottom", "5%");
            }
        }

        window.fb = new Timeface.FlipBook({
            container: '.pageList',//容器名
            width: podInfo.book_width,//书本单页宽度
            height: podInfo.book_height, //书本单页高度
            isSinglePage: 'auto', //是否单页显示 true, false or auto
            ratioWidth: 1,
            ratioHeight: 1,
            editUrl: '',
            startIndex: podInfo.content_start_index,
            bookId: bookInfo.bookId,
            startKeyboard: true, //是否启动键盘左右键翻页
            zoomScale: 1,
            currentPageIndex: 5,
            allPageCount: podInfo.content_list.length || 0,
            podData: podInfo.content_list || [],
            onInitComplete: function () {

            },
            onFlipEndPage: function () {

            }
        });

        let priceArgs = {
            uid:Cookies('tf-uid'),
            bookId:bookInfo.uid,
            bind:bookInfo.binding,
            size:bookInfo.size,
            paper:bookInfo.paper
        };
        this.actions.getBookPrice(priceArgs,{
            handleSuccess:(res)=>{

            }
        },{
            handelError:(err)=>{

            }
        });

    }

    // 编辑操作
    editOptions(type){

        let podInfo = this.props.podInfoStore || {};
        let bookId = podInfo.book_id;

        let href = "";
        switch(type){
            case 0 :
                href = '/calendar/photoBookTheme?bookId='+bookId;
                break;
            case 1:
                href = '/calendar/photoBookUpload?bookId='+bookId;
                break;
            case 2:
                href = '/calendar/coverEdit?bookId='+bookId;
                break;
            case 3:
                href = '/calendar/'+bookId+'/photoBookEdit';
                break;
            case 4:
                href = '/mybookshelf'; // 返回书架
        }
        window.location.href = href;
        this.setState({
            actionMenus:false
        });
    }

    // 印刷
    publishBook(){
        this.setState({
            openPrint:true
        });
    }

    //关闭弹框
    handelClose(){
        this.setState({
            openCart:false
        })
    }

    // 申请印刷
    handelPrint(flag){
        this.setState({
            openPrint:flag
        })
    }

    // 加入印刷车
    handelAddCart(num){
        let bookInfoStore = this.props.bookInfoStore || {};
        let binding = bookInfoStore.binding || [];
        let paper = bookInfoStore.paper || [];
        let size = bookInfoStore.size || [];
        let that = this;
        that.setState({
            splitImg: true
        });
        this.actions.splitBookAction({'bookUid':bookInfoStore.uid,'uid':bookInfoStore['tf-uid']},{
            handleSuccess: ()=> {
                let data = {
                    bookId:bookInfoStore.uid,
                    type: 11,
                    bind: binding,
                    color: 1,
                    paper:paper,
                    size: size,
                    count:num || 1
                };
                that.setState({
                    splitImg: false
                });
                this.actions.addCart(data,{
                    handelSuccess: ()=> {
                        this.setState({
                            openCart:true,
                            textContent:'成功加入印刷车',
                            textBtn:'去结算'
                        })
                    }
                },{
                    handelError: ()=> {
                        this.setState({
                            openCart:true,
                            textContent:'您的印刷车已满,请去清理一下',
                            textBtn:'去清理'
                        })
                    }
                })
            }
        },{
            handelError: (err)=> {
                that.setState({
                    splitImg: false
                });
                this.setState({
                    openCart:true,
                    textContent:err.data,
                    textBtn:'去清理'
                })
            }
        })
    }

    // 立即购买
    handelPay(num){

        let bookInfoStore = this.props.bookInfoStore || {};

        let binding = bookInfoStore.binding || [];
        let paper = bookInfoStore.paper || [];
        let size = bookInfoStore.size || [];

        let data = {
            bookId: bookInfoStore.uid,
            type: 11,
            from:3,
            bind: binding,
            color: 1,
            paper:paper,
            size: size,
            count: num || 1
        };
        let that = this;
        this.actions.calendarPay(data,{
            handelSuccess: (res)=> {
                let uid = Cookies('tf-uid');
                let localUrl = '';
                if (/wechat\.timeface/.test(location.href)) {
                    localUrl = "http://m.timeface.cn";
                } else{
                    localUrl = "http://h5.stg1.v5time.net";
                }
                that.actions.judgeType({orderId:res.data},{
                    handelSuc:(result)=>{
                        if(result.data == 1){
                            location.href = localUrl+'/orderService/'+uid+'/radioOrder/'+res.data+'?from=3'
                        }else{
                            location.href = localUrl+'/orderService/'+uid+'/confirm_order/'+res.data+'?from=3'
                        }
                    }
                },{
                    handelErr:()=>{
                        this.handelAlertMsg(true,'购买失败')
                    }
                });
            }
        },{
            handelError: ()=> {
                this.handelAlertMsg(true,'购买失败')
            }
        })

    }
}

function mapStateToProps(state) {
    return {
        podInfoStore:state.podInfoStore,
        bookInfoStore:state.bookInfoStore,
        bookPriceStore:state.bookPriceStore
    }
}

export default connect(mapStateToProps)(PhotoBookPreview)