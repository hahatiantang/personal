/**
 * 文件说明:
 * 详细描述: 预览提醒
 * 创建者: 韩波
 * 创建时间: 2016/11/17
 * 变更记录:
 */

import React from 'react';
import Cookies from 'cookies-js';
class MyBookTip extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      check : false
    }
  }

  handCancel(){
    this.props.handelBooks(false)
  }

  //选中状态
  handelChecked(){
    this.setState({
      check:!this.state.check
    },()=>{
      this.props.handelCook(this.state.check);
    });
  }

  render(){
    return (
      <div className="weui_dialog_confirm tip_wx_dialog different" style={{fontSize:'0.24rem'}}>
        <div className="weui_mask different"></div>
        <div className="weui_dialog different" style={{width:'70%'}}>
          <div className="weui_dialog_hd tip_ore_dialog different">
            <strong className="weui_dialog_title different">提示</strong>
            <img onClick={this.handCancel.bind(this)} className="close different" src={require('../../index/images/close.png')} alt=""/>
          </div>
          <div className="weui_dialog_bd different">
            <p className="tip_wx_intro different">在公众号回复“我的作品”，可以查看我的所有作品哦~</p>
          </div>
          <div className="weui_dialog_ft different">
            <a onClick={this.handCancel.bind(this)}  className="weui_btn_dialog primary different">我知道了</a>
          </div>
          <div className="weui_dialog_ft_cook different">
            <input className={this.state.check ? "different tip_cook_checkBox tip_cook_check" : "different tip_cook_checkBox"} type="checkbox" onChange={this.handelChecked.bind(this)}/>
            <span className="different">不再提醒</span>

          </div>
        </div>
      </div>
    )
  }
}

export default MyBookTip;