/**
 * 文件说明: 照片书类型选择
 * 详细描述:
 * 创建者: 胡许彬
 * 创建时间: 2017/2/28
 * 变更记录:
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as photoBookAction from '../../redux/actions/photoBookAction.js';

import '../less/selectType.less';

class SelectType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type:true,
            binding:226,
            sizeAndBinding:false,
            selectedTypeName:"",
            errorDialog:false
        };
        this.actions = bindActionCreators(Object.assign({},photoBookAction),props.dispatch);
    }

    render(){

        let bookType = [
            {
                id:0,
                name:'照片书'
            },
            {
                id:1,
                name:'亲子照片书'
            },
            {
                id:2,
                name:'旅行照片书'
            },
            {
                id:3,
                name:'毕业纪念册'
            },
            {
                id:4,
                name:'恋爱图册'
            }
        ];

        return (
            <div className="typeLayout">

                <div className={this.state.type ? "bookType" : "bookType showNone"}>
                    <img className="typeImage" src={require('../images/gx.jpg')} onClick={this.getType.bind(this,bookType[0].id,bookType[0].name)}/>
                    <img className="typeImage" src={require('../images/qz.jpg')} onClick={this.getType.bind(this,bookType[1].id,bookType[1].name)}/>
                    <img className="typeImage" src={require('../images/lx.jpg')} onClick={this.getType.bind(this,bookType[2].id,bookType[2].name)}/>
                    <img className="typeImage" src={require('../images/by.jpg')} onClick={this.getType.bind(this,bookType[3].id,bookType[3].name)}/>
                    <img className="typeImage" src={require('../images/la.jpg')} onClick={this.getType.bind(this,bookType[4].id,bookType[4].name)}/>
                </div>

                <div className={this.state.sizeAndBinding ? "" : "showNone"}>
                    <div className="currentType">
                        <div className="currentTypeText">当前分类</div>
                        <div className="currentTypeName">{this.state.selectedTypeName}</div>
                    </div>
                    <div>
                        <div className="sizes">尺寸</div>
                        <div className="sizeLayout">
                            {this.getSizeHtml()}
                        </div>
                    </div>
                    <div>
                        <div className="bindings">装订方式</div>
                        <div className="binding-layout">
                            <img className="bingingImg" src={require('../images/binding.jpg')}/>
                            <div className="weui_mask selectBg">
                                <i className="weui_icon_success selectIcon"></i>
                            </div>
                        </div>
                        <div className="bingingText">软面平装</div>
                    </div>

                    <div className="nextStep" onClick={this.nextStep.bind(this)}>下一步</div>
                </div>

                {
                    this.state.errorDialog?
                        <div className="weui_dialog_alert" id="dialog2" style={{fontSize:'20px'}}>
                            <div className="weui_mask"></div>
                            <div className="weui_dialog">
                                <div className="weui_dialog_hd"><strong className="weui_dialog_title">提示</strong></div>
                                <div className="weui_dialog_bd">网络不佳，请稍后再试</div>
                                <div className="weui_dialog_ft">
                                    <a href="javascript:;" className="weui_btn_dialog primary" onClick={this.closeDialog.bind(this)}>确定</a>
                                </div>
                            </div>
                        </div>:null
                }
            </div>

        );
    }


    // 获取分类
    getType(typeId,typeName){

        this.setState({
            type:false,
            sizeAndBinding:true,
            selectedTypeId:typeId,
            selectedTypeName:typeName
        });

        this.actions.getConfig({type:typeId, uid: this.props.userDetailStore.uid},{
            handleSuccess:(res)=>{
                console.log(res);
                this.sizes = (res.data || {}).size||[];
                this.setState({
                    selectedSize:this.sizes[0].id
                });
            }
        },{
            handelError:(err)=>{
                this.setState({
                    errorDialog:true
                });
            }
        });
    }


    // 获取尺寸
    getSizeHtml(){

        let sizeHtml = (this.sizes||[]).map((item,index)=>{

            return <div key={index}className={this.state.selectedSize == item.id ? "size01 selected":"size01"} onClick={this.selectFx.bind(this,item.id)}>{item.name}</div>;
        });
        return sizeHtml;
    }

    // 选择尺寸
    selectFx(sizeId){
        this.setState({
            selectedSize:sizeId
        });
    }

    // 关闭弹框
    closeDialog(){
        this.setState({
            errorDialog:false
        });
    }

    // 下一步
    nextStep(){

        // 本地存储选择配置
        window.localStorage.type = this.state.selectedTypeId;
        window.localStorage.size = this.state.selectedSize;
        window.localStorage.binding = this.state.binding;

        window.location.href = "/calendar/photoBookUpload";
    }

}

function mapStateToProps(state) {
    return {
        userDetailStore: state.userDetailStore
    };
}

export default connect(mapStateToProps)(SelectType)