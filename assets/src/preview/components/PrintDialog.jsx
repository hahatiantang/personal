/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/11/7
 * 变更记录:
 */

import React from 'react';
class PrintDialog extends React.Component{
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
    if(this.props.podStore.book_type == 253){
      num = 1
    }else{
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
    }
    this.setState({
      count:num
    })
  }

  //手动更改数量
  handelNum(){
    let num = this.refs.carNum.value;
    console.log(num,99);
    if(this.props.podStore.book_type == 253){
      num = 1
    }else{
      if (/^\d+$/.test(num)) {
        if (num > 999) {
          num = 999
        } else if (num < 1) {
          num = 1
        }
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
    let price = this.props.printPriceStore && parseInt(this.props.printPriceStore) || 28.00;
    let bottomImg = require('../images/calendarSb.png');
    if(this.props.bookHb){
      bottomImg = require('../images/calendarHb.png');
    }
    return (

      <div className="weui_mask different" style={{zIndex:300}}>
        <div className="print_dialog different">
          <div className="print_dialog_box different">
            <div className="print_dialog_close different" onClick={this.handCancel.bind(this)}></div>
            <div style={{marginTop:this.props.bookHb ? 0 : '-.5rem'}} className="print_dialog_imgBox different">
              <div className="print_dialog_top different"></div>
              <img src={podStore.book_cover+'@80q'} className="print_dialog_img different"/>
              <div className="print_dialog_bottom different">
                <img className="different" src={bottomImg} style={{height:this.props.bookHb ? '.16rem' : '.28rem'}}/>
              </div>
            </div>
            <div className="print_dialog_font different" style={{marginTop:this.props.bookHb ? '.2rem' : '.4rem'}}>
              <p>{'￥'+this.state.count*price+'.00'}</p>
              <div className="book_money different">
                <a href="javascript:;"
                   style={podStore.book_type == 253 ? {border : '1px solid #ccc',color:'#ccc'} : {border : '1px solid #2497f9',color:'#2497f9'}}
                   className="book_money_sub different"
                   onClick={this.goodsNumber.bind(this,false)}>－</a>
                <input
                  className="book_number different"
                  type="text"
                  ref="carNum"
                  value={this.state.count}
                  onChange={this.handelNum.bind(this)}
                  onBlur={this.handelBlurNum.bind(this)}/>
                <a href="javascript:;"
                   style={podStore.book_type == 253 ? {border : '1px solid #ccc',color:'#ccc'} : {border : '1px solid #2497f9',color:'#2497f9'}}
                   className="book_money_add different"
                   onClick={this.goodsNumber.bind(this,true)}>＋</a>
              </div>
              <p className="print_dialog_maxNum different">
                <span>{podStore.book_type == 253 ? '印刷数量' : '选择印刷数量'}</span>
                <span className="maxNum">{podStore.book_type == 253 ? '（上限1本）' : '（上限999本）'}</span>
              </p>
            </div>
          </div>
          <div className="print_dialog_btn different">
            {this.props.bookId != 548100274089 && podStore.book_type != 253 ?
            <div className="print_dialog_cart different" onClick={this.handelCart.bind(this)}>加入印刷车</div> : null}
            <div className="print_dialog_buy different" onClick={this.handleBuy.bind(this)}>立即购买</div>
          </div>
        </div>
      </div>

    )
  }
}

export default PrintDialog;