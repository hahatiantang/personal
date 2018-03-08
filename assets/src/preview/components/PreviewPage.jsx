/**
 * 文件说明: 预览界面
 * 详细描述:
 * 创建者:  MFChen
 * 创建时间: 2016/10/12
 * 变更记录:
 */
import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import URL from 'url';
import Cookies from 'cookies-js';
import {addCart,calendarPay,judgeType,printchoice,bookprice} from '../../redux/dao/dao';
import PrevCalendar from './PrevCalendar.jsx';
import CartDialog from './CartDialog.jsx';
import PrintDialog from './PrintDialog.jsx';
import MyBookTip from './MyBookTip.jsx';
import BookNotPrint from './BookNotPrint.jsx';
import AlertMsg from '../../common/AlertMsg.jsx';
import ImgBlurTip from '../../common/ImgBlurTip.jsx';
import '../less/preview.less'

class PreviewPage extends Component {
  constructor(props) {
    super(props);
    this.state={
      currentIndex:0,
      side:true,
      openCart:false,
      textContent:'',
      textBtn:'',
      openShare:false,
      openCreate:false,
      openPrint:false,
      showAlert:false,
      showBookTip:false,
      alertMsg:'',
      uid:Cookies('tf-uid'),
      bookNo:false,
      imgBlur:false,
      blurList:[],
      pageLoading:true
    };
    this.bookId = URL.parse(window.location.href, true).query.bid || '';
    this.queryObj = URL.parse(window.location.href, true).query || '';
    this.actions = bindActionCreators(Object.assign({},{addCart,calendarPay,judgeType,printchoice,bookprice}), props.dispatch);
  }

  componentDidMount(){
    /*require('vconsole')*/
    this.setState({
      uid:Cookies('tf-uid')
    })
    console.log('Cookie',Cookies('tf-uid'))
    if (Cookies("showMb") == 'false' || !Cookies('showMb')) {
      //不显示我的作品
      //this.handelBooks(true)
    }
    let podStore =  this.props.podStore;
    let secondList = [];
    podStore.content_list.map((list,index)=>{
      if(list.page_type == 1){
        list.element_list.map((item,index1)=>{
          if(item.element_type == 1){
            if((parseInt(item.image_content_expand.image_width) < 800 || parseInt(item.image_content_expand.image_height) < 800)){
              let blurList = {
                index:index,
                cenIndex:index1
              };
              secondList.push(blurList);
            }
          }
        })
      }
    });
    this.setState({
      blurList:secondList
    });
    let shareIntro = '上传13张照片就能制作自己的专属台历，时光台历，让爱陪自己度过一整年';
    let shareTitle = '快看看'+podStore.book_title;
    if(podStore.book_type == 103){
      shareIntro = '时光流影diy拼图台历，百变场景任你换，上传你和TA的美照，想怎么拼就怎么拼！'
    }
    if(podStore.book_type == 251){
      shareIntro = '我定制了2018戴光强健康台历，拥抱健康新生活';
      shareTitle = '快看看'+podStore.book_author+'的2018健康台历';
    }
    if(podStore.book_type == 263){
      shareIntro = '上传宝宝/家庭13张照片，定制个性家教台历，增长知识，记录美好';
      shareTitle = '会辅导作文的家教台历，让您和孩子一起成长！';
    }
    if(podStore.book_type == 289){
      shareIntro = '课文是最好的朗读材料，跟着课文学朗读，一起来听“柏柏朗读经”！';
      shareTitle = '柏柏朗读台历，会教孩子朗读的台历！';
    }
    let that = this;
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: wxConfig.appId, // 必填，公众号的唯一标识
      timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
      nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
      signature: wxConfig.signature,// 必填，签名，见附录1
      jsApiList: ['showOptionMenu','onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ','onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function () {
      wx.showOptionMenu();
      var shareObj = {
        title: shareTitle,
        desc: shareIntro,
        link: location.href + '&share=1',
        imgUrl: podStore.book_cover
      };

      var shareObj1 = {
        title: shareIntro,
        link: location.href + '&share=1',
        imgUrl: podStore.book_cover
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
    let hammertime = new Hammer( $( ".pre_calendar_box" )[ 0 ], {domEvents: true} );
    hammertime.on('swipeleft', function(ev) {
      if(that.state.currentIndex == 23 || that.state.currentIndex == 24){
        return
      }
      that.handelLeftTight('right')
    });
    hammertime.on('swiperight', function(ev) {
      if(that.state.currentIndex == 0 || that.state.currentIndex == 25){
        return
      }
      that.handelLeftTight('left')
    });
    $('body').on('click',function () {
      if(that.queryObj.share){
        if(event.target.className.indexOf('different') > -1 || this.bookId == 548100274089){
          //event.preventDefault()
        }else{
          that.handelOpenCreate()
        }
      }
    })
  }

  //弹框提示
  handelAlertMsg(type,msg){
    this.setState({
      showAlert:type,
      alertMsg:msg
    });
  }

  //正反面
  handDifSide(flag){
    if(this.state.side == flag){
      return
    }
    let index = this.state.currentIndex;
    if(index == 0){
      return
    }
    let preStore = this.props.podStore.content_list;
    if(flag){
      if(preStore[index].content_type == 6){
        index = 0
      }else{
        index = index - 1
      }
    }else{
      if(preStore[index].content_type == 3){
        index = 25
      }else{
        index = index + 1
      }
    }
    this.setState({
      side:flag,
      currentIndex:index
    })
  }

  //上一页下一页
  handelLeftTight(flag){
    let podStore =  this.props.podStore || {};
    let preStore = podStore.content_list || [];
    let index = this.state.currentIndex;
    if(flag == 'right'){
      if(index == 23 || index == 24){
        return false;
      }
      this.setState({
        pageLoading:false
      })
      if(preStore[index].content_type == 3){
        index = index + 1
      }else if(index == 25){
        index = 2
      }else{
        index = index + 2
      }
    }else{
      if(index == 0 || index == 25 || index == 2){
        return false;
      }
      this.setState({
        pageLoading:false
      })
      if(preStore[index].content_type == 6 || index == 1){
        index = index - 1
      }else{
        index = index - 2
      }
    }
    this.setState({
      currentIndex:index
    },()=>{
      this.setState({
        pageLoading:true
      })
    })
  }

  //月份判断
  handelMonthName(pageStore){
    let name = '';
    if(pageStore.content_type == 6){
      name = '封底'
    }else if(pageStore.content_type == 3){
      name = '封面'
    }else{
      name = pageStore.template_file_name.substring(0,2);
      if(parseInt(name) > 9){

      }else{
        name = name.substring(0,1)
      }
      name = name + '月';
    }

    return name;
  }

  //分享
  handelShare(){
    this.setState({
      openShare:true
    })
  }

  //关闭分享
  handelCloseShare(){
    this.setState({
      openShare:false
    })
  }

  //加入印刷车
  handelAddCart(num){
    let printChoiceStore = this.props.printChoiceStore || {};
    let bind = printChoiceStore.bind || [];
    let paper = printChoiceStore.paper || [];
    let size = printChoiceStore.size || [];
    let bindId = bind.length > 0 ? bind[0].id : '';
    let paperId = paper.length > 0 ? paper[0].id : '';
    let sizeId = size.length > 0 ? size[0].id : '';
    let data = {
      bookId: this.bookId,
      type: 6,
      bind: bindId, //打圆孔
      color: 1,
      paper:paperId,
      size: sizeId, //233竖版，232横版
      count:num || 1
    };
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

  //立即购买
  handelPay(num){
    let printChoiceStore = this.props.printChoiceStore || {};
    let bind = printChoiceStore.bind || [];
    let paper = printChoiceStore.paper || [];
    let size = printChoiceStore.size || [];
    let bindId = bind.length > 0 ? bind[0].id : '';
    let paperId = paper.length > 0 ? paper[0].id : '';
    let sizeId = size.length > 0 ? size[0].id : '';
    let data = {
      bookId: this.bookId,
      type: 6,
      from:3,
      bind: bindId, //打圆孔
      color: 1,
      paper:paperId,
      size: sizeId,
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

  //关闭弹框
  handelClose(){
    this.setState({
      openCart:false
    })
  }

  //我也做一本
  handelOpenCreate(){
    this.setState({
     openCreate:true
    })
  }

  //关闭我也做一本
  handelCloseBook(event){
    this.setState({
      openCreate:false
    })
  }

  //关闭图片模糊弹窗
  handelCloseBlur(){
    this.setState({
      imgBlur:false
    })
  }

  //去第几页
  goWhichPage(){
    location.href = '/calendar/edit?bookId='+this.bookId+'&style='+this.props.podStore.book_type+'&blur=1'
  }

  //申请印刷前操作
  handelBeforePrint(){
    if(this.state.blurList.length){
      this.setState({
        imgBlur:true
      })
    }else{
     this.handelPrint(true)
    }
  }

  //申请印刷
  handelPrint(flag){
    if (this.queryObj.shuangFlag) {
      window.location.href = (location.origin == 'http://wechat.timeface.cn' ? 'http://www.timeface.cn' : 'http://stg2.v5time.net')
      + '/activies/calendardiscount/content?bid=' + this.queryObj.bid + (this.queryObj.appId ? '&appId=' + this.queryObj.appId : '')
      + (this.queryObj.f ? '&f=' + this.queryObj.f : '');
    } else {
      let podStore =  this.props.podStore || {};
      if(podStore.book_type == 69 || podStore.book_type == 103){
        this.handelNoBook(true);
        return
      }
      this.setState({
        openPrint:flag
      })
    }
  }

  //我的作品提示
  handelBooks(flag){
    this.setState({
      showBookTip:flag
    })
  }

  //我的作品cookie控制
  handelCook(flag){
    Cookies.set('showMb', flag, {
      expires: Infinity
    });
  }

  //不允许横版印刷
  handelNoBook(flag){
    this.setState({
      bookNo:flag
    })
  }

  render() {
    let podStore =  this.props.podStore || {};
    let preStore = podStore.content_list || [];
    let authorInfo = podStore.author_info || {};
    let authorId = authorInfo.id;
    let uid = this.state.uid;
    let showBtn = false;
    let printPriceStore =  this.props.printPriceStore || '';
    if(uid == authorId && !this.queryObj.recommend){
      if(this.queryObj && this.queryObj.orderId ){
        showBtn = false
      }else{
        showBtn = true
      }
    }else{
      showBtn = false
    }


    let bookStyle = {
      book_width:podStore.book_width,
      book_height:podStore.book_height,
      content_width:podStore.content_width,
      content_height:podStore.content_height,
      content_padding_left:podStore.content_padding_left,
      content_padding_top:podStore.content_padding_top
    };
    let monthName = this.handelMonthName(preStore[this.state.currentIndex]);
    let bookType = [69,70,103,234,235];
    let bookHb = true;
    if(bookStyle.book_width > bookStyle.book_height){
      bookHb = true;
    }else{
      bookHb=false;
    }
    return (
      <div className="preview-box">
        <div className="preview-tab">
          <div className="preview-tab-box">
            <span
              className={this.state.side ? "default different sideLeft" : "sideLeft different"}
              onClick={this.handDifSide.bind(this,true)}>
              {this.state.currentIndex == 0 || this.state.currentIndex == 25 ? '封面' : '正面'}</span>
            <span
              className={this.state.side ? "different sideRight" : "sideRight default different"}
              onClick={this.handDifSide.bind(this,false)}
              style={{opacity:this.state.currentIndex == 0 ? '0.2' : '1'}}>
              {this.state.currentIndex == 0 || this.state.currentIndex == 25 ? '封底' : '反面'}</span>
          </div>
        </div>
        {
          this.state.pageLoading ? <PrevCalendar
            pageStore={preStore[this.state.currentIndex]}
            bookType={podStore.book_type}
            bookHb={bookHb}
            podStore={podStore}
            bookStyle={bookStyle}
            queryObj={this.queryObj}/> :null
        }

        <div className="preview-month">
          <div className="preview-month_box">
            <div className="different" onClick={this.handelLeftTight.bind(this,'left')}>
              <img className="different" src={require('../../edit/images/previou.png')}
                   style={{opacity:this.state.currentIndex == 0 || this.state.currentIndex == 2 || this.state.currentIndex == 25 ? '0.2' : '1'}}/>
            </div>
            <span>{monthName}</span>
            <div className="different" onClick={this.handelLeftTight.bind(this,'right')}>
              <img className="different" src={require('../../edit/images/next.png')}
                   style={{opacity:this.state.currentIndex == 23 || this.state.currentIndex == 24 ? '0.2' : '1'}}/>
            </div>
          </div>
        </div>
        {
          showBtn || this.bookId == 548100274089 ?
            <div className="preview_footer">
              {bookType.indexOf(podStore.book_type) > -1 || podStore.from != 3 || this.bookId == 548100274089 ? null :
                <a className="preview_footer_edit different" href={'/calendar/edit?bookId='+this.bookId+'&style='+podStore.book_type
                +(this.queryObj.shuangFlag?'&shuangFlag='+this.queryObj.shuangFlag:'')
                +(this.queryObj.appId?'&appId='+this.queryObj.appId:'')
                +(this.queryObj.f?'&f='+this.queryObj.f:'')}>
                  <img src={require('../../notePreview/images/edit.png')} className="pre_edit different"/>
                  <p className="different">编辑内容</p>
                </a>
              }
              <div className="preview_footer_share different" onClick={this.handelShare.bind(this)}>
                <img src={require('../../notePreview/images/share.png')} className="pre_share different"/>
                <p className="different">分享</p>
              </div>
              {bookType.indexOf(podStore.book_type) > 2 || bookType.indexOf(podStore.book_type) < 0 ?
                <div className="preview_footer_print different" onClick={this.handelBeforePrint.bind(this,true)}>
                  <img src={require('../../notePreview/images/print.png')} className="pre_print different"/>
                  <p className="different">申请印刷</p>
                </div>
              : null}
              {/*<div className="preview_footer_cart" onClick={this.handelAddCart.bind(this)}>
                <img src={require('../images/pre_cart.png')} className="pre_cart"/>
                <p>加入印刷车</p>
              </div>*/}
              {/*<div className="preview_footer_pay" onClick={this.handelPay.bind(this)}>
                <img src={require('../images/pre_pay.png')} className="pre_pay"/>
                <p>立即购买</p>
              </div>*/}
            </div>
            :
            null

        }

        {this.state.openCreate ?
          <div className="weui_mask" style={{zIndex:'100'}} onClick={this.handelCloseBook.bind(this)}>
            <div className="preview_myCreate showFlag">
              <a className="preview_myCreate_in showFlag" href="/calendar/index">我也做一本</a>
            </div>
          </div>
          :null
        }

        {this.state.openShare ?
          <div className="weui_mask different" style={{zIndex:'10000'}} onClick={this.handelCloseShare.bind(this)}>
            <img src={require('../images/pod_share.png')} className="pod_share different"/>
          </div>
        :null}
        {this.state.openCart ?
          <CartDialog
            handelClose={this.handelClose.bind(this)}
            textContent={this.state.textContent}
            textBtn={this.state.textBtn}
          />
          : null}
        {this.state.showAlert ?
          <AlertMsg
            alertImg={require('../../edit/images/alertWarn.png')}
            alertMsg={this.state.alertMsg}
            timeing={2000}
            handelAlertMsg={this.handelAlertMsg.bind(this)}/>
          :null}
        {this.state.openPrint ?
          <PrintDialog
            handelPrint={this.handelPrint.bind(this)}
            handelAddCart={this.handelAddCart.bind(this)}
            handelPay={this.handelPay.bind(this)}
            podStore={podStore}
            bookHb={bookHb}
            bookId={this.bookId}
            printPriceStore={printPriceStore}

          />
          : null}
        {this.state.showBookTip ?
          <MyBookTip
            handelBooks={this.handelBooks.bind(this)}
            handelCook={this.handelCook.bind(this)}/>
          :null
        }
        {this.state.bookNo ? <BookNotPrint handelNoBook={this.handelNoBook.bind(this)}/> : null}
        {this.state.imgBlur ?
          <ImgBlurTip
            handelCloseBlur={this.handelCloseBlur.bind(this)}
            handSaveBook={this.handelPrint.bind(this)}
            goWhichPage={this.goWhichPage.bind(this)}
            indexList={[]}
            blurList={this.state.blurList}/> : null}
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log('state',state)
  return {
    podStore:state.podStore,
    printChoiceStore:state.printChoiceStore,
    printPriceStore:state.printPriceStore
  }
}

export default connect(mapStateToProps)(PreviewPage)