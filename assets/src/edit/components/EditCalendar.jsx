/**
 * 文件说明:
 * 详细描述:页面绘制
 * 创建者: 韩波
 * 创建时间: 2016/10/11
 * 变更记录:
 */
import React from 'react';
import ImageCropDialog from './ImageCropDialog.jsx'
import Dropzone from 'react-dropzone'
class EditCalendar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ratioWidht:1,
      ratioHeight:1,
      imageCropDialog:false,
      imgConfig:'',
      imageIndex:null
    }
  }

  componentDidMount(){
    let hammertime = new Hammer($(".calendar_min_box")[0], {domEvents: true});
    let that = this;
    hammertime.on('swipeleft', function (ev) {
      that.props.handelLeftTight('right')
    });
    hammertime.on('swiperight', function (ev) {
      that.props.handelLeftTight('left')
    });
  }

  //判断图片是jpg格式添加压缩参数
  handImgCrop(ops,res){
    let img_width = ops.image_width*ops.image_scale;
    let img_height = ops.image_height*ops.image_scale;
    let scale;
    if(img_width>4096||img_height>4096){
      scale = img_width/2000;
      img_width = Math.floor(img_width/scale)
      img_height = Math.floor(img_height/scale)
    }else{
      img_width = Math.floor(img_width)
      img_height = Math.floor(img_height)
    }




    if((/\.jpg$|\.jpeg$/i).test(ops.image_url)){
      return ops.image_url +'@'+img_width + 'w_'+img_height + 'h_' + ops.image_rotation + 'r_2o'
    }else{
      return ops.image_url+'@'+img_width + 'w_'+img_height + 'h.png'
    }
  }

  //绘制台历外层box
  handPgeHtml(){
    const bookStyle = this.props.bookStyle;
    const pageStore = this.props.pageStore;
    let bookSize = 73;
    if(this.props.bookHb){
      bookSize = 100
    }
    //书尺寸
    const pageBox = {
      'width':bookStyle.book_width * this.state.ratioWidht /bookSize +'rem',
      'height':bookStyle.book_height * this.state.ratioHeight/bookSize +'rem',
      'position': 'relative'
    };
    //设置内页
    const pageCenterBox = {
      'position': 'absolute',
      'width':bookStyle.content_width * this.state.ratioWidht/bookSize +'rem',
      'height':bookStyle.content_height * this.state.ratioHeight/bookSize +'rem',
      'left':bookStyle.content_padding_left * this.state.ratioWidht/bookSize +'rem',
      'top':bookStyle.content_padding_top * this.state.ratioHeight/bookSize +'rem'
    };
    const pageStyle = {
      'width':bookStyle.content_width * this.state.ratioWidht/bookSize +'rem',
      'height':bookStyle.content_height * this.state.ratioHeight/bookSize +'rem',
      'backgroundColor':pageStore.page_color || '#fff',
      'backgroundImage':pageStore.page_image ? 'url('+pageStore.page_image+'@70Q)' : 'none',
      'backgroundSize':'100% 100%',
      'backgroundRepeat':pageStore.page_image ? 'no-repeat' : ''
    };
    let imgHead = {
      width:(bookStyle.book_width * this.state.ratioWidht - 20)/bookSize +'rem'
    };
    let imgFoot = {
      width:pageCenterBox.width,
      height:'0.15rem'
    };
    let imgLeft = {
      left:10/bookSize +'rem'
    };
    let imgTop = {
      top:pageCenterBox.height
    };
    const centerHtml = this.handPageCenter();
    let pageHtml = <div style={pageBox} className="calendar_min_box">
      <div className="calendar_pre_box0" style={imgLeft}>
        <img src={require('../images/preTitle.png')} style={imgHead}/>
      </div>
      <div style={pageCenterBox}>
        <div style={pageStyle}>
          {centerHtml}
        </div>
      </div>
      <div className="calendar_pre_box1" style={imgTop}>
        <img src={require('../images/calendarBgFoot.png')} style={imgFoot}/>
      </div>
    </div>;
    return pageHtml;
  }
  //编辑文字
  handEditText(res,index){
    let textConfig = {
      element_list:res,
      index:index
    };
    this.props.handEditTextDialog(textConfig);
  }
  //图片弹出层显示
  handImageCrop(imageCfig,index){
    this.setState({
      imgConfig:imageCfig,
      imageIndex:index
    },()=>{
      this.setState({
        imageCropDialog:true
      })
    })
  }


  /**
   *换图
   */
  onDrop(files,imageCfig,index,coverIndex){
    this.props.handUploadImg(files,imageCfig,index,coverIndex);
  }

  handUpload(imageCfig,index,coverIndex){
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        console.log('localIds',localIds);
        wx.uploadImage({
          localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
          success: function (res) {
            var serverId = res.serverId; // 返回图片的服务器端ID
            console.log('serverId',serverId);
            $.ajax({
              type:'POST',
              url:ENVIRONMENT !=  'production' ? 'http://wechat.v5time.net/wxopen/api/uploadWxImage' :
                'http://wechat.timeface.cn/wxopen/api/uploadWxImage',
              data:{'mediaid':serverId},
              dataType:'json',
              success:(res)=>{
                if(res.code == '000'){
                  that.props.handUploadImg(res.data,imageCfig,index,coverIndex);
                }
                console.log('图片上传',res)
              },
              error:()=>{

              }
            })
          }
        });
      }
    });
  }

  //得到图片自身的旋转
  getOrientationRotation(orientation) {
    switch (orientation - 0) {
      case 3:
        return 180;
      case 6:
        return 90;
      case 8:
        return 270;
      default:
        return 0;
    }
  }
  handUploadImage(imageCfig,index,coverIndex){
    var files = document.getElementById("file").files;

    this.props.handUploadImg(files,imageCfig,index,coverIndex);
    $("#file").val("");

  }

  //绘制台历内页
  handPageCenter(){
    let  bookSize = 73;
    if(this.props.bookHb){
      bookSize = 100
    }
    let currentIndex = this.props.currentIndex;
    const pageStore = this.props.pageStore || {};
    const centerStore = pageStore.element_list || [];
    const centerHtml = centerStore.map((res,index)=>{
      //内容区域样式
      let pageStyle ={
        width:res.element_width * this.state.ratioWidht/bookSize +'rem',
        height:res.element_height * this.state.ratioHeight/bookSize +'rem',
        'position': 'absolute',
        'top':res.element_top * this.state.ratioHeight/bookSize +'rem',
        'left':res.element_left * this.state.ratioWidht/bookSize +'rem',
        'backgroundImage':res.element_background ? 'url('+res.element_background+')' : 'none',
        'backgroundSize':'100% 100%',
        'backgroundRepeat':res.element_background ? 'no-repeat' : '',
        'zIndex':res.element_depth
      };

      //浮层样式
      let pageStyle1 ={
        height:res.element_height * this.state.ratioHeight/bookSize + 0.24 + 2.44 +'rem',
        'top':res.element_top * this.state.ratioHeight/bookSize - 0.24 - 2.44 +'rem',
        'left':res.element_left * this.state.ratioWidht/bookSize +'rem'
      };
      let pageStyle2 ={
        width:res.element_width * this.state.ratioWidht/bookSize +'rem',
        height:res.element_height * this.state.ratioHeight/bookSize +'rem',
        bottom:0,
        left:0,
        'position': 'absolute',
      };

      let imageCfig = res.image_content_expand || {};
      let textCfig = res.text_content_expand || {};
      let imgBor =  imageCfig.image_height * imageCfig.image_scale * this.state.ratioHeight/bookSize +'rem';
      var rotation = imageCfig.image_rotation + this.getOrientationRotation(imageCfig.image_orientation);
      let imageRotation = imageCfig.image_rotation + this.getOrientationRotation(imageCfig.image_orientation);
      //图片样式
      let imageStyle = {
        width:imageCfig.image_width * imageCfig.image_scale * this.state.ratioWidht/bookSize +'rem',
        height:imgBor,
        'top':((imageCfig.image_padding_top + imageCfig.image_start_point_y)  * this.state.ratioHeight)/bookSize +'rem',
        'left':((imageCfig.image_padding_left + imageCfig.image_start_point_x )  * this.state.ratioWidht)/bookSize +'rem',
        'position': 'absolute',
        /*'transform': 'rotate(' + imageRotation + 'deg)',
        'MsTransform': 'rotate(' + imageRotation + 'deg)', /!* IE 9 *!/
        'MozTransform': 'rotate(' + imageRotation + 'deg)', /!* Firefox *!/
        'WebkitTransform': 'rotate(' + imageRotation + 'deg)', /!* Safari 和 Chrome *!/
        'OTransform': 'rotate(' + imageRotation + 'deg)'  /!* Opera *!/*/
      };
      if(rotation > 360){
        rotation = rotation - 360
      }
      if(rotation == 90 || rotation == 270){
        imageStyle.width = imgBor
        imageStyle.height = imageCfig.image_width * imageCfig.image_scale * this.state.ratioWidht/bookSize +'rem'
      }
      //挂件或文字背景translate(199.002px, 0px) scale(0.136282) rotate(90deg)
      let imgBox = {
        'position': 'absolute',
        'left':(res.element_content_left * this.state.ratioWidht -0)/bookSize +'rem',
        'right':(res.element_content_right* this.state.ratioWidht-0)/bookSize +'rem',
        'top':(res.element_content_top * this.state.ratioHeight-0)/bookSize +'rem',
        'bottom':(res.element_content_bottom * this.state.ratioHeight-0)/bookSize +'rem',
        'overflow':'hidden'
      };
      let verticalAlign,textAlign;
      if(res.element_type == 2 && !imageCfig.image_url){
        switch (textCfig.text_vertical_align){
          case 1:
            verticalAlign = 'middle';
            break;
          case 2:
            verticalAlign = 'bottom';
            break;
          case 3:
            verticalAlign = 'top';
            break;
          default:
            verticalAlign = 'middle';
            break;
        }
        switch (textCfig.text_align){
          case 1:
            textAlign = 'left';
            break;
          case 2:
            textAlign = 'right';
            break;
          case 3:
            textAlign = 'center';
            break;
          default:
            textAlign = 'left';
            break;
        }
      }
      //文字样式
      let textStyle = {
        'fontFamily':textCfig.font_family,
        'color':textCfig.text_color,
        'fontSize':textCfig.font_size * this.state.ratioWidht/bookSize +'rem',
        'lineHeight':textCfig.text_line_height * this.state.ratioHeight/bookSize +'rem',
        'verticalAlign':verticalAlign,
        'letterSpacing':textCfig.letter_spacing * this.state.ratioWidht,
        'textAlign':textAlign,
        'fontWeight':textCfig.isB == "0"?'normal':'bold',
        'fontStyle':textCfig.isI == "0"?'normal':'italic ',
        'textDecoration':textCfig.isU == "0"?'none':'underline'
      };
      //图片背景
      let imgBox1 = {
        'position': 'absolute',
        'left':res.element_content_left * this.state.ratioWidht/bookSize +'rem',
        'right':res.element_content_right* this.state.ratioWidht/bookSize +'rem',
        'top':res.element_content_top * this.state.ratioHeight / bookSize +'rem',
        'bottom':res.element_content_bottom * this.state.ratioHeight/bookSize +'rem',
        'overflow':'hidden',
        'borderRadius':res.element_border_radius ? res.element_border_radius+'%'  : '',
        'backgroundRepeat':res.element_mask_image ? 'no-repeat' : ''
      };
      let icoStyle = {

      }
      //图片
      if(res.element_type == 1 || res.element_type == 8){
        return (<div className="imgSetting" key={index} >
          <div style={pageStyle} className="imgBox">
            <div style={imgBox1} >
              <img style={imageStyle} src={this.handImgCrop(imageCfig,res)} alt=""/>
              <div className="setting">
                <div className="setting_box">
                  {/*<Dropzone
                    ref="dropzone"
                    accept="image/jpeg,image/png"
                    className="onDrop"
                    multiple={false}
                    onDrop={ (files) => {this.onDrop(files,res,index,currentIndex)}}
                  >
                    <div className="btnBox"><img src={require('../images/formap.png')} alt=""/><span>换图</span></div>
                  </Dropzone>*/}
                  <div className="btnBox" >
                    <img src={require('../images/formap.png')} alt=""/><span>换图</span>
                    <input onChange={this.handUploadImage.bind(this,res,index,currentIndex)} type="file" id="file" />
                  </div>
                  <div className="btnBox" onClick={this.handImageCrop.bind(this,res,index)}>
                    <img src={require('../images/crop.png')} alt=""/><span>裁剪</span></div>
                </div>
              </div>

            </div>
            {(parseInt(imageCfig.image_width) < 800 || parseInt(imageCfig.image_height) < 800) && imageCfig.image_url ?
              <div onClick={this.props.showBlurTip} className="imgBlurTip">
                {this.props.blurTip ? <div className="imgBlurFont">清晰度不足，建议尺寸不低于800x800px，为了好的打印效果请您更换照片</div> : null}
              </div>
              : null}
          </div>
        </div>)
      }
      //挂件
      if(res.element_type == 5){
        return (<div  key={index} style={pageStyle}>
          {res.element_deleted == 1 ? null :
            <div  style={imgBox}>
              <img style={imageStyle} src={this.handImgCrop(imageCfig,res)} alt=""/>
            </div>
          }
        </div>)
      }
      //文字
      if(res.element_type == 2){
        if(imageCfig.image_url) {
          return (<div key={index}>
            <div style={pageStyle}>
              {res.element_deleted == 1 ? null :
                <div style={imgBox} className={res.element_readonly == 1 ? '' : 'textStyle'} onClick={res.element_readonly == 1 ? null : this.handEditText.bind(this,res,index)}>
                  <img className="settingText"
                       style={imageStyle}
                       src={imageCfig.image_url}
                       alt=""/>
                </div>
              }
            </div>
            {this.props.guide_bs && !this.props.guide_add ?
            <div>
              <div className="tf_guide"></div>

              <div className="guide_word" style={pageStyle1}>
                <img className="add_day" src={require('../images/addDay.png')} alt=""/>
                <span className="add_day_click" onClick={this.props.handClickGuide.bind(this, 'jnr')}/>
                <div style={pageStyle2} className="add_day_word" onClick={res.element_readonly == 1 ? null : this.handEditText.bind(this,res,index)}>
                  <img style={imageStyle} src={imageCfig.image_url} alt=""/>
                </div>
              </div>
            </div>

               : null
            }
          </div>)
        }

      }
    });

    return centerHtml;
  }
  handCloseImgCropDialog(){
    this.setState({
      imageCropDialog:false
    })
  }
  render() {
    let pageHtml = this.handPgeHtml();
    return (
      <div className="calendar_box" style={{'marginTop':this.props.bookHb ? '30%': ''}}>
        {pageHtml}
        {
          this.state.imageCropDialog ? <ImageCropDialog
            imgConfig={this.state.imgConfig}
            imageIndex={this.state.imageIndex}
            bookType={this.props.bookHb?232:227}
            handCloseImgCropDialog={this.handCloseImgCropDialog.bind(this)}
            handStore={this.props.handStore.bind(this)}>

          </ImageCropDialog>:''
        }
      </div>
    )
  }
}
export default EditCalendar;