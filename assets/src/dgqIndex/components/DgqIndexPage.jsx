/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2017/12/4
 * 变更记录:
 */
import React,{Component} from 'react';

import '../../index/less/index.less'


class DgqIndexPage extends Component{
  constructor (props){
    super(props)
  }

  componentDidMount(){
    //分享
    wx.config({
      debug: false,
      appId: wxConfig.appId,
      timestamp: wxConfig.timestamp,
      nonceStr: wxConfig.nonceStr,
      signature: wxConfig.signature,
      jsApiList: ['showOptionMenu','hideOptionMenu', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function () {
      wx.showOptionMenu();
      var shareObj = {
        title: '戴光强养生台历，送给父母最好的礼物！',
        desc: '上传亲人13张照片，让最实用、最科学的戴光强健康知识台历陪伴亲人一整年',
        link: location.href,
        imgUrl: 'http://img1.timeface.cn/times/173000e6cf31e412eb2af812f50f15d7.jpg'
      };
      var shareObj1 = {
        title: '戴光强养生台历，送给父母最好的礼物！',
        link: location.href,
        imgUrl: 'http://img1.timeface.cn/times/173000e6cf31e412eb2af812f50f15d7.jpg'
      };
      //分享给好友
      wx.onMenuShareAppMessage(shareObj);
      //分享到朋友圈
      wx.onMenuShareTimeline(shareObj1);
      //分享到QQ
      wx.onMenuShareQQ(shareObj);
      // 分享到腾讯微博
      wx.onMenuShareWeibo(shareObj);
      //分享到QQ空间
      wx.onMenuShareQZone(shareObj);
    });
  }

  render() {

    return (
      <div>
        <div className="tab">
            <div className="tabImgBox">
              <img className="tabImg" src={require('../images/dgq_img8.jpg')} alt=""/>
            </div>
        </div>
        <div className="tab tab1 ">
          <div>
            <div className="tab1_top">
              <strong>承包你的全年健康</strong>
              <span><i>￥28.00</i></span>
              <p className="tab1_con">— 戴光强养生台历</p>
            </div>
            <div className="border"></div>
            <div className="tab1_list">
              <p style={{float:'left'}}><img style={{width: '.28rem', height: '.28rem'}} src={require('../../index/images/tab1.png')} alt=""/>每月一个健康贴士</p>
              <p style={{float:'right'}}><img style={{width: '.26rem', height: '.28rem'}} src={require('../../index/images/tab2.png')} alt=""/>扫码收听养生音频&nbsp;</p>
              <p style={{float:'left'}}><img style={{width: '.24rem', height: '.28rem'}} src={require('../../index/images/tab3.png')} alt=""/>保健大使详解健康知识</p>
              <p style={{float:'right'}}><img style={{width: '.28rem', height: '.28rem'}} src={require('../../index/images/tab4.png')} alt=""/>精心制作 工匠品质</p>
            </div>
          </div>
        </div>
        <div className="tab">
          <div className="tab_box" style={{paddingBottom:0,margin:'0.28rem 0 0 0'}}>
            <div className="tab_title">每月不同健康主题</div>
            <div className="tab_info">
              <p>跟着保健大使戴光强学养生，健康生活从这里开始   </p>
              <img style={{display:'inherit'}} src={require('../images/dgq_img2.jpg')} alt=""/>
            </div>
          </div>
        </div>
        <div className="tab">
          <div className="tab_box" style={{paddingBottom:0,margin:'0.28rem 0 0 0'}}>
            <div className="tab_title">个人专属养生宝典</div>
            <div className="tab_info">
              <p>超多健康养生“绝招”，保健大使戴光强毫无保留告诉你</p>
              <img style={{display:'inherit'}} src={require('../images/dgq_img3.jpg')} alt=""/>
            </div>
          </div>
        </div>
        <div className="tab">
          <div className="tab_box" style={{paddingBottom:0,margin:'0.28rem 0 0 0'}}>
            <div className="tab_title">扫码收听健康音频</div>
            <div className="tab_info">
              <p>扫一扫，保健大使戴光强亲“声”讲述健康小课堂，随时随地，想听就听</p>
              <img style={{display:'inherit'}} src={require('../images/dgq_img4.jpg')} alt=""/>
            </div>
          </div>
        </div>
        <div className="footer">
          <a href={'http://wechat.timeface.cn/calendar/preview?bid=548100274089'}>立即购买</a>
        </div>
      </div>
    )
  }
}

export default DgqIndexPage