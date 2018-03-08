/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/21
 * 变更记录:
 */

import React from 'react';
import './less/alertMsg.less';
class AlertMsg extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    setTimeout(()=>{
      this.props.handelAlertMsg && this.props.handelAlertMsg(false,'');
    },this.props.timeing);
  }

  render(){
    return (
      <div className="weui_dialog_confirm tf_wx_dialog" id='alertMsg'>
        <div className="weui_mask"></div>
        <div className="weui_dialog" style={{width:'65%'}}>
          <div className="weui-dialog__hd"><img src={this.props.alertImg} className="alertWarn"/></div>
          <div className="weui-dialog__bd">{this.props.alertMsg}</div>
        </div>
      </div>
    )
  }
}

export default AlertMsg;