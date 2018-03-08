/**
 * 文件说明:公共加载动画
 * 详细描述:
 * 创建者: ycl
 * 创建时间: 2016/10/22
 * 变更记录:
 */

import React from 'react'

class Loading extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      msg:props.msg || '数据加载中'
    }
  }

  componentDidMount(){
    if(this.props.timeing){
      setTimeout(()=>{
        this.props.handelAlertMsg(false,'');
      },this.props.timeing);
    }
  }


  render(){
    return(
      <div id="loadingToast" className="weui_loading_toast" style={{'fontSize':'20px'}}>
        <div className="weui_mask_transparent"></div>
        <div className="weui_toast" style={{zIndex:'220'}}>
          <div className="weui_loading">
            <div className="weui_loading_leaf weui_loading_leaf_0"></div>
            <div className="weui_loading_leaf weui_loading_leaf_1"></div>
            <div className="weui_loading_leaf weui_loading_leaf_2"></div>
            <div className="weui_loading_leaf weui_loading_leaf_3"></div>
            <div className="weui_loading_leaf weui_loading_leaf_4"></div>
            <div className="weui_loading_leaf weui_loading_leaf_5"></div>
            <div className="weui_loading_leaf weui_loading_leaf_6"></div>
            <div className="weui_loading_leaf weui_loading_leaf_7"></div>
            <div className="weui_loading_leaf weui_loading_leaf_8"></div>
            <div className="weui_loading_leaf weui_loading_leaf_9"></div>
            <div className="weui_loading_leaf weui_loading_leaf_10"></div>
            <div className="weui_loading_leaf weui_loading_leaf_11"></div>
          </div>
          <p className="weui_toast_content">{this.state.msg}</p>
        </div>
      </div>
    )
  }
}

export default Loading;