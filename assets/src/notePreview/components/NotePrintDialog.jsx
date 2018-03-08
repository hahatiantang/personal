import React from 'react';
import '../less/notedialog.less'

import URL from 'url';
import Cookies from 'cookies-js';

class NotePrintDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            bookNum: 1,                            //商品数量
            bookPrice: this.props.bookPrice,       //商品默认单价
            selected: true,
            orderId: 0,
            openSize: true
        };
        this.bindNormal = this.props.bindNormal;   //锁线裸装id
        this.bindGood = this.props.bindGood;  //精装id
        this.sizeSmall = this.props.sizeSmall; //16k
        this.sizeBig = this.props.sizeBig; //32k
        this.addStyle = {border: "1px dashed #49B7E7"};
        this.txtColor = {color: "#49B7E7"};
    }

    componentDidMount() {

    }

    //增加书本数量
    add() {
        if( parseInt(this.state.bookNum) >= 999 ){
            this.setState({
                bookNum: 999
            });
            return;
        }else{
            this.state.bookNum = parseInt(this.state.bookNum) + 1;
            this.setState({
                bookNum: this.state.bookNum
            });
        }
    }

    //减少书本数量
    low() {
        if( parseInt(this.state.bookNum) == 1 ){
            this.setState({
                bookNum: 1
            })
        }else{
            this.state.bookNum = parseInt(this.state.bookNum) - 1;
            this.setState({
                bookNum: this.state.bookNum
            });
        }
    }

    //加入印刷车
    handleCart() {
        if( $(".inputNum").val() == "" ){
            return
        }
        let bookId = this.props.bookId;  //书本id
        let num = this.state.bookNum;    //书本数量
        let size = this.sizeSmall;      //书本尺寸
        let bind = this.state.selected ? this.bindNormal : this.bindGood; //书本装订
        let data = {
            bookId: bookId,
            type: 10,
            count: num,
            size: size,
            bind: bind
        };
        console.log(data,"传购物车数据");
        this.props.action.addCart(data,{
            handelSuccess: (res)=> {
                console.log(res,"购物车返回数据");
                this.props.succCart();
                this.props.closeDialog();
                this.setState({
                    orderId: res.data
                })
            }
        },{
            handelError: (err)=> {
                console.log(err,"er")
            }
        })
    }

    //立即购买
    handleBuy() {
        if( $(".inputNum").val() == "" ){
            return
        }
        let data = {
            bookId: this.props.bookId,  //书本id
            type: 10,
            count: this.state.bookNum, //书本数量
            bind: this.state.selected ? this.bindNormal : this.bindGood, //书本装订方式
            size: this.sizeSmall,   //书本尺寸
            from: 3
        };
        console.log(data,"立即购买传入数据");
        this.props.action.calendarPay(data,{
            handelSuccess: (res)=> {
                console.log(res,"立即购买返回数据");
                this.props.succCart();
                let uid = Cookies('tf-uid');
                let localUrl = '';
                if (/wechat\.timeface/.test(location.href)) {
                    localUrl = "http://m.timeface.cn";
                } else{
                    localUrl = "http://h5.stg1.v5time.net";
                }
                location.href = localUrl+'/orderService/'+uid+'/confirm_order/'+res.data;
            }
        },{
            handelError: (err)=> {
                console.log(err,"er")
                this.props.closeDialog();
            }
        })
    }

    handCancel(){
        this.props.handelClose()
    }

    //切换装订方式，价格改变
    choice() {
        var _this = this;
        this.setState({
            selected: true
        },function () {
            //请求书本价格
            let data = {
                bookId: _this.props.bookId+"",   //书本id
                type: 10,
                split: 0,
                bind: _this.state.selected ? _this.bindNormal : _this.bindGood, //书本装订id
                size: _this.sizeSmall //默认传入书本是16k
            };
            console.log(data, "data");
            this.props.action.bookprice(data,{
                handelSuccess: (res)=> {
                    _this.setState({
                        bookPrice: res.data
                    })
                }
            },{
                handelError: (err)=> {
                    console.log(err,"bookprice")
                }
            });
            /*$.ajax({
                url: "http://stg2.v5time.net/tf/order/bookprice",
                method: "post",
                dataType: "json",
                data: {
                    bookId: _this.props.bookId+"",   //书本id
                    type: 10,
                    split: 0,
                    bind: _this.state.selected ? _this.bindNormal : _this.bindGood, //书本装订id
                    size: _this.state.sizeSmall //默认传入书本是16k
                },
                success: function (data) {
                    _this.setState({
                        bookPrice: data.data
                    })
                }
            })*/
        });
    }

    //装订去除样式
    deleteChoice(){
        var _this = this;
        this.setState({
            selected: false
        },function () {
            //请求书本价格
            let data = {
                bookId: _this.props.bookId+"",   //书本id
                type: 10,
                split: 0,
                bind: _this.state.selected ? _this.bindNormal : _this.bindGood, //书本装订id
                size: _this.sizeSmall //默认传入书本是16k
            };
            this.props.action.bookprice(data,{
                handelSuccess: (res)=> {
                    _this.setState({
                        bookPrice: res.data
                    })
                }
            },{
                handelError: (err)=> {
                    console.log(err,"bookprice")
                }
            });
        })
    }

    inputHandler(event) {
        if( !/^[1-9]\d*$/.test(event.target.value)){  //如果非数字情况
            this.setState({bookNum: parseInt(event.target.value)});
            return
        }else if( parseInt(event.target.value) >= 999 ){  //如果输入的大于999
            event.target.value = 999;
            this.setState({bookNum: parseInt(event.target.value)});
            return;
        }else{
            this.setState({bookNum: parseInt(event.target.value)})
        }
        console.log(this.state.bookNum,"aaa");
    }

    //书本数量默认值
    defautNum(){
        if( $(".inputNum").val() == "" ){
            this.setState({bookNum: 1})
        }
    }

    render() {
        let notePodData = this.props.notePodData || {};
        let bookcover = {
            background: "url("+notePodData.book_cover+") no-repeat center top",
            backgroundSize: "cover"
        };

        return(
            <div>
                <section className="dialog">
                    <div className="close" onClick={this.props.closeDialog}></div>
                    <div className="book">
                        <div className="bookcover" style={bookcover}></div>
                        <div className="price">
                            <div className="pricenum">￥<span>{this.state.bookNum * this.state.bookPrice || 0}</span></div>
                            <div className="num">
                                <div className="low" onClick={this.low.bind(this)}>-</div>
                                <div className="numcon"><input className="inputNum" onBlur={this.defautNum.bind(this)} onChange={this.inputHandler.bind(this)} value={this.state.bookNum || ""} type="number"/></div>
                                <div className="add" onClick={this.add.bind(this)}>+</div>
                            </div>
                            <div className="text">选择打印数量(上限999本)</div>
                        </div>
                    </div>
                    <div className="size">
                        <h1 className="sizetip">尺寸</h1>
                        <div className="sizechoice">
                            <div className="size_l">
                                <p>16开</p>
                                <p>260mm*185mm</p>
                            </div>
                            <div className="size_r">
                                <p>32开(未开放)</p>
                                <p>216mm*150mm</p>
                            </div>
                        </div>
                    </div>
                    <div className="ding">
                        <h1 className="sizetip">装订方式</h1>
                        <div className="dingchoice">
                            <div className="d_l" style={this.state.selected ? this.addStyle : null} onClick={this.choice.bind(this)}>
                                <div className="dimg_l"></div>
                                <div className="dtxt_l" style={this.state.selected ? this.txtColor : null}>锁线裸装</div>
                            </div>
                            <div className="d_r" style={this.state.selected ? null : this.addStyle} onClick={this.deleteChoice.bind(this)}>
                                <div className="dimg_r"></div>
                                <div className="dtxt_r" style={this.state.selected ? null : this.txtColor}>磨砂封套</div>
                            </div>
                        </div>
                    </div>
                    <div className="btn">
                        <div className="cart" onClick={this.handleCart.bind(this)}>加入印刷车</div>
                        <div className="buy" onClick={this.handleBuy.bind(this)}>立即购买</div>
                    </div>
                </section>
            </div>
        )
    }
}

NotePrintDialog.propTypes = {

}

export default NotePrintDialog;