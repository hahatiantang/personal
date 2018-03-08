/**
 * 文件说明:
 * 详细描述:横版台历不允许印刷
 * 创建者: 韩波
 * 创建时间: 2017/8/14
 * 变更记录:
 */


import React from 'react';
class BookNotPrint extends React.Component{
  constructor(props){
    super(props);
  }

  handCancel(){
    this.props.handelNoBook(false)
  }

  render(){
    return (
      <div className="weui_dialog_confirm tip_wx_dialog" style={{fontSize:'0.24rem'}}>
        <div className="weui_mask"></div>
        <div className="weui_dialog" style={{width:'70%'}}>
          <div className="weui_dialog_hd tip_ore_dialog">
            <strong className="weui_dialog_title">提示</strong>
            <img onClick={this.handCancel.bind(this)} className="close" src={require('../../index/images/close.png')} alt=""/>
          </div>
          <div className="weui_dialog_bd">
            <p className="tip_wx_intro">抱歉，2017时光台历（横版）已经售罄，小石榴多谢您的支持，敬请期待2018年新版台历</p>
          </div>
          <div className="weui_dialog_ft">
            <a onClick={this.handCancel.bind(this)}  className="weui_btn_dialog primary">我知道了</a>
          </div>
        </div>
      </div>
    )
  }
}

export default BookNotPrint;