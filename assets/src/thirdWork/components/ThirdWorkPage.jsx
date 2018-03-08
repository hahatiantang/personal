/**
 * 文件说明:
 * 详细描述:
 * 创建者: ycl
 * 创建时间: 2016/10/10
 * 变更记录:
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import AlertMsg from '../../common/AlertMsg.jsx';
import URL from 'url';
import '../../index/less/index.less'
import _ from 'lodash';

class ThirdWorkPage extends Component {
  constructor(props) {
    super(props);
    let styleId = '';
    if(props.commonAppIdData.length > 1){
      props.commonAppIdData.map((item)=>{
        if(item.templateName.indexOf('横版') > -1){
          styleId = item.bookType
        }
      })
    }else{
      styleId = props.commonAppIdData[0].bookType
    }

    this.state = {
      deleteModal: false,
      calendarStyle: styleId,
      showAlert: false,
      alertMsg: ''
    };
    this.queryObj = URL.parse(window.location.href, true).query || {};
  }

  componentDidMount() {
    let shareTitle = '2018帮女郎台历全新上线，点击立即制作';
    let shareDesc = '上传12张图片就能制作一本个性化的2018帮女郎台历，新的一年，让我们陪你度过';
    let shareImg = 'http://img1.timeface.cn/times/010c0455d810cf42498879475b1f1fca.jpg';
    if(this.queryObj.appid){
      if(this.queryObj.appid == 408199541318){
        document.title = '2018帮女郎台历';
        shareTitle = '2018帮女郎台历全新上线，点击立即制作';
        shareDesc = '上传12张图片就能制作一本个性化的2018帮女郎台历，新的一年，让我们陪你度过';
        shareImg = 'http://img1.timeface.cn/times/010c0455d810cf42498879475b1f1fca.jpg';
      }
      if(this.queryObj.appid == 425130533549){
        document.title = '柏柏朗读台历';
        shareTitle = '柏柏朗读台历，会教孩子朗读的台历！';
        shareDesc = '课文是最好的朗读材料，跟着课文学朗读，一起来听“柏柏朗读经”！';
        shareImg = 'http://img1.timeface.cn/times/f7c2c065f8a7684da65f409258a90a57.jpg';
      }
    }
    let query = '?share=1';
    if (!_.isEmpty(this.queryObj)) {
      query = '&share=1'
    }

    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: wxConfig.appId, // 必填，公众号的唯一标识
      timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
      nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
      signature: wxConfig.signature,// 必填，签名，见附录1
      jsApiList: ['showOptionMenu','hideOptionMenu', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function () {
      wx.showOptionMenu();
      var shareObj = {
        title: shareTitle,
        desc: shareDesc,
        link: location.href + query,
        imgUrl: shareImg
      };
      var shareObj1 = {
        title: shareTitle,
        link: location.href + query,
        imgUrl: shareImg
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

  /**
   * 打开选择样式弹窗
   */
  openDeleteModal() {
    let commonAppIdData = this.props.commonAppIdData || [];
    let appid = this.queryObj.appid || '';
    let appf = this.queryObj.f || '';
    var ua = navigator.userAgent.toLowerCase();
    var isWeixin = ua.indexOf('micromessenger') != -1;
    var isQQ = ua.indexOf('qq/') != -1;
    var isWeibo = ua.indexOf('weibo') != -1;
    var uaShow = false;
    if (isWeixin || isQQ || isWeibo) {
      uaShow = true
    }
    if (!uaShow) {
      this.handelAlertMsg(true, '请在微信客户端打开哦！')
    } else {
      if(commonAppIdData.length) {
        if (commonAppIdData.length == 1) {
          window.location.href = '/calendar/edit?style=' + this.state.calendarStyle + '&appid=' + appid;
        } else {
          this.setState({
            deleteModal: true
          })
        }
      }
    }

  }

  closeDeleteModal() {
    this.setState({
      deleteModal: false
    })
  }

  handSelectStyle(ops) {
    this.setState({
      calendarStyle: ops
    })
  }

  //弹框提示
  handelAlertMsg(type, msg) {
    this.setState({
      showAlert: type,
      alertMsg: msg
    });
  }

  //根据不同的appid显示不同的内容
  handelChoice(appid){
    let choiceData = {
      normalHb:require('../../index/images/htl.png'),
      normalSb:require('../../index/images/stl.png'),
      normalBanner:require('../../index/images/banner1.png'),
      normalFont:'时光台历 2018',
      normalFont1:'记录美好生活更多一点',
      styleFont1:'自选13张照片入册',
      styleFont2:'多种照片模板风格',
      styleFont3:'精选250g哑粉纸',
      styleFont4:'横竖双板更多选择',
      introFont1:'个性照片 一键导入',
      introFont2:<span>尺寸精巧，智能匹配各种比例照片<br/>横版：205mm*147mm，竖版：147mm*205mm</span>,
      introFont3:'精心制作 工匠品质',
      introFont4:'250g哑粉纸，皮纹底座，物超所值。用心做好台历。',
      introFont5:'海量风格 随心搭配',
      introFont6:'精心设计多套模板供您选用。内页风格随心换，搭配您的style。',
      introImg1:require('../../index/images/m_style.jpg'),
      introImg2:require('../../index/images/info2.jpg'),
      introImg3:require('../../index/images/m_bind.jpg'),
    };
    switch(appid - 0){
      case 408199541318:
        choiceData.normalHb = require('../images/third_hbc.png');
        choiceData.normalSb = require('../images/third_sbc.png');
        choiceData.normalBanner = require('../images/third_banner.jpg');
        choiceData.normalFont = '2018帮女郎台历';
        break;
      case 425130533549:
        choiceData.normalHb = require('../images/third_hbc.png');
        choiceData.normalSb = require('../images/third_sbc.png');
        choiceData.normalBanner = require('../images/third_banner_bobo.jpg');
        choiceData.normalFont = '2018柏柏朗读台历';
        choiceData.normalFont1 = '上传13张照片，定制一本会教孩子朗读的台历';
        choiceData.styleFont1 = '每月不同知识点';
        choiceData.styleFont2 = <span>扫码收听朗读内容&nbsp;</span>;
        choiceData.styleFont3 = '上传个性照片';
        choiceData.styleFont4 = '精心制作 工匠品质';
        choiceData.introFont1 = '知识每月更新 照片月月不同';
        choiceData.introFont2 = '上传宝宝/家庭13张照片，定制个性知识台历';
        choiceData.introFont3 = '经典朗读，随时随地，想听就听';
        choiceData.introFont4 = '扫一扫台历上的二维码，收听柏柏老师亲“声”读经';
        choiceData.introFont5 = '精心制作 工匠品质';
        choiceData.introFont6 = '250g哑粉纸，皮纹底座，物超所值';
        choiceData.introImg1 = require('../images/third_con_bobo1.png');
        choiceData.introImg2 = require('../images/third_con_bobo2.png');
        choiceData.introImg3 = require('../images/third_con_bobo3.png');
        break;
    }
    return choiceData;
  }

  render() {
    let appid = this.queryObj.appid || '';
    let commonAppIdData = this.props.commonAppIdData || [];
    let sbData = _.filter(commonAppIdData,(item)=>{
      return item.templateName.indexOf('竖版') > -1
    });
    let hbData = _.filter(commonAppIdData,(item)=>{
      return item.templateName.indexOf('横版') > -1
    });
    let choiceData = this.handelChoice(appid);

    return (
      <div>
        <div className="tab">
          <div className="tabImgBox">
            <img className="tabImg" src={choiceData.normalBanner} alt=""/>
          </div>
        </div>
        <div className="tab tab1 ">
          <div>
            <div className="tab1_top">
              <strong>{choiceData.normalFont}</strong>
              <span><i>{'¥'+commonAppIdData[0].buyoutPrice.toFixed(2)}</i></span>
              <p className="tab1_con">{choiceData.normalFont1}</p>
            </div>
            <div className="border"></div>
            <div className="tab1_list">
              <p style={{float:'left'}}><img style={{width: '.28rem', height: '.28rem'}} src={require('../../index/images/tab1.png')} alt=""/>{choiceData.styleFont1}</p>
              <p style={{float:'right'}}><img style={{width: '.26rem', height: '.28rem'}} src={require('../../index/images/tab2.png')} alt=""/>{choiceData.styleFont2}</p>
              <p style={{float:'left'}}><img style={{width: '.24rem', height: '.28rem'}} src={require('../../index/images/tab3.png')} alt=""/>{choiceData.styleFont3}</p>
              <p style={{float:'right'}}><img style={{width: '.28rem', height: '.28rem'}} src={require('../../index/images/tab4.png')} alt=""/>{choiceData.styleFont4}</p>
            </div>
          </div>
        </div>
        <div className="tab">
          <div className="tab_box">
            <div className="tab_title">{choiceData.introFont1}</div>
            <div className="tab_info">
              <p>{choiceData.introFont2}</p>
              <img src={choiceData.introImg1} alt=""/>
            </div>
            <div className="tab_title">{choiceData.introFont3}</div>
            <div className="tab_info">
              <p>{choiceData.introFont4}</p>
              <img src={choiceData.introImg2} alt=""/>
            </div>
            <div className="tab_title">{choiceData.introFont5}</div>
            <div className="tab_info">
              <p>{choiceData.introFont6}</p>
              <img style={{display: 'inherit'}} src={choiceData.introImg3} alt=""/>
            </div>
          </div>
        </div>
        <div className="footer">
          <a onClick={this.openDeleteModal.bind(this)} href="javascript:;">立即制作</a>
        </div>
        {
          this.state.deleteModal ? <div className="weui_dialog_confirm tf_wx_dialog" id="confirm_dialog" style={{fontSize: '0.24rem'}}>
              <div className="weui_mask"></div>
              <div className="weui_dialog" style={{width: '85%'}}>
                <div className="weui_dialog_hd select_calendar">
                  <strong className="weui_dialog_title">选择样式</strong>
                  <img onClick={this.closeDeleteModal.bind(this)} className="close" src={require('../../index/images/close.png')} alt=""/>
                </div>
                <div className="weui_dialog_bd">
                  <div className="img_style">
                    <img className="img_style_first" src={choiceData.normalHb} alt=""/>
                    <img className="img_style_sec" src={choiceData.normalSb} alt=""/>
                  </div>
                  <div className="jia_box">
                    <div className="weui_cells weui_cells_checkbox">
                      <label className="weui_cell weui_check_label" htmlFor="s11" onClick={this.handSelectStyle.bind(this, hbData[0].bookType)}>
                        <div className="weui_cell_hd">
                          <input defaultChecked type="radio" className="weui_check" name="radio1" id="s11"/>
                          <i className="weui_icon_checked"/>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                          <p>横版: <span className="jia">{'￥'+hbData[0].buyoutPrice.toFixed(2)}</span></p>
                        </div>
                      </label>
                      <label className="weui_cell weui_check_label" htmlFor="s12" onClick={this.handSelectStyle.bind(this, sbData[0].bookType)}>
                        <div className="weui_cell_hd">
                          <input type="radio" className="weui_check" name="radio1" id="s12"/>
                          <i className="weui_icon_checked"/>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                          <p>竖版: <span className="jia">{'￥'+sbData[0].buyoutPrice.toFixed(2)}</span></p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="weui_dialog_ft">
                  <a href={'/calendar/edit?style=' + this.state.calendarStyle + '&appid=' + appid} className="weui_btn_dialog primary">开始制作</a>
                </div>
              </div>
            </div> : null
        }
        {this.state.showAlert ?
          <AlertMsg
            alertImg={require('../../index/images/alertWarn.png')}
            alertMsg={this.state.alertMsg}
            timeing={2000}
            handelAlertMsg={this.handelAlertMsg.bind(this)}/>
          : null}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    wxConfig: state.wxConfig,
    commonAppIdData: state.commonAppIdData
  }
}

export default connect(mapStateToProps)(ThirdWorkPage)