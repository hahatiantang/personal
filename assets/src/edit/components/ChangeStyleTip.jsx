/**
 * 文件说明:
 * 详细描述:切换风格提醒
 * 创建者: 韩波
 * 创建时间: 2017/9/13
 * 变更记录:
 */

import React from 'react';
class ChangeStyleTip extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      check : false
    }
  }

  handCancel(){
    this.props.handelIKnow()
  }

  handelChecked(){
    this.setState({
      check:!this.state.check
    },()=>{
      this.props.handelSetCookie(this.props.style_type,this.state.check);
    });
  }

  render(){
    return (
      <div className="weui_dialog_confirm tip_style_wx_dialog">
        <div className="weui_mask"></div>
        <div className="weui_dialog">
          <div className="weui_dialog_hd tip_ore_dialog">
            <strong className="weui_dialog_title">提示</strong>
            <img onClick={this.handCancel.bind(this)} className="close" src={require('../../index/images/close.png')} alt=""/>
          </div>
          <div className="weui_dialog_bd">
            <p className="tip_wx_intro">{this.props.style_type == 'style' ? '风格修改将影响所有月份页面哦~' : '请勿将重要内容置于图片边缘'}</p>
          </div>
          <div className="tip_wx_cook">
            <input className={this.state.check ? "tip_wx_checkBox tip_wx_check" : "tip_wx_checkBox"} type="checkbox" onChange={this.handelChecked.bind(this)}/>
            <span>不再提醒</span>
          </div>
          <div className="weui_dialog_ft">
            <a onClick={this.handCancel.bind(this)} className="weui_btn_dialog primary">我知道了</a>
          </div>
        </div>
      </div>
    )
  }
}

export default ChangeStyleTip;