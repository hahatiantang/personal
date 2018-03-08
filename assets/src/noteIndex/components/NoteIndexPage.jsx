/**
 * 文件说明:记事本首页
 * 详细描述:
 * 创建者: hzw
 * 创建时间: 2016/11/11
 * 变更记录:
 */
import React,{Component} from 'react';
import IndexListItem from './IndexListItem.jsx'
import IndexBtn from  './IndexBtn.jsx'

import '../less/noteIndex.less'
import '../js/noteIndexJs.js'


class NoteIndexPage extends Component{
    constructor (props){
        super(props)
    }

    

    componentDidMount(){
        //轮播
        $.Carousel();
        //分享
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
                title: '我在时光流影，上传自己的照片就能生成专属个性笔记本，你也来试试吧！',
                desc: '我在时光流影，上传自己的照片就能生成专属个性笔记本，你也来试试吧！',
                link: location.href,
                imgUrl: "http://img1.timeface.cn/album/avator/6624e52a1fc5b1773421b5d51507d835.jpg@0r_2o"
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
        })
    }

    render() {
        let indexData = [
            {color: "#1eaef4",title: "花样封面随意换", sub: "多种主题封面任意选择。"},
            {color: "#1eaef4",title: "插页内任意定制", sub: "插页和页眉页脚均可上传定制自己喜爱的风格和文字， 宣传自用两相宜。"},
            {color: "#1eaef4",title: "独特内芯风格多变", sub: "点阵、横线、空白三种内芯契合不同需求，亦可自由定义 内芯风格。"},
            {color: "#1eaef4",title: "轻奢品质极具内涵", sub: "100克米黄道林纸，书写流畅触感极佳，文字与图画同 飞舞。"},
            {color: "#1eaef4",title: "装帧精美易用顺畅", sub: "细致锁线胶装，180度平摊展开，让您使用得更加舒心。"}
        ]
        return (
            <div>
                <section className="banner">
                    <ul className="bannerList">
                        <li className="bannerItem"><a href="javascript:void(0)"><img src={require("../images/banner1.jpg")} alt=""/></a></li>
                        <li className="bannerItem"><a href="javascript:void(0)"><img src={require("../images/banner2.jpg")} alt=""/></a></li>
                        <li className="bannerItem"><a href="javascript:void(0)"><img src={require("../images/banner3.jpg")} alt=""/></a></li>
                    </ul>
                </section>
                <section className="gap"></section>
                <section className="notePrice">
                    <div className="notePriceCon">
                        <div className="notePriceTitle">
                            <div className="noteTitle">
                                <h1>时光记事本</h1>
                                <div className="time">
                                    <div style={{fontSize: "0.32rem",color:"#ff0000"}}>￥</div>
                                    <div style={{fontSize: "0.32rem",color:"#ff0000"}}>16.00</div>
                                    <div style={{fontSize: "0.32rem",color:"#666"}}>起</div>
                                </div>
                            </div>
                            <div className="notesubTitle">定制属于你的个性记事本</div>
                        </div>
                        <div className="notePricedesc">
                            <ul>
                                <li>12张插页，176页书写纸张</li>
                                <li>尺寸：266mm &Chi; 185mm</li>
                            </ul>
                        </div>
                    </div>
                </section>
                <section className="gap"></section>
                <section className="listItemCon">
                    <IndexListItem data={indexData} />
                </section>
                <div style={{
                    width: "100%",
                    height: "1.2rem"
                }}></div>
                <IndexBtn />
            </div>
        )
    }
}

export default NoteIndexPage