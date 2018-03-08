/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/11/7
 * 变更记录:
 */

import React from 'react';
import '../less/photoBookPreview.less';

class OrderDialog extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      count:1
    }
  }

  handCancel(){
    this.props.handelPrint(false)
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

  goodsNumber(flag){
    let num = this.state.count;
    if(flag){
      if(num == 999){

      }else{
        num++
      }

    }else{
      if(num == 1){

      }else{
        num--
      }
    }
    this.setState({
      count:num
    })
  }

  //手动更改数量
  handelNum(){
    let num = this.refs.carNum.value;
    console.log(num,99);
    if (/^\d+$/.test(num)) {
      if (num > 999) {
        num = 999
      } else if (num < 1) {
        num = 1
      }
    }
    this.setState({
      count:num
    })
  }

  handelBlurNum(){
    let num = this.refs.carNum.value;
    if (!/^\d+$/.test(num)) {
      this.setState({
        count:1
      })
    }
  }

  //立即购买
  handleBuy(){
    this.props.handelPay(this.state.count);
    this.props.handelPrint(false)
  }

  //加入印刷车
  handelCart(){
    this.props.handelAddCart(this.state.count);
    this.props.handelPrint(false);
  }

  render(){
    let podStore = this.props.podStore;

    //价格
    let price = this.props.bookPriceStore && parseInt(this.props.bookPriceStore) || 28.00;

    return (

      <div className="weui_mask different" style={{zIndex:300}}>
        <div className="print_dialog different">
          <div className="print_dialog_box different">
            <div className="print_dialog_close different" onClick={this.handCancel.bind(this)}></div>
            <div style={{marginTop:podStore.book_type == 69 || podStore.book_type == 103 ? 0 : '0.5rem'}} className="print_dialog_imgBox different">
              <div className="print_dialog_top different"></div>
              <img src={podStore.book_cover} className="print_dialog_img different"/>
            </div>
            <div className="print_dialog_font different" style={{marginTop:podStore.book_type == 69 || podStore.book_type == 103 ? '.2rem' : '.6rem'}}>
              <p>{'￥'+this.state.count*price+'.00'}</p>
              <div className="book_money different">
                <a href="javascript:;" style={{verticalAlign:'top'}} className="book_money_sub different" onClick={this.goodsNumber.bind(this,false)}>－</a>
                <input
                  className="book_number different"
                  type="text"
                  ref="carNum"
                  value={this.state.count}
                  onChange={this.handelNum.bind(this)}
                  onBlur={this.handelBlurNum.bind(this)}/>
                <a href="javascript:;" style={{verticalAlign:'top'}} className="book_money_add different" onClick={this.goodsNumber.bind(this,true)}>＋</a>
              </div>
              <p className="print_dialog_maxNum different">
                <span>选择印刷数量</span>
                <span className="maxNum">（上限999本）</span>
              </p>
            </div>
          </div>
          <div className="print_dialog_btn different">
            <div className="print_dialog_cart different" onClick={this.handelCart.bind(this)}>加入印刷车</div>
            <div className="print_dialog_buy different" onClick={this.handleBuy.bind(this)}>立即购买</div>
          </div>
        </div>
      </div>

    )
  }
}

export default OrderDialog;