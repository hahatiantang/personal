/**
 * 文件说明:记事本编辑页面头部
 * 详细描述:
 * 创建者: 邵纪昊
 * 创建时间: 2016/11/11
 * 变更记录:
 */

import React from 'react';

class NoteEditHead extends React.Component{
    constructor(props){
        super(props);
    }

    /*导航栏点击切换*/
    TitleActive(flag){
        if(flag == 1){
            this.props.actions.insertPageNumClick();
        }
        this.props.showActive(flag);
    }

    render(){
        let show = this.props.show || 0;
        let noteEditHeadLess = "";
        switch (show){
            case 0:
                noteEditHeadLess = "noteEditHeadOne";
                break;
            case 1:
                noteEditHeadLess = "noteEditHeadTwo";
                break;
            case 2:
                noteEditHeadLess = "noteEditHeadThree";
                break;
            default:
                noteEditHeadLess = "noteEditHeadOne";
                break;
        }
        return (
            <div className="NoteEditHead">
                <ul className={noteEditHeadLess}>
                    <li onClick={this.TitleActive.bind(this,0)}>1.设计封面</li>
                    <li onClick={this.TitleActive.bind(this,1)}>2.设计插页</li>
                    <li onClick={this.TitleActive.bind(this,2)}>3.选择纸张</li>
                </ul>
            </div>
        )
    }
}

export default NoteEditHead;