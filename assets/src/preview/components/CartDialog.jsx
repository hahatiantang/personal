/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/20
 * 变更记录:
 */

import React from 'react';
import Cookies from 'cookies-js';
class CartDialog extends React.Component{
  constructor(props){
    super(props);
  }

  handCancel(){
    this.props.handelClose();
  }

  goCart(){
    let uid = Cookies('tf-uid');
    let localUrl = '';
    if (/wechat\.timeface/.test(location.href)) {
      localUrl = "http://m.timeface.cn";
    } else{
      localUrl = "http://h5.stg1.v5time.net";
    }
    location.href = localUrl+'/orderService/'+uid+'/cart'+'?from=3'
  }

  render(){
    return (
      <div className="weui_dialog_confirm tf_wx_dialog different" id="cart_dialog" style={{fontSize:'0.24rem'}}>
        <div className="weui_mask different"></div>
        <div className="weui_dialog different" style={{width:'85%'}}>
          <div className="weui_dialog_bd different">
            <div className="cart_text_tip different">
              {this.props.textContent}
            </div>
            
          </div>
          <div className="weui_dialog_ft different">
            <a href="javascript:;" className="weui_btn weui_btn_dialog weui-btn_primary different" onClick={this.handCancel.bind(this)}>继续浏览</a>
            <a href="javascript:;" className="weui_btn weui_btn_dialog weui-btn_primary different" onClick={this.goCart.bind(this)}>{this.props.textBtn}</a>
          </div>
        </div>
      </div>
    )
  }
}

export default CartDialog;