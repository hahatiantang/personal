/**
 * 文件说明:记事本预览页
 * 详细描述:
 * 创建者: hzw
 * 创建时间: 2016/11/15
 * 变更记录:
 */

import React,{Component} from 'react';

class NotePreviewMeToo extends Component{
    constructor (props){
        super(props);
        this.btn = {
            background:"#1ebc21",
            width:"6.15rem",
            height:"0.81rem",
            color:"#fff",
            fontSize:"0.3rem",
            textAlign: "center",
            fontFamily: "Microsoft YaHei",
            lineHeight: "0.81rem",
            borderRadius: "5px",
            position: "absolute",
            bottom: "0.3rem",
            left: "0",
            right: "0",
            margin:"0 auto",
        }

    }

    meToo() {
        window.location.href = "/calendar/noteindex"
    }

    render(){
        return (
            <div>
                <div onClick={this.meToo.bind(this)} style={this.btn}>我也做一本</div>
            </div>
        )
    }
}

export default NotePreviewMeToo