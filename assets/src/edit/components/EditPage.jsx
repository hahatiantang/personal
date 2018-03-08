/**
 * 文件说明:台历编辑页面
 * 详细描述:
 * 创建者: ycl
 * 创建时间: 2016/10/11
 * 变更记录:
 */
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import URL from 'url';
import moment from 'moment';
import EditCalendar from './EditCalendar.jsx'
import {
  getCalendarData,
  getCalendarTempList,
  styleListAction,
  changeStyle,
  editCalendarStyle,
  editText,
  editCalendarText,
  memoryListAction,
  addMemoryAction,
  memoryHand,
  imageCrop,
  editTemp,
  editCalendarTemp,
  uploadImg,
  imgUpload,
  saveBook
} from '../../redux/dao/dao';
import EditTextDialog from './EditTextDialog.jsx'
import Loading from '../../common/Loading.jsx'
import StyleToastTip from './StyleToastTip.jsx'
import MemoryList from './MemoryList.jsx'
import AlertMsg from '../../common/AlertMsg.jsx'
import NewYearTip from '../../common/NewYearTip.jsx'
import ChangeStyleTip from './ChangeStyleTip.jsx'
import ImgBlurTip from '../../common/ImgBlurTip.jsx'
import Cookies from 'cookies-js';
import _ from 'lodash';
import '../less/edit.less'
class EditPage extends Component {
  constructor(props) {
    super(props);
    this.actions = bindActionCreators({
      getCalendarData,
      getCalendarTempList,
      styleListAction,
      changeStyle,
      editCalendarStyle,
      editText,
      editCalendarText,
      memoryListAction,
      addMemoryAction,
      memoryHand,
      imageCrop,
      editTemp,
      editCalendarTemp,
      uploadImg,
      imgUpload,
      saveBook
    }, props.dispatch);
    this.state = {
      currentIndex: 0,
      side: true,
      textDialog: false,
      showLoading: false,
      openMemory: false,
      showNewTip: false,
      memoryData: [],
      alertMsg: '',
      showAlert: false,
      loadingMsg: '',
      guide_style:false,
      guide_style_tip:false,
      guide_bs: Cookies('guide_bs'),
      guide_add: Cookies('guide_jnr'),
      isTempList: true,
      imgBlur:false,
      blurList:[],
      indexList:[],
      blurTip:false,
      style_type:'temp',
      pageLoading:true
    };
    this.queryObj = URL.parse(window.location.href, true).query || {};
    this.btnActive = '';
    if (this.queryObj.bookId) {
      this.btnActive = true
    } else {
      this.btnActive = false
    }
    console.log('this.queryObj', this.queryObj);
    this.firstGet = false;
  }

  componentDidMount() {
    let podData = '';
    let that = this;
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: wxConfig.appId, // 必填，公众号的唯一标识
      timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
      nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
      signature: wxConfig.signature,// 必填，签名，见附录1
      jsApiList: ['showOptionMenu','hideOptionMenu', 'chooseImage', 'uploadImage','onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ','onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    this.actions.getCalendarData({
      flag:this.queryObj.style || 232,
      id:this.queryObj.bookId || '',
      app_id:this.queryObj.appid || '',
      year:2018
    },{
      success:(res)=>{
        podData = res.data;
        wx.ready(function () {
          if(that.queryObj.style && parseInt(that.queryObj.style) == 251 && that.queryObj.bookId){
            wx.showOptionMenu();
            var shareObj = {
              title: '快看看'+podData.book_author+'的2018健康台历',
              desc: '我定制了2018戴光强健康台历，拥抱健康新生活',
              link: location.origin + '/calendar/preview?bid=' + that.queryObj.bookId + '&share=1',
              imgUrl: podData.book_cover
            };

            var shareObj1 = {
              title: '我定制了2018戴光强健康台历，拥抱健康新生活',
              link: location.origin + '/calendar/preview?bid=' + that.queryObj.bookId + '&share=1',
              imgUrl: podData.book_cover
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
          }
        });
      }
    });
    /*this.actions.styleListAction({
      book_type:this.props.podCreateStore.book_type
    });
    this.handGetPlateList();*/
    if (new Date().getTime() <= 1486223999000) {
      this.showNewYearTip();
    }
    wx.ready(function () {
      console.log(parseInt(that.queryObj.style) == 251,that.queryObj.style,9999);
      if(that.queryObj.style && parseInt(that.queryObj.style) == 251 && that.queryObj.bookId){

      }else{
        wx.hideOptionMenu();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEmpty(nextProps.podCreateStore) && !this.firstGet){
      this.firstGet = true;
      this.actions.styleListAction({
        book_type:nextProps.podCreateStore.book_type
      });
      if(this.queryObj.blur == 1) {
        for (let i = 0; i < nextProps.podCreateStore.content_list.length; i++) {
          let blurData = _.filter(nextProps.podCreateStore.content_list[i].element_list, (item) => {
            return ((parseInt(item.image_content_expand.image_width) < 800 || parseInt(item.image_content_expand.image_height) < 800))&&item.element_type == 1
          });
          if (blurData.length) {
            this.setState({
              currentIndex: i
            },()=>{
              this.handGetPlateList(nextProps.podCreateStore);
            });
            break
          }
        }
      }else{
        this.handGetPlateList(nextProps.podCreateStore);
      }
    }

  }

  //显示新年放假提示
  showNewYearTip() {
    let dayNow = moment(new Date().getTime()).format('YYYY-MM-DD');
    if (Cookies("showYear")) {
      let oldNow = moment(parseInt(Cookies("showYear"))).format('YYYY-MM-DD');
      if (oldNow != dayNow) {
        this.setState({
          showNewTip: true
        })
      }
    } else {
      this.setState({
        showNewTip: true
      })
    }
  }

  //关闭新年放假提示，同时更新时间
  closeNewYearTip() {
    Cookies.set('showYear', new Date().getTime(), {
      expires: Infinity
    });
    this.setState({
      showNewTip: false
    })
  }

  /**
   * 获取板式列表
   */
  handGetPlateList(podStore) {
    this.setState({
      showLoading: true,
      loadingMsg: '数据获取中'
    });
    let podCreateStore = podStore ? podStore : this.props.podCreateStore || {};
    let editStore = podCreateStore.content_list || [];
    let contentId = [];
    contentId.push(editStore[this.state.currentIndex].content_id);
    const tempData = {
      podId: podCreateStore.book_id,
      content_ids: contentId,
      bookType:podCreateStore.book_type,
      type:this.state.currentIndex ? 1 : 0
    };
    this.setState({
      isTempList: false
    });
    this.actions.getCalendarTempList(tempData, {
      success: () => {
        this.setState({
          isTempList: true,
          showLoading: false,
          loadingMsg: ''
        })
      },
      error: () => {
        this.setState({
          isTempList: true,
          showLoading: false,
          loadingMsg: ''
        })
      }
    })
  }

  //正反面
  handSide(flag) {
    if (this.state.side == flag) {
      return
    }
    let trueIndex = this.state.currentIndex;
    if(trueIndex == 0){
      return
    }
    if (flag) {
      if(this.props.podCreateStore.content_list[trueIndex].content_type == 6){
        trueIndex = 0
      }else{
        trueIndex = trueIndex - 1
      }
    } else {
      if(this.props.podCreateStore.content_list[trueIndex].content_type == 3){
        trueIndex = 25
      }else{
        trueIndex = trueIndex + 1
      }
    }
    this.setState({
      side: flag,
      currentIndex: trueIndex
    })
  }

  //上一页下一页
  handelLeftTight(flag) {
    if (!this.state.isTempList) {
      return;
    }

    let podCreateStore = this.props.podCreateStore || {};
    let editStore = podCreateStore.content_list || [];
    let index = this.state.currentIndex;
    if (flag == 'right') {
      if (index == 23 || index == 24) {
        return false;
      }
      this.setState({
        pageLoading:false
      })
      if(editStore[index].content_type == 3){
        index = index + 1
      }else if(index == 25){
        index = 2
      }else{
        index = index + 2
      }
    } else {
      if (index == 0 || index == 25 || index == 2) {
        return false;
      }
      this.setState({
        pageLoading:false
      })
      if(editStore[index].content_type == 6 || index == 1){
        index = index - 1
      }else{
        index = index - 2
      }
    }
    this.setState({
      currentIndex: index,
      blurTip:false
    }, () => {
      console.log(this.state.currentIndex, 'qqqqqqqqqqq');
      this.handGetPlateList();
      this.setState({
        pageLoading:true
      })
    })
  }

  //图片模糊提示
  showBlurTip(){
    this.setState({
      blurTip:!this.state.blurTip
    })
  }

  //月份显示
  handelMonthName(pageStore){
    let name = '';
    if(pageStore.content_type == 6){
      name = '封底'
    }else if(pageStore.content_type == 3){
      name = '封面'
    }else{
      let template_file_name = pageStore.template_file_name || '';
      name = template_file_name.substring(0,2);
      if(parseInt(name) > 9){

      }else{
        name = name.substring(0,1)
      }
      name = name + '月';
    }

    return name;
  }

  /**
   * 切换板式
   */
  handTogglePlate(index) {
    /*if(!Cookies('guide_style_tip')){
      Cookies.set('guide_style_tip', true, {
        expires: Infinity
      });
      this.setState({
        guide_style_tip:true
      },()=>{
        setTimeout(()=>{
          this.setState({
            guide_style_tip:false
          })
        },3000)
      });
      return;
    }*/
    let TempStore = this.props.calendarTempListStore;
    let selectIndex = index + 1;
    let tempIndex = selectIndex > 1 && selectIndex >= TempStore.length ? 0 : selectIndex;
    let data = {
      id: TempStore[tempIndex].template_id,
      podId: this.props.podCreateStore.book_id,
      content_list: [this.props.podCreateStore.content_list[this.state.currentIndex]],
      type:this.state.currentIndex ? 1 : 0,
      bookStyle:this.props.podCreateStore.book_style
    };
    this.setState({
      showLoading: true,
      loadingMsg: '板式切换中',
      style_type:'temp'
    });
    this.actions.editTemp(data, {
      success: (res) => {
        console.log('res', res);
        this.handStore('editTemp', res, this.state.currentIndex);
        let guide_style = false;
        if(!Cookies('guide_style_tip')){
          guide_style = true
        }
        this.setState({
          showLoading: false,
          loadingMsg: '',
          guide_style:guide_style
        })
      },
      error: () => {
        this.setState({
          showLoading: false,
          loadingMsg: '',
          style_type:''
        })
      }
    });
    console.log('data', data)
  }

  //切换风格提醒
  handelChangeStyleTip(index){
    if(!Cookies('guide_style')){
      this.setState({
        guide_style:true
      })
    }else{
      this.handelChangeStyle(index)
    }
  }

  //风格提示 我知道了
  handelIKnow(){
    /*Cookies.set('guide_style', true, {
      expires: Infinity
    });*/
    this.setState({
      guide_style: false
    })
  }

  //切换版式或者风格  cookie设置
  handelSetCookie(flag,type){
    if(flag == 'temp'){
      Cookies.set('guide_style_tip', type, {
        expires: Infinity
      });
    }else if(flag == 'style'){
      Cookies.set('guide_style', type, {
        expires: Infinity
      });
    }
  }

  //切换风格
  handelChangeStyle(index){
    let styleStore = this.props.calendarStyleListStore;
    let selectIndex = index + 1;
    if(selectIndex >= styleStore.length){
      selectIndex = 0
    }
    let tempArr = [];
    this.props.podCreateStore.content_list.map((list,index)=>{
      if(index > 0 && index < 25 && list.page_type){
        tempArr.push(list.template_file_name)
      }
    });
    let data = {
      book_type:this.props.podCreateStore.book_type,
      book_style:styleStore[selectIndex].moban_id,
      template_file_name:tempArr.join(',')
    };
    this.setState({
      showLoading: true,
      loadingMsg: '风格切换中',
      style_type:'style'
    });
    this.actions.changeStyle(data, {
      success: (res) => {
        this.handStore('editStyle',res,data);
        let guide_style = false;
        if(!Cookies('guide_style')){
          guide_style = true
        }
        this.setState({
          showLoading: false,
          loadingMsg: '',
          guide_style:guide_style
        })
      },
      error: () => {
        this.setState({
          showLoading: false,
          loadingMsg: '',
          style_type:''
        })
      }
    });
  }

  //编辑文字弹出层
  handEditTextDialog(txtConfig) {
    this.setState({
      textConfig: txtConfig
    }, () => {
      this.setState({
        textDialog: true
      })
    })
  }

  //关闭修改文字弹出层
  closeTextDialog() {
    this.setState({
      textDialog: false
    })
  }

  //编辑文字
  handelTextEdit(textConfig, index) {
    let calendarData = this.props.podCreateStore;
    let textData = {
      id: calendarData.book_id,
      text: textConfig.element_list.element_content || '请输入文字',
      tempId: calendarData.template_id,
      tempInfo: textConfig.element_list
    };
    this.setState({
      showLoading: true,
      loadingMsg: '书名修改中'
    });
    this.actions.editText(textData, {
      handelSuccess: (res) => {
        this.setState({
          showLoading: false,
          loadingMsg: ''
        });
        this.handStore('editText', res.data.element_model, index, this.state.currentIndex)
      },
      handelError: (err) => {
        this.setState({
          showLoading: false,
          loadingMsg: ''
        });
      }
    });
  }

  //月份判断
  handelMonth(month) {
    let num = month.substring(0, 2);
    if (parseInt(num) > 9) {

    } else {
      num = num.substring(0, 1)
    }
    return num;
  }

  //纪念日返回
  handelBackMemory() {
    this.setState({
      openMemory: false,
      memoryData: []
    });
  }

  //弹框提示
  handelAlertMsg(type, msg) {
    this.setState({
      showAlert: type,
      alertMsg: msg
    });
  }

  //日期判断
  handelDate(date) {
    let num = date.substring(date.length - 2, date.length);
    if (parseInt(num) > 9) {

    } else {
      num = num.substring(num.length - 1, num.length)
    }
    return num;
  }

  //添加纪念日
  handelAddMemory() {

    let month = parseInt(this.handelMonth(this.props.podCreateStore.content_list[this.state.currentIndex].template_file_name));
    let data = {
      month: month
    };
    if (this.btnActive) {
      data.calendarId = this.queryObj.bookId
    } else {
      data.podId = this.props.podCreateStore.book_id
    }
    this.actions.memoryListAction(data, {
      handelSu: (res) => {
        let originData = [{
          month: month,
          day: 1,
          intro: '',
          key: true
        }];
        if (!_.isEmpty(res.data.datas)) {
          originData = res.data.datas
        }

        this.setState({
          memoryData: originData,
          openMemory: true
        })
      },
      handelError: (err) => {

      }
    });
  }

  //纪念日数据处理
  handelMemoryData(res, saveData, deleteKey) {
    this.handelMemRound1(deleteKey);
    this.handelMemRound2(deleteKey);
    this.handelMemoryData1(res.data.back);
    this.handelMemoryData2(saveData);
    this.handelMemoryData3(res.data.front);
  }

  //纪念日删除反面数据处理
  handelMemRound1(deleteKey) {
    let calendarData = this.props.podCreateStore;
    let currentIndex = this.state.currentIndex;
    if (this.state.side) {
      currentIndex = currentIndex + 1
    } else {

    }
    for (let i = 0; i < deleteKey.length; i++) {
      calendarData.content_list[currentIndex].element_list.map((list, index) => {
        if (list.element_type == 2 && list.element_name.substring(0,4) == 'word') {
          let num = parseInt(this.handelDate(list.element_name));
          if (num == deleteKey[i].day) {
            let dataObject = {
              index: index,
              flag: 1,
              side: 1
            };
            this.handStore('memory', dataObject, currentIndex);
          }
        }
      });
    }
  }

  //纪念日删除正面数据处理
  handelMemRound2(deleteKey) {
    let calendarData = this.props.podCreateStore;
    let currentIndex = this.state.currentIndex;
    if (this.state.side) {

    } else {
      currentIndex = currentIndex - 1
    }
    for (let i = 0; i < deleteKey.length; i++) {
      calendarData.content_list[currentIndex].element_list.map((list, index) => {
        if (list.element_type == 5) {
          let num = '';
          if (list.element_name.substring(0, 5) == 'month'
            || list.element_name.substring(0, list.element_name.length) == 'pendant101'
            || list.element_name.substring(0,list.element_name.length).indexOf('otherP') < 0) {

          } else {
            num = parseInt(this.handelDate(list.element_name));
          }
          if (num == deleteKey[i].day) {
            let dataObject = {
              index: index,
              flag: 1,
              side: 2
            };
            this.handStore('memory', dataObject, currentIndex);
          }
        }
      });
    }
  }

  //纪念日保存数据处理
  handelMemoryData1(back) {
    let currentIndex = this.state.currentIndex;
    if (this.state.side) {
      currentIndex = currentIndex + 1
    } else {

    }
    let dataObject = {
      backData: back,
      flag: 2,
      side: 1
    };
    this.handStore('memory', dataObject, currentIndex);
  }

  handelMemoryData2(saveData) {
    let currentIndex = this.state.currentIndex;
    if (this.state.side) {

    } else {
      currentIndex = currentIndex - 1
    }
    let dataObject = {
      saveData: saveData,
      flag: 2,
      side: 2
    };
    this.handStore('memory', dataObject, currentIndex);
  }

  handelMemoryData3(front) {
    let currentIndex = this.state.currentIndex;
    if (this.state.side) {

    } else {
      currentIndex = currentIndex - 1
    }
    let dataObject = {
      frontData: front,
      flag: 2,
      side: 3
    };
    this.handStore('memory', dataObject, currentIndex);
  }

  //操作数据保存
  handStore(type, data, index, currentIndex) {
    switch (type) {
      //更换文本内容
      case 'editText':
        this.actions.editCalendarText(data, index, currentIndex);
        break;
      //更换版式
      case 'editTemp':
        this.actions.editCalendarTemp(data, index);
        break;
      //更换风格
      case 'editStyle':
        this.actions.editCalendarStyle(data,index);
        break;
      //图片裁剪
      case 'crop':
        console.log('data', data);
        this.actions.imageCrop(data, index, this.state.currentIndex);
        break;
      //图片上传
      case 'imgUpload':
        this.actions.imgUpload(data, index, currentIndex);
        break;
      case 'save':
        this.saveOption(type);
        break;
      //完成
      case 'finish':
        this.saveOption(type);
        break;
      //编辑纪念日
      case 'memory':
        this.actions.memoryHand(data, index);
        break;
    }
  }

  handUploadImg(files, imageCfig, index, coverIndex) {
    /*
     let action = this.centerCutting(files,imageCfig,index,coverIndex);
     this.handStore('imgUpload',action,index,coverIndex)*/
    if (files[0].type != 'image/jpeg' && files[0].type != 'image/jpg' && files[0].type != 'image/png') {
      //this.openAlertMsg("上传图片只支持jpg或png格式！");
      this.handelAlertMsg(true, '上传图片只支持jpg或png格式！');
      return;
    }

    if (parseInt(files[0].size) > 10485760) {
      //this.openAlertMsg("请选择小于10M图片！");
      this.handelAlertMsg(true, '请选择小于10M图片！');
      return;
    }

    this.setState({
      showLoading: true,
      loadingMsg: '图片上传中……'
    });
    this.actions.uploadImg({
      name: 'image',
      file: files[0],
      fields: [{name: 'type', value: 'times'}]
    }, {
      handSuc: (res) => {
        let action = this.centerCutting(res.data, imageCfig, index, coverIndex);
        this.handStore('imgUpload', action, index, coverIndex)
        this.setState({
          showLoading: false,
          loadingMsg: ''
        });
        console.log('图片上传成功', res);
      }, handErr: (err) => {
        this.setState({
          showLoading: false,
          loadingMsg: ''
        })
        this.handelAlertMsg(true, '图片上传失败，请重新上传！');
        //this.openAlertMsg("图片上传失败，请重新上传！");
      }
    })
  }

  /**
   *图片居中裁剪
   * @param action
   * @param imageList
   * @returns {*}
   */
  centerCutting(action, imageList) {
    console.log('居中裁剪', action)
    var imgData = {
      image_url: action.url,
      image_width: action.width,
      image_height: action.height,
      image_orientation: action.rotate
    };
    var imgScale;
    if (action.width > 4096 && action.height < 4096) {
      imgScale = 4096 / action.width;
      imgData.image_width = 4096;
      imgData.image_height = action.height * imgScale;
    }
    if (action.width < 4096 && action.height > 4096) {
      imgScale = 4096 / action.height;
      imgData.image_width = action.width * imgScale;
      imgData.image_height = 4096;
    }
    if (action.width > 4096 && action.height > 4096) {
      if (action.width > action.height) {
        imgScale = 4096 / action.width;
        imgData.image_width = 4096;
        imgData.image_height = action.height * imgScale;
      } else {
        imgScale = 4096 / action.height;
        imgData.image_width = action.width * imgScale;
        imgData.image_height = 4096;
      }
    }
    let imgWidth = imgData.image_width;
    let imgHeight = imgData.image_height;
    if (parseInt(imgData.image_orientation) == 8 || parseInt(imgData.image_orientation) == 6) {
      imgWidth = imgData.image_height;
      imgHeight = imgData.image_width;
    }
    var scale;
    var feste = imgWidth / imgHeight;
    var cenWidth = imageList.element_width - (imageList.element_content_left + imageList.element_content_right);
    var cenHeight = imageList.element_height - (imageList.element_content_top + imageList.element_content_bottom);
    var hinten = cenWidth / cenHeight;
    if (feste < hinten) {
      scale = cenWidth / imgWidth;
      var imgTop = (imgHeight * scale - cenHeight) / 2;
      imgData.image_start_point_y = Math.floor(-imgTop);
      imgData.image_start_point_x = 0;
    } else {
      scale = cenHeight / imgHeight;
      var imgLeft = (imgWidth * scale - cenWidth) / 2;
      imgData.image_start_point_x = Math.floor(-imgLeft);
      imgData.image_start_point_y = 0;
    }
    imgData.image_scale = scale.toFixed(4);

    console.log('action211', action);
    console.log('action222', imageList);
    return imgData;
  }

  /* centerCutting (action,imageList) {
   console.log('居中裁剪',action)
   var imgData = {
   image_url:action.url,
   image_width:action.width,
   image_height:action.height,
   image_orientation:action.rotate
   };
   var scale;
   let imgWidth = action.width,imgHeight=action.height;
   if(action.rotate ==6 || action.rotate ==8){
   imgWidth = action.height;
   imgHeight = action.width;
   }
   var feste = imgWidth / imgHeight;
   var cenWidth = imageList.element_width - (imageList.element_content_left + imageList.element_content_right);
   var cenHeight = imageList.element_height - (imageList.element_content_top + imageList.element_content_bottom);
   var hinten = cenWidth/cenHeight;
   if(feste < hinten){
   scale = cenWidth/imgWidth;
   var imgTop = (imgHeight * scale - cenHeight) /2;
   imgData.image_start_point_y = -imgTop;
   imgData.image_start_point_x = 0;
   }else{
   scale = cenHeight/imgHeight;
   var imgLeft = (imgWidth * scale - cenWidth) /2;
   imgData.image_start_point_x = -imgLeft;
   imgData.image_start_point_y = 0;
   }
   imgData.image_scale = scale;

   console.log('action211',action);
   console.log('action222',imageList);
   return imgData;
   }*/

  //关闭图片模糊弹窗
  handelCloseBlur(){
    this.setState({
      imgBlur:false
    })
  }

  //去第几页
  goWhichPage(pages){
    this.setState({
      currentIndex:pages
    },()=>{
      this.handGetPlateList()
    })
  }

  //完成前操作
  handelBefSave(){
    let indexList = [],secondList = [];
    this.props.podCreateStore.content_list.map((list,index)=>{
      if(list.page_type == 1){
        list.element_list.map((item,index1)=>{
          if(item.element_type == 1){
            if(!item.image_content_expand.image_url){
              let errList = {
                index:index,
                cenIndex:index1
              };
              indexList.push(errList);
            }
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
    if(indexList.length){
      this.setState({
        indexList:indexList,
        imgBlur:true
      });
      return;
    }else{
      this.setState({
        indexList:[]
      });
    }
    if(secondList.length){
      this.setState({
        blurList:secondList,
        imgBlur:true
      });
      return
    }else{
      this.setState({
        blurList:[]
      });
    }
    this.handSaveBook();
  };

  handSaveBook() {
    let data = {
      from: 3,
      calendarId: this.queryObj.bookId || '',
      json: this.props.podCreateStore,
      activityMd5: this.queryObj.f || '',
      year:2018,
      mediaUrl:'',
      vagueCount:this.state.blurList.length || 0
    };
    this.setState({
      showLoading: true,
      loadingMsg: '内容保存中...'
    });
    this.actions.saveBook(data, {
      handSuc: (res) => {
        console.log('res.data', res.data);
        this.handelBtnClick(true);
        if (this.queryObj.shuangFlag) {
          window.location.href = (location.origin == 'http://wechat.timeface.cn' ? 'http://www.timeface.cn' : 'http://stg2.v5time.net')
          + '/activies/calendardiscount/content?bid=' + res.data
          + (this.queryObj.appId ? '&appId=' + this.queryObj.appId : '')
          + (this.queryObj.f ? '&f=' + this.queryObj.f : '');

        } else {
          window.location.href = '/calendar/preview?bid=' + res.data;
        }
        this.setState({
          showLoading: false,
          loadingMsg: ''
        });
      },
      handErr: (err) => {
        this.setState({
          showLoading: false,
          loadingMsg: ''
        });
        this.handelAlertMsg(true,'保存失败，请重新保存！')

      }
    })
  }

  //保存、完成按钮的点击事件
  handelBtnClick(flag) {
    this.btnActive = flag
  }

  handClickGuide(type) {

    if (type == 'bs') {
      Cookies.set('guide_bs', true, {
        expires: Infinity
      });
      this.setState({
        guide_bs: true
      })
    }
    if (type == 'jnr') {
      Cookies.set('guide_jnr', true, {
        expires: Infinity
      });
      this.setState({
        guide_add: true
      })
    }
  }

  //loading页面的控制
  handelLoading(flag,msg){
    this.setState({
      showLoading:flag,
      loadingMsg:msg
    })
  }

  render() {
    let podCreateStore = this.props.podCreateStore || {};
    let editStore = podCreateStore.content_list || [];
    let calendarTempListStore = this.props.calendarTempListStore;
    let calendarStyleListStore = this.props.calendarStyleListStore || [];
    let tempIndex = _.findIndex(calendarTempListStore, (store) => {
      let current = this.state.currentIndex;
      if(current < 25 && !this.state.side){
        current = current - 1
      }
      return store.template_id == editStore[current].template_id;
    });
    let styleIndex = _.findIndex(calendarStyleListStore, (store) => {
      return store.moban_id == podCreateStore.book_style;
    });

    let bookStyle = {
      book_width: podCreateStore.book_width,
      book_height: podCreateStore.book_height,
      content_width: podCreateStore.content_width,
      content_height: podCreateStore.content_height,
      content_padding_left: podCreateStore.content_padding_left,
      content_padding_top: podCreateStore.content_padding_top
    };

    let monthName = editStore.length ? this.handelMonthName(editStore[this.state.currentIndex]) : '';
    let  bookSize = 73;
    let guideTop = {};
    let bookHb = true;
    if(bookStyle.book_width > bookStyle.book_height){
      bookHb = true;
      guideTop = {
        position : 'fixed',
        bottom:'0.4rem'
      }
    }else{
      bookHb=false;
      guideTop.top = 0.8+0.72+0.5+(podCreateStore.book_height/bookSize)+0.8+0.78-3.54+'rem';
    }

    return (
      _.isEmpty(podCreateStore) ? <div className="loadingMan"></div> :
      <div>
        {!this.state.guide_bs ?
          <div className="tf_guide">
            {!this.state.guide_bs ?
            <div className="tf_guide_box" style={guideTop}>
              <img className="qhbs" src={require('../images/qhbs.png')} alt=""/>
              <span className="qhbs_click" onClick={this.handClickGuide.bind(this, 'bs')}/>
              <div className="qhbs_btn">切换板式({tempIndex + 1 + '/' + calendarTempListStore.length})</div>
            </div>: null}
          </div> : null
        }
        <div className="edit_box">
          <div className="edit_tab">
            <div className="edit_tab_box">
              <div
                className={this.state.side ? "sideLeft default" : "sideLeft"}
                onClick={this.handSide.bind(this, true)}>
                {this.state.currentIndex == 0 || this.state.currentIndex == 25 ? '封面' : '正面'}
              </div>
              <div
                className={this.state.side ? "sideRight" : "sideRight default"}
                onClick={this.handSide.bind(this, false)}
                style={{opacity:this.state.currentIndex == 0 ? '0.2' : '1'}}>
                {this.state.currentIndex == 0 || this.state.currentIndex == 25 ? '封底' : '反面'}
              </div>
            </div>
          </div>
          {
            this.state.pageLoading ? <EditCalendar
              pageStore={editStore[this.state.currentIndex]}
              handUploadImg={this.handUploadImg.bind(this)}
              currentIndex={this.state.currentIndex}
              blurTip={this.state.blurTip}
              guide_bs={this.state.guide_bs}
              guide_add={this.state.guide_add}
              bookStyle={bookStyle}
              showBlurTip={this.showBlurTip.bind(this)}
              handClickGuide={this.handClickGuide.bind(this)}
              handEditTextDialog={this.handEditTextDialog.bind(this)}
              handelLeftTight={this.handelLeftTight.bind(this)}
              handStore={this.handStore.bind(this)}
              bookHb={bookHb}
              bookType={podCreateStore.book_type}>
            </EditCalendar>:null
          }
          <div className="month">
            <div className="month_box">
              <div onClick={this.handelLeftTight.bind(this, 'left')}>
                <img src={require('../images/previou.png')}
                     style={{opacity:this.state.currentIndex == 0 || this.state.currentIndex == 2 || this.state.currentIndex == 25 ? '0.2' : '1'}}/>
              </div>
              <span>{monthName}</span>
              <div onClick={this.handelLeftTight.bind(this, 'right')}>
                <img src={require('../images/next.png')}
                     style={{opacity:this.state.currentIndex == 23 || this.state.currentIndex == 24 ? '0.2' : '1'}}/>
              </div>
            </div>
          </div>
          <div className={bookHb ? "calendar_footer_hb calendar_footer" : "calendar_footer"}>
            <button
              disabled={this.state.side && this.state.isTempList ? '' : 'disabled'}
              style={{opacity:this.state.side ? '1':'0.6'}}
              className={this.state.currentIndex == 0 || this.state.currentIndex == 25 ? "calendar_btn_first" : "calendar_btn"}
              onClick={this.handTogglePlate.bind(this, tempIndex)}>
              切换板式({tempIndex + 1 + '/' + calendarTempListStore.length})
            </button>
            {this.state.currentIndex != 0 && this.state.currentIndex != 25 ?
              <button className="calendar_btn"
                      onClick={this.handelChangeStyle.bind(this,styleIndex)}>
                切换风格({styleIndex + 1 + '/' + calendarStyleListStore.length})
              </button> : null
            }
            {this.state.currentIndex != 0 && this.state.currentIndex != 25 ?
              <button className="calendar_mem"
                      onClick={this.handelAddMemory.bind(this)}>加纪念日
              </button> : null
            }
            <button
              className={this.state.currentIndex == 0 || this.state.currentIndex == 25 ? 'calendar_save_first' : 'calendar_save'}
              onClick={this.handelBefSave.bind(this)}>
              完成
            </button>
          </div>


          {
            this.state.textDialog ? <EditTextDialog
                textConfig={this.state.textConfig}
                handelTextEdit={this.handelTextEdit.bind(this)}
                closeTextDialog={this.closeTextDialog.bind(this)}/> : null
          }

          {
            this.state.showLoading ? <Loading msg={this.state.loadingMsg}/> : null
          }

        </div>

        {this.state.openMemory ?
          <MemoryList
            memoryData={this.state.memoryData}
            handelMemoryData={this.handelMemoryData.bind(this)}
            queryObj={this.queryObj}
            actions={this.actions}
            podCreateStore={podCreateStore}
            currentIndex={this.state.currentIndex}
            side={this.state.side}
            handelBackMemory={this.handelBackMemory.bind(this)}
            handelBtnClick={this.handelBtnClick.bind(this)}
            handelDate={this.handelDate.bind(this)}
            handelLoading={this.handelLoading.bind(this)}
            handelAlertMsg={this.handelAlertMsg.bind(this)}/>
          : null}
        {this.state.showAlert ?
          <AlertMsg
            alertImg={require('../images/alertWarn.png')}
            alertMsg={this.state.alertMsg}
            timeing={2000}
            handelAlertMsg={this.handelAlertMsg.bind(this)}/>
          : null}
        {this.state.showNewTip ? <NewYearTip closeNewYearTip={this.closeNewYearTip.bind(this)}/> : null}
        {this.state.guide_style ? <ChangeStyleTip
            style_type={this.state.style_type}
            handelSetCookie={this.handelSetCookie.bind(this)}
            handelIKnow={this.handelIKnow.bind(this)}/> : null}
        {this.state.guide_style_tip ? <StyleToastTip/> : null}
        {this.state.imgBlur ?
          <ImgBlurTip
            handelCloseBlur={this.handelCloseBlur.bind(this)}
            handSaveBook={this.handSaveBook.bind(this)}
            goWhichPage={this.goWhichPage.bind(this)}
            indexList={this.state.indexList}
            blurList={this.state.blurList}/> : null}
      </div>


    )
  }
}

function mapStateToProps(state) {
  console.log('state', state)
  return {
    podCreateStore: state.podCreateStore,
    calendarTempListStore: state.calendarTempListStore,
    calendarStyleListStore: state.calendarStyleListStore,
    editTempStore: state.editTempStore
  }
}

export default connect(mapStateToProps)(EditPage)