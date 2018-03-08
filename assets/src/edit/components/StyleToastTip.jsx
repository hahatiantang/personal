/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2017/9/26
 * 变更记录:
 */

import React from 'react';
import '../less/toastTip.less';
class StyleToastTip extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      msg:props.msg || '请勿将重要内容至于图片边缘'
    }
  }


  render(){
    return(
      <div id="loadingToast" className="weui_loading_toast" style={{'fontSize':'20px'}}>
        <div className="weui_mask_transparent"></div>
        <div className="weui_toast styleToastTip">

          <p className="styleToastFont">{this.state.msg}</p>
        </div>
      </div>
    )
  }
}

export default StyleToastTip;