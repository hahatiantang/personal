/**
 * 文件说明:新年公告
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2017/1/23
 * 变更记录:
 */

import React from 'react'
import './less/newYearTip.less';

class NewYearTip extends React.Component{
  constructor(props){
    super(props);
  }
  
  handelClose(){
    this.props.closeNewYearTip()
  }
  
  render(){
    return(
      <div className="newYearTip">
        <div className="newYearBox">
          <p className="newYearBoxF">公告：因春节期间印刷厂和快递公司放假，2017年1
            月12日后所有印品只接单不发货，订单会于2月4日后统一安排印刷配送！
          </p>
          <div className="newYearTipC" onClick={this.handelClose.bind(this)}>
            <img src={require('../index/images/close.png')}/>
          </div>
        </div>
      </div>
    )
  }
}

export default NewYearTip;