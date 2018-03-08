/**
 * 文件说明:
 * 详细描述:图片模糊弹窗
 * 创建者: 韩波
 * 创建时间: 2017/11/17
 * 变更记录:
 */

import React from 'react';
import './less/imgBlurTip.less'
class ImgBlurTip extends React.Component{
  constructor(props){
    super(props);
  }

  handCancel(){
    if(this.props.blurList.length){
      this.props.handSaveBook(true)
    }
    this.props.handelCloseBlur();
  }

  goPage(){
    let pages = 0;
    if(this.props.indexList.length){
      pages =  this.props.indexList[0].index
    }else if(this.props.blurList.length){
      pages =  this.props.blurList[0].index
    }

    this.props.goWhichPage(pages);
    this.props.handelCloseBlur();
  }

  render(){
    return (
      <div className="weui_dialog_confirm tf_wx_dialog different" id="imgBlur_dialog" style={{fontSize:'0.24rem'}}>
        <div className="weui_mask different"></div>
        <div className="weui_dialog different" style={{width:'70%'}}>
          <div className="imgBlur_dialog_hd different">
            <strong className="weui_dialog_title different">提示</strong>
          </div>
          <div className="weui_dialog_bd different">
            {this.props.indexList.length ?
              <div className="cart_text_tip different">
                <span>您的台历未制作完成，还差</span>
                <span>{13 - this.props.indexList.length}</span>
                <span>张照片。快去添加照片吧！</span>
              </div>
              :
              <div className="cart_text_tip different">
                <span>您提交的作品有</span>
                <span style={{'color': '#FF7700'}}>{this.props.blurList.length}</span>
                <span>张照片尺寸低于800*800，清晰度较低，影响打印效果</span>
              </div>
            }

          </div>
          <div className="weui_dialog_ft different">
            <a href="javascript:;" className="weui_btn weui_btn_dialog weui-btn_primary different" onClick={this.handCancel.bind(this)}>{this.props.indexList.length ? '取消' : '继续提交'}</a>
            <a href="javascript:;" className="weui_btn weui_btn_dialog weui-btn_primary different" onClick={this.goPage.bind(this)}>{this.props.indexList.length ? '去看看' : '更换图片'}</a>
          </div>
        </div>
      </div>
    )
  }
}

export default ImgBlurTip;