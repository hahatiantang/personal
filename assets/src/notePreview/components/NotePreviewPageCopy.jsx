/**
 * 文件说明:记事本预览页
 * 详细描述:
 * 创建者: hzw
 * 创建时间: 2016/11/15
 * 变更记录:
 */

import React from 'react';
import {connect} from 'react-redux';
import URL from 'url';
import Cookies from 'cookies-js';

import '../less/notepreview.less';
import NotePreviewBtn from './NotePreviewBtn.jsx';
import NotePreviewMeToo from  './NotePreviewMeToo.jsx';
import NoteMask from './NoteMask.jsx';
import NotePageCon from './NotePageCon.jsx'


class  NotePreviewPageCopy extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            initPage: "封面",
            curPage: 1,
            showMask: false,
        };
        this.bookId = URL.parse(window.location.href, true).query.bookId || '';
        this.nextCount = 1;
        this.prevCount = 1;
    }


    componentDidMount(){
        let notePodData = this.props.notePodData;
        //微信分享
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: wxConfig.appId, // 必填，公众号的唯一标识
            timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
            signature: wxConfig.signature,// 必填，签名，见附录1
            jsApiList: ['showOptionMenu','onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ','onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
            wx.showOptionMenu();
            var shareObj = {
                title: notePodData.book_title,
                desc: '我在时光流影，上传自己的照片就能生成专属个性笔记本，你也来试试吧！',
                link: location.href,
                imgUrl: notePodData.book_cover,
                fail: function (err) {
                    console.log(err)
                }
            };
            //分享给好友
            wx.onMenuShareAppMessage(shareObj);
            //分享到朋友圈
            wx.onMenuShareTimeline(shareObj);
        });

        //初始化页数显示
        $(".preNum").html("封面");
    }

    //插页无和插页在前面的时候下翻页
    noInsertPageNext() {
        let notePodData = this.props.notePodData;
        let booklen = notePodData.content_list.length;

        this.nextCount = this.nextCount + 1;

        if( this.nextCount > booklen ){
            return;
        }

        let $curPage = $(".page").filter(function () {  //找到当前页
            return $(this).attr("data-tag") == "tag";
        });

        $curPage.next().show().siblings().hide();  //当前页下一页显示，其他的隐藏

        if( $curPage.next().attr("data-book") === "封面" ){ //如果是封面页，下标显示"封面",否则显示页数
            $(".preNum").html("封面");

        }else if( $curPage.next().attr("data-book") === "封底" ){
            $(".preNum").html("封底");

        }else{
            $(".preNum").html( String($curPage.next().attr("data-index")) + "/" + String(booklen-4) );
        }

        $curPage.removeAttr("data-tag").next().attr("data-tag", "tag"); //最后把当前页标志改为最新的页
    }

    //插页无和插页在前面的时候上翻页
    noInsertPagePrev() {
        let notePodData = this.props.notePodData;
        let booklen = notePodData.content_list.length;

        this.nextCount = this.nextCount - 1;

        if( this.nextCount < 1 ){
            return;
        }

        let $curPage = $(".page").filter(function () {  //找到当前页
            return $(this).attr("data-tag") == "tag";
        });

        $curPage.prev().show().siblings().hide();  //当前页下一页显示，其他的隐藏

        if( $curPage.prev().attr("data-book") === "封面" ){ //如果是封面页，下标显示"封面",否则显示页数
            $(".preNum").html("封面");

        }else if( $curPage.prev().attr("data-book") === "封底" ){
            $(".preNum").html("封底");

        }else{
            $(".preNum").html( String($curPage.prev().attr("data-index")) + "/" + String(booklen-4));
        }

        $curPage.removeAttr("data-tag").prev().attr("data-tag", "tag"); //最后把当前页标志改为最新的页
    }

    //插页穿插的时下翻页
    interweavePageNext() {
        let notePodData = this.props.notePodData;
        let booklen = notePodData.content_list.length;

        if( this.nextCount > booklen ){
            return;
        }

        let $curPage = $(".page").filter(function () {  //找到当前页
            return $(this).attr("data-tag") == "tag";
        });

        $curPage.nextAll().show().siblings().hide();  //当前页下一页显示，其他的隐藏

    }


    //页数下翻
    nextPage () {
        let notePodData = this.props.notePodData;
        if( notePodData.insert_type === 0 ){    //无插页的情况
            this.noInsertPageNext();
        }else if( notePodData.insert_type === 1 ){   //插页在前面的情况
            this.noInsertPageNext();
        }else if( notePodData.insert_type === 2 ){  //插页穿插的情况

        }
    }

    //页数上翻
    prevPage () {
        let notePodData = this.props.notePodData;
        if( notePodData.insert_type === 0 ){    //无插页的情况
            this.noInsertPagePrev();
        }else if( notePodData.insert_type === 1 ){   //插页在前面的情况
            this.noInsertPagePrev();
        }else if( notePodData.insert_type === 2 ){  //插页穿插的情况

        }
    }

    //打开遮罩
    openMask() {
        this.setState({
            showMask: true
        })
    }

    //关闭遮罩
    closeMask() {
        this.setState({
            showMask: false
        })
    }

    render(){
        let notePodData = this.props.notePodData || {};
        let bookTotalPage = notePodData.content_page;
        let contentList = notePodData.content_list;
        console.log(contentList,"contentList")
        let styleRatio = 0.0115;


        //获取book样式
        let bookStyle = {
           width: notePodData.book_width*styleRatio + "rem",
           height: notePodData.book_height*styleRatio + "rem",
           position: 'relative',
           margin: '0 auto',
           backgroundColor: "#fff",
           overflow: "hidden",
        };
        return (
            <div>
                <section className="pre">
                    <div className="preGap"></div>
                    <div className="preContent" style={bookStyle}>
                        {<NotePageCon data={contentList} />}
                    </div>
                    <div className="prePage">
                        <div className="preArrowL" onClick={this.prevPage.bind(this)}></div>
                        <div className="preNum">
                            {this.state.curPage} / {notePodData.content_list.length}
                        </div>
                        <div className="preArrowR" onClick={this.nextPage.bind(this)}></div>
                    </div>
                    {
                        true ? <NotePreviewBtn bookId={this.bookId} mask={this.openMask.bind(this)} /> : <NotePreviewMeToo />
                    }
                    { this.state.showMask ? <NoteMask close={this.closeMask.bind(this)} /> : null }
                </section>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        notePodData: state.notePodData
    }
}

export default connect(mapStateToProps)(NotePreviewPageCopy)





