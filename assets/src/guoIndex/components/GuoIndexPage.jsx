/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2017/12/4
 * 变更记录:
 */
import React,{Component} from 'react';

import '../../index/less/index.less'


class GuoIndexPage extends Component{
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
        title: '会辅导作文的家教台历，让您和孩子一起成长！',
        desc: '上传宝宝/家庭13张照片，定制个性家教台历，增长知识，记录美好',
        link: location.origin + location.pathname + '?share=1',
        imgUrl: 'http://img1.timeface.cn/times/68d1d6da2d7d1d98cd3dfab41c6d519a.png'
      };
      var shareObj1 = {
        title: '会辅导作文的家教台历，让您和孩子一起成长！',
        link: location.origin + location.pathname + '?share=1',
        imgUrl: 'http://img1.timeface.cn/times/68d1d6da2d7d1d98cd3dfab41c6d519a.png'
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
            <img className="tabImg" src={require('../images/guo_img1.jpg')} alt=""/>
          </div>
        </div>
        <div className="tab tab1 ">
          <div>
            <div className="tab1_top">
              <strong>2018家教辅导台历</strong>
              <span><i>￥28.00</i></span>
              <p className="tab1_con">郭老师与您一对一交流</p>
            </div>
            <div className="border"></div>
            <div className="tab1_list">
              <p style={{float:'left'}}><img style={{width: '.3rem', height: '.3rem'}} src={require('../images/guo_tab1.png')} alt=""/>每月不同知识点</p>
              <p style={{float:'right'}}><img style={{width: '.26rem', height: '.26rem'}} src={require('../images/guo_tab2.png')} alt=""/>扫码收听辅导内容&nbsp;</p>
              <p style={{float:'left'}}><img style={{width: '.31rem', height: '.24rem'}} src={require('../images/guo_tab3.png')} alt=""/>上传个性照片</p>
              <p style={{float:'right'}}><img style={{width: '.3rem', height: '.3rem'}} src={require('../images/guo_tab4.png')} alt=""/>精心制作 工匠品质</p>
            </div>
          </div>
        </div>
        <div className="tab" style={{paddingBottom:'0.2rem',marginBottom:'0'}}>
          <div className="tab_box" style={{paddingBottom:0,margin:'0.28rem 0 0 0'}}>
            <div className="tab_title" style={{borderLeft:'.05rem solid #f4ba1e'}}>知识每月更新，照片月月不同</div>
            <div className="tab_info">
              <p>上传宝宝/家庭13张照片，定制个性知识台历</p>
              <img style={{display:'inherit'}} src={require('../images/guo_img2.jpg')} alt=""/>
            </div>
          </div>
        </div>
        <div className="tab" style={{paddingBottom:'0.2rem',marginBottom:'0'}}>
          <div className="tab_box" style={{paddingBottom:0,margin:'0.28rem 0 0 0'}}>
            <div className="tab_title" style={{borderLeft:'.05rem solid #f4ba1e'}}>家教知识、随时随地、想听就听</div>
            <div className="tab_info">
              <p>扫一扫台历上的二维码，收听郭老师亲“声”讲课</p>
              <img style={{display:'inherit'}} src={require('../images/guo_img3.jpg')} alt=""/>
            </div>
          </div>
        </div>
        <div className="tab" style={{paddingBottom:'1.4rem',marginBottom:'0'}}>
          <div className="tab_box" style={{paddingBottom:0,margin:'0.28rem 0 0 0'}}>
            <div className="tab_title" style={{borderLeft:'.05rem solid #f4ba1e'}}>线上名师互动</div>
            <div className="tab_info">
              <p>扫码后可与郭老师一对一交流，郭老师为您答疑解惑</p>
              <img style={{display:'inherit'}} src={require('../images/guo_img4.jpg')} alt=""/>
            </div>
          </div>
        </div>
        <div className="footer">
          <a href={'http://wechat.timeface.cn/calendar/edit?style=263&appid=416121202410'}>开始制作</a>
        </div>
      </div>
    )
  }
}

export default GuoIndexPage