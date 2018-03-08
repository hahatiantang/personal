/**
 * 文件说明:记事本预览页
 * 详细描述:
 * 创建者: hzw
 * 创建时间: 2016/11/15
 * 变更记录:
 */

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import URL from 'url';
import Cookies from 'cookies-js';

import {noteBookPOD} from '../../redux/dao/noteDao.js';
import {addCart, calendarPay, printchoice, bookprice} from '../../redux/dao/dao.js';
import NotePreContent from './NotePreContent.jsx';
import NotePreviewBtn from  './NotePreviewBtn.jsx';
import NotePreviewMeToo from './notePreviewMeToo.jsx';
import NoteMask from './NoteMask.jsx';
import NotePrintDialog from './NotePrintDialog.jsx';
import '../less/notepreview.less';
import Loading from './Loading.jsx';

import CartDialog from './CartDialog.jsx';

class  NotePreviewPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            openDialog: false,
            openCreate: false,
            showMask: false,
            uid: Cookies('tf-uid'),  //用户id
            successCart: false,
            openLoad: false,
            bindNormal: 0,
            bindGood: 0,
            sizeSmall: 0,
            sizeBig: 0,
            bookPrice: 0,
            windowHeight: 0
        };
        this.size = 0;
        this.bookId = URL.parse(window.location.href, true).query.bookId || '';   //书的id
        this.queryObj = URL.parse(window.location.href, true).query || '';
        this.actions = bindActionCreators(Object.assign({noteBookPOD, addCart, calendarPay, printchoice, bookprice}), props.dispatch);
    }

    componentDidMount(){
        let notePodData = this.props.notePodData;
        let bookId = this.bookId;
        let imgurl = notePodData.book_cover;
        wx.config({
            debug: false,
            appId: wxConfig.appId,
            timestamp: wxConfig.timestamp,
            nonceStr: wxConfig.nonceStr,
            signature: wxConfig.signature,
            jsApiList: ['showOptionMenu','onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ','onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
            wx.showOptionMenu();
            var shareObj = {
                //title: notePodData.book_title,
                title: "我在时光流影，上传自己的照片就能生成专属个性笔记本，你也来试试吧！",
                desc: '我在时光流影，上传自己的照片就能生成专属个性笔记本，你也来试试吧！',
                link: location.href + '&share=1',
                imgUrl: imgurl
            };
            //分享给好友
            wx.onMenuShareAppMessage(shareObj);
            //分享到朋友圈
            wx.onMenuShareTimeline(shareObj);
            //分享到QQ
            wx.onMenuShareQQ(shareObj);
            // 分享到腾讯微博
            wx.onMenuShareWeibo(shareObj);
            //分享到QQ空间
            wx.onMenuShareQZone(shareObj);
        });

        this.setState({windowHeight: $("html,body").height()},function () {
            console.log(this.state.windowHeight)
        });
    }

    //打开分享
    showMask() {
        this.setState({
            showMask: true
        })
    }

    //关闭分享
    closeMask() {
        this.setState({
            showMask: false
        })
    }

    //关闭购买对话框
    closeDialog(){
        this.setState({
            openDialog: false
        });
    }

    //打开购买对话框
    openDialog(){
        var _this = this;
        this.setState({
            openLoad: true
        });
        console.log('click')
        this.actions.printchoice({bookId: _this.bookId,type:10},{
            handelSuccess: (res)=> {
              this.setState({
                    bindNormal: res.data.bind[0].id,   //获得裸线装订id
                    bindGood: res.data.bind[1].id,    //获取豪华装订id
                    sizeSmall: res.data.size[0].id,    //获取16k尺寸id
                    //sizeBig: res.data.size[1].id      //获取32k尺寸id
                }, ()=> {
                let data = {
                  type: 10,
                  split: 0,
                  bookId: _this.bookId+"",      //书本id
                  bind: _this.state.bindNormal, //默认传入书本为锁线裸装
                  size: _this.state.sizeSmall   //默认传入书本是16k尺寸
                };
                this.actions.bookprice(data,{
                  handelSuccess: (res)=> {
                    console.log("success",res.data, "获得默认商品单价(装订bindNormal,尺寸sizeSmall)");
                    _this.setState({
                      openDialog: true,
                      openLoad: false,
                      bookPrice: res.data       //获得商品单价
                    });
                  }
                },{
                  handelError: (err)=> {
                    console.log(err,"bookprice");
                  }
                });
              });


                /*$.ajax({                              //获取默认单价
                    url: "/tf/order/bookprice",
                    method: "post",
                    dataType: "json",
                    data: {
                        type: 10,
                        split: 0,
                        bookId: _this.bookId+"",      //书本id
                        bind: _this.state.bindNormal, //默认传入书本为锁线裸装
                        size: _this.state.sizeSmall   //默认传入书本是16k尺寸
                    },
                    //contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        _this.setState({
                            openDialog: true,
                            openLoad: false,
                            bookPrice: data.data       //获得商品单价
                        })
                    },
                    error: function (err) {
                        console.log(err,"err")
                        _this.setState({
                            openDialog: true,
                            openLoad: false
                        })
                    }
                });*/
            }
        },{
            handelError: (err)=> {
                console.log(err,"er")
            }
        })
    }

    //成功加入购物车弹窗
    succCart() {
        this.setState({
            successCart: true
        })
    }
    //关闭弹框
    handelClose(){
        this.setState({
            successCart: false
        })
    }

    render(){
        let notePodData = this.props.notePodData || {};
        let authorInfo = notePodData.author_info || {};
        let authorId = authorInfo.id;
        let uid = this.state.uid;
        let showBtn = true;
        let textCon = "成功加入印刷车";
        let textBtn = "去结算";
        let overflow = {
            height: this.state.windowHeight,
            overflow: "scroll"
        };


        if(uid == authorId && !this.queryObj.recommend){
            showBtn = true;
            console.log(this.queryObj.recommend,'this.queryObj.recommend333333')
        }else{
            showBtn = false;
        }
        return(
            <div className="podBook" style={this.state.openDialog ? overflow : null}>
                <NotePreContent {...this.props} />
        {showBtn ? <NotePreviewBtn showMask={this.showMask.bind(this)} openDialog={this.openDialog.bind(this)} bookId={this.bookId} /> : <NotePreviewMeToo />}
                {this.state.showMask ? <NoteMask closeMask={this.closeMask.bind(this)} /> : null}
                {this.state.openDialog ?    //底部购物框
                    <NotePrintDialog
                        {...this.props}
                        succCart={this.succCart.bind(this)}
                        bookId={this.bookId}
                        action={this.actions}
                        closeDialog={this.closeDialog.bind(this)}
                        bindNormal={this.state.bindNormal}
                        bindGood={this.state.bindGood}
                        sizeSmall={this.state.sizeSmall}
                        sizeBig={this.state.sizeSmall}
                        bookPrice={this.state.bookPrice}
                    />
                    : null}
                {this.state.successCart ?    //弹出框
                    <CartDialog
                        handelClose={this.handelClose.bind(this)}
                        textContent={textCon}
                        textBtn={textBtn}
                    />
                 : null}
                {this.state.openLoad ? <Loading /> : null}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        notePodData: state.notePodData
    }
}
export default connect(mapStateToProps)(NotePreviewPage)