/**
 * 文件说明:
 * 详细描述:台历预览
 * 创建者: 韩波
 * 创建时间: 2016/10/20
 * 变更记录:
 */

import React from 'react';
var enableInlineVideo = require('iphone-inline-video');
class PrevCalendar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ratioWidht:1,
      ratioHeight:1,
      play:false,

    }
  }

  componentDidMount(){
    let that = this;
    if(document.getElementById('videoP')){
      document.getElementById('videoP').addEventListener("x5videoexitfullscreen", function(){
        that.setState({
          play:false
        })
      });

      document.getElementById('videoP').addEventListener("x5videoenterfullscreen", function(){
        that.setState({
          play:false
        })
      });
    }
  }

  //判断图片是jpg格式添加压缩参数
  handImgCrop(ops){

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

  //绘制台历外层box
  handPgeHtml(){
    const bookStyle = this.props.bookStyle;
    const pageStore = this.props.pageStore;
    let size = 73;
    if(this.props.bookHb){
      size = 100
    }
    //书尺寸
    const pageBox = {
      'width':bookStyle.book_width * this.state.ratioWidht /size +'rem',
      'height':bookStyle.book_height * this.state.ratioHeight/size +'rem',
      'position': 'relative'
    };
    //设置内页
    const pageCenterBox = {
      'position': 'absolute',
      'width':bookStyle.content_width * this.state.ratioWidht/size +'rem',
      'height':bookStyle.content_height * this.state.ratioHeight/size +'rem',
      'left':bookStyle.content_padding_left * this.state.ratioWidht/size +'rem',
      'top':bookStyle.content_padding_top * this.state.ratioHeight/size +'rem'
    };
    const pageStyle = {
      'width':bookStyle.content_width * this.state.ratioWidht/size +'rem',
      'height':bookStyle.content_height * this.state.ratioHeight/size +'rem',
      'backgroundColor':pageStore.page_color || '#fff',
      'backgroundImage':pageStore.page_image ? 'url('+pageStore.page_image+'@70Q)' : 'none',
      'backgroundSize':'100% 100%',
      'backgroundRepeat':pageStore.page_image ? 'no-repeat' : ''
    };
    let imgHead = {
      width:(bookStyle.book_width * this.state.ratioWidht - 20)/size +'rem'
    };
    let imgLeft = {
      left:10/size +'rem'
    };
    let imgFoot = {
      width:pageCenterBox.width,
      height:'0.15rem'
    };
    let imgTop = {
      top:pageCenterBox.height
    };
    const centerHtml = this.handPageCenter();
    let pageHtml = <div style={pageBox} className="calendar_pre_box">
      <div className="calendar_pre_box0" style={imgLeft}>
        <img src={require('../images/preTitle.png')} style={imgHead}/>
      </div>
      <div style={pageCenterBox}>
        <div style={pageStyle}>
          {centerHtml}
        </div>
      </div>
      <div className="calendar_pre_box1" style={imgTop}>
        <img src={require('../../edit/images/calendarBgFoot.png')} style={imgFoot}/>
      </div>
    </div>;
    return pageHtml;
  }
  handlePostionXY(imageMetaData,size) {
  //显示区域的大小
  var width = imageMetaData.element_width - imageMetaData.element_content_left - imageMetaData.element_content_right;
  var height = imageMetaData.element_height - imageMetaData.element_content_top - imageMetaData.element_content_bottom;
  //图片的宽高     //旋转就调换宽高
  var oWidth = imageMetaData.image_content_expand.image_height;
  var oHeight = imageMetaData.image_content_expand.image_width;
  //要显示图片的大小
  var scale, x1, y1, ox, oy, oScale;
  // 居中裁剪方式
  if ((oWidth / oHeight) > (width / height)) {// 宽度超过，以高度为准
    scale = (height / oHeight).toFixed(2);
  } else {// 高度超过，以宽度为准
    scale = (width / oWidth).toFixed(2);
  }

  //旋转后的高宽
  var rotated_width = oHeight * scale;
  var rotated_height = oWidth * scale;

  // 0度时候 得到其居中裁剪的值
  if ((oHeight / oWidth) > (width / height)) {// 宽度超过，以高度为准
    oScale = (height / oWidth).toFixed(2);
    oy = 0;
    ox = -(oHeight * oScale - width) / 2;
  } else {// 高度超过，以宽度为准
    oScale = (width / oHeight).toFixed(2);
    ox = 0;
    oy = -(oWidth * oScale - height) / 2;
  }

  //原始的高宽
  var original_width = oHeight * oScale;
  var original_height = oWidth * oScale;

  //计算偏移量
  var dx = (rotated_width - original_width) / 2;
  var dy = (rotated_height - original_height) / 2;
  x1 = -(dx + Math.abs(ox));
  y1 = -(dy + Math.abs(oy));
  return {x: x1, y: y1}
}
  //绘制台历内页
  handPageCenter(){
    const podStore = this.props.podStore || {};
    const pageStore = this.props.pageStore || {};
    const centerStore = pageStore.element_list || [];
    let size = 73;
    if(this.props.bookHb){
      size = 100
    }
    const centerHtml = centerStore.map((res,index)=>{
      //内容区域样式
      let pageStyle ={
        width:res.element_width * this.state.ratioWidht/size +'rem',
        height:res.element_height * this.state.ratioHeight/size +'rem',
        'position': 'absolute',
        'top':res.element_top * this.state.ratioHeight/size +'rem',
        'left':res.element_left * this.state.ratioWidht/size +'rem',
        'backgroundImage':res.element_background ? 'url('+res.element_background+')' : 'none',
        'backgroundSize':'100% 100%',
        'backgroundRepeat':res.element_background ? 'no-repeat' : '',
        'zIndex':res.element_depth,
        'transform':'rotate('+res.element_rotation +'deg)'
      };

      //浮层样式
      let pageStyle1 ={
        width:res.element_width * this.state.ratioWidht/size +'rem',
        height:res.element_height * this.state.ratioHeight/size +'rem',
        'position': 'absolute',
        'top':res.element_top * this.state.ratioHeight/size +'rem',
        'left':res.element_left * this.state.ratioWidht/size +'rem'
      };

      let imageCfig = res.image_content_expand || {};
      let textCfig = res.text_content_expand || {};
      let imgBor =  imageCfig.image_height * imageCfig.image_scale * this.state.ratioHeight/size +'rem';
      let imageRotation = imageCfig.image_rotation ;
      var rotation = imageCfig.image_rotation + this.getOrientationRotation(imageCfig.image_orientation);
      //图片样式
      let imageStyle = {
        width:imageCfig.image_width * imageCfig.image_scale * this.state.ratioWidht/size +'rem',
        height:imgBor,
        'top':((imageCfig.image_padding_top + imageCfig.image_start_point_y)  * this.state.ratioHeight)/size +'rem',
        'left':((imageCfig.image_padding_left + imageCfig.image_start_point_x )  * this.state.ratioWidht)/size +'rem',
        'position': 'absolute'
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
        imageStyle.height = imageCfig.image_width * imageCfig.image_scale * this.state.ratioWidht/size +'rem'
      }
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
        'fontSize':textCfig.font_size * this.state.ratioWidht/size +'rem',
        'lineHeight':textCfig.text_line_height * this.state.ratioHeight/size +'rem',
        'verticalAlign':verticalAlign,
        'letterSpacing':textCfig.letter_spacing * this.state.ratioWidht,
        'textAlign':textAlign,
        'fontWeight':textCfig.isB == "0"?'normal':'bold',
        'fontStyle':textCfig.isI == "0"?'normal':'italic ',
        'textDecoration':textCfig.isU == "0"?'none':'underline'
      };
      //挂件或文字背景
      let imgBox = {
        'position': 'absolute',
        'left':(res.element_content_left * this.state.ratioWidht)/size +'rem',
        'right':(res.element_content_right* this.state.ratioWidht)/size +'rem',
        'top':(res.element_content_top * this.state.ratioHeight)/size +'rem',
        'bottom':(res.element_content_bottom * this.state.ratioHeight)/size +'rem',
        'overflow':'hidden'
      };
      //图片背景
      let imgBox1 = {
        'position': 'absolute',
        'left':res.element_content_left * this.state.ratioWidht/size +'rem',
        'right':res.element_content_right* this.state.ratioWidht/size +'rem',
        'top':res.element_content_top * this.state.ratioHeight / size +'rem',
        'bottom':res.element_content_bottom * this.state.ratioHeight/size +'rem',
        'overflow':'hidden',
        'borderRadius':res.element_border_radius ? res.element_border_radius+'%'  : '',
        'backgroundRepeat':res.element_mask_image ? 'no-repeat' : '',
        'WebkitMaskImage': res.element_mask_image ? 'url('+res.element_mask_image+')' :'',
        'WebkitMaskSize':  res.element_mask_image ? '100%' :''
      };

      //图片
      if(res.element_type == 1 || res.element_type == 8){
       /* if (imageRotation == 90 || imageRotation == 270) {
          if (imageCfig.image_start_point_x1 == 0 && imageCfig.image_start_point_y1 == 0) {
            var offset = this.handlePostionXY(res,size);
            imageStyle.left = (offset.x+ imageCfig.image_padding_left)  * this.state.ratioWidht/size+'rem';
            imageStyle.top = (offset.y+ imageCfig.image_padding_top) * this.state.ratioHeight/size+'rem';
          } else {
            imageStyle.left = (imageCfig.image_start_point_x1 + imageCfig.image_padding_left)* this.state.ratioWidht/size+'rem';
            imageStyle.top = (imageCfig.image_start_point_y1 + imageCfig.image_padding_top) * this.state.ratioHeight/size+'rem';
          }
        }*/
        return (<div key={index}>
          <div style={pageStyle}>
            <div style={imgBox1}>
              <img style={imageStyle} src={this.handImgCrop(imageCfig)} alt=""/>
              {0 ?
                <div className="videoUrlBox different" onClick={(e)=>this.playVideo(e)}>
                  <img className="videoImg different" src={this.state.play ? require('../images/videoStop.png') : require('../images/videoPlay.png')}/>
                </div>:null
              }
              {0 ?
                <div className="different videoPlayBox" style={{width:pageStyle.width,height:pageStyle.height,display:this.state.play?'block':'none'}}>
                  <video
                    id="videoP"
                    className="different videoPlay"
                    muted loop
                    playsinline
                    x-webkit-airplay
                    x5-playsinline
                    x5-video-player-type='h5'
                    x5-video-player-fullscreen='true'
                    x5-video-orientation='portraint'
                    preload="auto"
                    width="1"
                    height="1"
                    autoPlay="autoPlay"
                    src={podStore.video_url} type="video/mp4">
                  </video>
                </div> : null
              }
            </div>
          </div>
        </div>)
      }
      //挂件
      if(res.element_type == 5){
        return (<div  key={index} style={pageStyle}>
          {res.element_deleted == 1 ? null :
            <div  style={imgBox} data-a="1">
              <img style={imageStyle} src={this.handImgCrop(imageCfig)} alt=""/>
            </div>
          }
        </div>)
      }
      //文字
      if(res.element_type == 2){
        if(imageCfig.image_url) {
          return (
            res.element_content == '请输入文字' ? null :
              <div key={index} style={pageStyle}>
              {res.element_deleted == 1 ? null :
                <div style={imgBox}>
                  <img style={imageStyle}
                       src={imageCfig.image_url}
                       alt=""/>
                </div>
              }
            </div>)
        }
      }
    });

    return centerHtml;
  }

  //播放视频
  playVideo(){
    this.setState({
      play:!this.state.play
    },()=>{
      let video = document.querySelector('.videoPlay');
      video.style.width = '100%';
      video.style.height = '100%';
      video.setAttribute('controls',false);
      enableInlineVideo(video);
      if(this.state.play){
        video.play()
      }
    })
  }

  render() {
    let pageHtml = this.handPgeHtml();
    return (
      <div className="pre_calendar_box" style={{'marginTop':this.props.bookHb ? '30%' : ''}} >
        {pageHtml}
      </div>
    )
  }
}
export default PrevCalendar;