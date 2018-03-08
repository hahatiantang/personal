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
import '../less/index.less'
import '../less/swiper.min.css'
import _ from 'lodash';
require('../js/swiper.min.js');

class IndexPage extends Component {
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
    const betweenNumber = parseInt(parseFloat($('.slider').css('font-size'))*5.7);
    new Swiper('.slider', {
        spaceBetween: betweenNumber,
        initialSlide: 0,
        centeredSlides: true,
        slidesPerView: 2,
        watchActiveIndex: true,
        loop: true,
        autoplay : 5000
    });

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
      jsApiList: ['showOptionMenu', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function () {
      wx.showOptionMenu();
      var shareObj = {
        title: '2018时光台历',
        desc: '我在时光流影，批量上传13张照片就能快速生成一本新年台历，你也来试试吧！',
        link: location.href + query,
        imgUrl: 'http://img1.timeface.cn/times/2512efcfd39fae44d7d6c1e3779041a1.jpg'
      };
      var shareObj1 = {
        title: '我在时光流影，批量上传13张照片就能快速生成一本新年台历，你也来试试吧！',
        link: location.href + query,
        imgUrl: 'http://img1.timeface.cn/times/2512efcfd39fae44d7d6c1e3779041a1.jpg'
      };

      /*  // 分享成功后回调
       if(successCb){
       shareObj.success = successCb
       }
       // 取消分享后回调
       if(cancelCb){
       shareObj.cancel = cancelCb
       }

       if(url){
       shareObj.link = url;
       }*/
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
          window.location.href = '/calendar/edit?style=' + this.state.calendarStyle + '&appid=' + appid + '&f=' + appf;
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

  render() {
    let appid = this.queryObj.appid || '';
    let appf = this.queryObj.f || '';
    let commonAppIdData = this.props.commonAppIdData || [];
    let sbData = _.filter(commonAppIdData,(item)=>{
      return item.templateName.indexOf('竖版') > -1
    });
    let hbData = _.filter(commonAppIdData,(item)=>{
      return item.templateName.indexOf('横版') > -1
    });
    return (
      <div>
        <div className="slider" id="slider">
          <div className="swiper-wrapper">
            <div className="swiper-slide"><img className="swiper-item" swiper-animate-effect="zoomIn" src={require('../images/banner1.jpg')}/></div>
            <div className="swiper-slide"><img className="swiper-item" swiper-animate-effect="zoomIn" src={require('../images/banner2.jpg')}/></div>
            <div className="swiper-slide"><img className="swiper-item" swiper-animate-effect="zoomIn" src={require('../images/banner3.jpg')}/></div>
          </div>
        </div>


        <div className="tab tab1 ">
          <div>
            <div className="tab1_top">
              <strong>时光台历 2018</strong>
              <span>
                {appid == 453146646864 ?<span style={{float:'left','fontSize':'0.32rem'}}>限时价：</span>: null}
                <i>{'¥'+commonAppIdData[0].buyoutPrice.toFixed(2)}</i>
              </span>
              <p className="tab1_con" >
                <span style={{float:'left','fontSize':'0.28rem'}}>记录美好生活更多一点</span>
                {appid == 453146646864 ?
                  <span style={{float: 'right'}}>
                    <i className="newTypeI">原价：</i>
                    <i className="newTypeI" style={{textDecoration: 'line-through'}}>{'¥39.00'}</i>
                  </span>
                : null}
              </p>

            </div>
            <div className="border"></div>
            <div className="tab1_list">
              <p style={{float:'left'}}><img style={{width: '.28rem', height: '.28rem'}} src={require('../images/tab1.png')} alt=""/>自选13张照片入册</p>
              <p style={{float:'right'}}><img style={{width: '.26rem', height: '.28rem'}} src={require('../images/tab2.png')} alt=""/>多种照片模板风格</p>
              <p style={{float:'left'}}><img style={{width: '.24rem', height: '.28rem'}} src={require('../images/tab3.png')} alt=""/>精选250g哑粉纸</p>
              <p style={{float:'right'}}><img style={{width: '.28rem', height: '.28rem'}} src={require('../images/tab4.png')} alt=""/>横竖双板更多选择</p>
            </div>
          </div>
        </div>
        <div className="tab">
          <div className="tab_box">
            <div className="tab_title">个性照片 一键导入</div>
            <div className="tab_info">
              <p>尺寸精巧，智能匹配各种比例照片<br/>横版：205mm*147mm，竖版：147mm*205mm</p>
              <img src={require('../images/m_style.jpg')} alt=""/>
            </div>
            {/*<div className="tab_title">尺寸</div>
            <div className="tab_info">
              <p>横版尺寸：宽200mm * 高150mm；</p>
              <p>竖版尺寸：宽150mm * 高200mm。</p>
              <img src={require('../images/info1.jpg')} alt=""/>
            </div>*/}
            <div className="tab_title">精心制作 工匠品质</div>
            <div className="tab_info">
              <p>250g哑粉纸，皮纹底座，物超所值。用心做好台历。</p>
              <img src={require('../images/info2.jpg')} alt=""/>
            </div>
            {/*<div className="tab_title">纸张</div>
            <div className="tab_info">
              <p>320g超厚艺术卡纸，纸张坚挺用一年毫无压力，手感温润细腻易书写。</p>
              <img src={require('../images/info3.jpg')} alt=""/>
            </div>*/}
            <div className="tab_title">海量风格 随心搭配</div>
            <div className="tab_info">
              <p>精心设计多套模板供您选用。内页风格随心换，搭配您的style。</p>
              <img style={{display: 'inherit'}} src={require('../images/m_bind.jpg')} alt=""/>
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
                  <img onClick={this.closeDeleteModal.bind(this)} className="close" src={require('../images/close.png')} alt=""/>
                </div>
                <div className="weui_dialog_bd">
                  <div className="img_style">
                    <img className="img_style_first" src={require('../images/htl.png')} alt=""/>
                    <img className="img_style_sec" src={require('../images/stl.png')} alt=""/>
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
                  <a href={'/calendar/edit?style=' + this.state.calendarStyle + '&appid=' + appid + '&f=' + appf} className="weui_btn_dialog primary">开始制作</a>
                </div>
              </div>
            </div> : null
        }
        {this.state.showAlert ?
          <AlertMsg
            alertImg={require('../images/alertWarn.png')}
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

export default connect(mapStateToProps)(IndexPage)