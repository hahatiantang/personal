/**
 * 文件说明:图片裁剪
 * 详细描述:
 * 创建者: ycl
 * 创建时间: 2016/10/18
 * 变更记录:
 */
import React from 'react';
import $ from 'jquery';
require('../js/jquery.cropit')
import '../less/crop.less';
class ImageCrop extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      dialogScale:[69,93,103,232,235].indexOf(props.bookType) > -1 ? 0.5 : 0.72,
      imageData:'',
      imageZoom:props.imgConfig.image_content_expand.image_scale
    }
  }
  componentDidMount(){
    let that = this;
    let imgConfig = this.props.imgConfig;
    let imageUrl = imgConfig.image_content_expand.image_url;
    let imgSeting = imgConfig.image_content_expand;
    let imageCrop = $('#image-cropper');
    let imgRotation = this.getOrientationRotation(imgSeting.image_orientation);
    imageCrop.cropit({
      imageState: {
        src:imageUrl+'@4096w_4096h_1l_50q_1pr_'+imgRotation+'r_2o',
        offset:{
          x:(imgSeting.image_start_point_x)* this.state.dialogScale,
          y:(imgSeting.image_start_point_y)* this.state.dialogScale
        },
        rotation:imgSeting.image_rotation,
        zoom:imgSeting.image_scale* this.state.dialogScale
      },
      allowDragNDrop:false,
      onOffsetChange:function (obj) {
        console.log('obj',obj)
        that.setState({
          imageData:obj
        })
      },
      onZoomChange:function (obj) {
        console.log('aa',obj)
        that.setState({
          imageZoom:obj
        })
      },
      onFileChange:function (obj) {

        console.log('bb',obj)
      }
    });

    $('.rotate-cw-btn').click(function() {
      $('#image-cropper').cropit('rotateCW');
      $('#image-cropper').cropit('offset', { x: 0, y: 0 });
    });
// When user clicks select image button,


// Handle rotation
    /* $('.rotate-cw-btn').click(function() {
     $('#image-cropper').cropit('rotateCW');
     });
     $('.rotate-ccw-btn').click(function() {
     $('#image-cropper').cropit('rotateCCW');
     });*/
  }
//得到图片自身的旋转
  getOrientationRotation(orientation) {
    switch (orientation) {
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
  /*  handImgCropSave(){
   let imageCfig = this.props.imgConfig;
   let imgData = imageCfig.image_content_expand;
   console.log('imageCfig',imageCfig)
   let imageCrop = {
   image_start_point_x:this.state.imageData.x > 0 ? 0:  this.state.imageData.x/ this.state.dialogScale,
   image_start_point_y:this.state.imageData.y > 0 ? 0 : this.state.imageData.y/ this.state.dialogScale,
   image_rotation:this.state.imageData.rotation,
   image_scale:this.state.imageZoom/ this.state.dialogScale
   }
   let cropStyle = {
   width:Math.round((imageCfig.element_width - Math.abs(imageCfig.element_content_left) - Math.abs(imageCfig.element_content_right)) * this.state.dialogScale),
   height:Math.round((imageCfig.element_height - Math.abs(imageCfig.element_content_top) - Math.abs(imageCfig.element_content_bottom))* this.state.dialogScale)
   }
   let sImageW = Math.round(imgData.image_width * this.state.imageZoom);
   let sImageH = Math.round(imgData.image_height * this.state.imageZoom);
   if(Math.abs(this.state.imageData.x) + sImageW > cropStyle.width){
   imageCrop.image_start_point_x = (cropStyle.width-sImageW) / this.state.dialogScale
   }

   if(Math.abs(this.state.imageData.y) + sImageH > cropStyle.height){
   imageCrop.image_start_point_y = (cropStyle.height-sImageH) / this.state.dialogScale
   }
   this.props.handStore('crop',imageCrop,this.props.imageIndex)
   this.props.handCloseImgCropDialog()
   }
   */

  handImgCropSave(){
    let flag = this.props.flag || "";
    let imageCfig = this.props.imgConfig;
    let imgData = imageCfig.image_content_expand;
    console.log('imageCfig',imageCfig)
    let imageCrop = {
      image_start_point_x:this.state.imageData.x >0 ? 0:  this.state.imageData.x/ this.state.dialogScale,
      image_start_point_y:this.state.imageData.y > 0 ? 0 : this.state.imageData.y/ this.state.dialogScale,
      image_rotation:this.state.imageData.rotation,
      image_scale: (this.state.imageZoom/ this.state.dialogScale).toFixed(4)
    }
    let cropStyle = {
      width:Math.round((imageCfig.element_width - Math.abs(imageCfig.element_content_left) - Math.abs(imageCfig.element_content_right))),
      height:Math.round((imageCfig.element_height - Math.abs(imageCfig.element_content_top) - Math.abs(imageCfig.element_content_bottom)))
    }
    //图片缩放后的宽高
    let sImageW = Math.round(imgData.image_width*imageCrop.image_scale);
    let sImageH = Math.round(imgData.image_height*imageCrop.image_scale);
    if(Math.abs(this.state.imageData.x/ this.state.dialogScale) + cropStyle.width > sImageW){
      imageCrop.image_start_point_x = Math.floor(-((sImageW - cropStyle.width)));
      if(Math.floor(-((sImageW - cropStyle.width))) > 0){
        imageCrop.image_start_point_x = 0
      }
    }

    if(Math.abs(this.state.imageData.y/ this.state.dialogScale) + cropStyle.height > sImageH){
      imageCrop.image_start_point_y = Math.floor(-((sImageH - cropStyle.height)));
      if(Math.floor(-((sImageH - cropStyle.height))) > 0){
        imageCrop.image_start_point_y = 0
      }
      console.log(imageCrop.image_start_point_y,sImageH,cropStyle.height,'image_start_point_y')
    }
    this.props.handStore('crop',imageCrop,this.props.imageIndex,flag,this.props.insertPageNumStore);
    this.props.handCloseImgCropDialog()
  }

  render(){
    let imageCfig = this.props.imgConfig;
    let cropStyle = {
      width:(imageCfig.element_width - Math.abs(imageCfig.element_content_left) - Math.abs(imageCfig.element_content_right)) * this.state.dialogScale,
      height:(imageCfig.element_height - Math.abs(imageCfig.element_content_top) - Math.abs(imageCfig.element_content_bottom))* this.state.dialogScale
    };
    console.log(cropStyle,'cropStyle',imageCfig,'imageCfig');
    return(<div className="weui_dialog_confirm tf_wx_dialog" id="ecit_text_dialog" style={{fontSize:'0.24rem'}}>
      <div className="weui_mask"></div>
      <div className="weui_dialog" style={{width:'90%'}}>
        {/*<div className="weui_dialog_hd"><strong className="weui_dialog_title">添加文字</strong></div>*/}
        <div className="weui_dialog_bd">
          <div id="image-cropper">
            <div className="cropit-preview" style={cropStyle}></div>

            <div className="range_box">
              <img src={require('../images/min.png')} alt=""/>
              <input type="range" className="cropit-image-zoom-input" />
              <img src={require('../images/max.png')} alt=""/>
              {/*<img className="rotate-cw-btn" src={require('../images/x.png')} alt=""/>*/}
            </div>

            {/*<input type="file" className="cropit-image-input" />
             <div className="select-image-btn">Select new image</div>*/}
          </div>

        </div>
        <div className="weui_dialog_ft">
          <a href="javascript:;" className="weui-btn weui-btn_primary" onClick={this.handImgCropSave.bind(this)}>确定</a>
        </div>
      </div>
    </div>)
  }
}
export default ImageCrop;