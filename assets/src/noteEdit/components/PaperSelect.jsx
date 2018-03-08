/**
 * 文件说明:记事本选择纸张
 * 详细描述:
 * 创建者: 邵纪昊
 * 创建时间: 2016/11/14
 * 变更记录:
 */

import React from 'react';

class SelectPaper extends React.Component{
    constructor(props){
        super(props);
    }

    /*选择纸张类型*/
    selectPaper(index){
        this.props.handStore('selectPaper',index);
    }

    /*完成制作记事本*/
    paperComplete(){
        this.props.noteBookComplete();
    }

    render(){
        let innerPageListStore = this.props.innerPageListStore || [];
        let initialTempDetailStore = this.props.initialTempDetailStore || {};
        let content = initialTempDetailStore.content_list || {};
        let innerData = content.inner || [];
        let inner = innerData[0] || {};
        let innerId = inner.template_id;
        /*纸张类型数据*/
        let paperData = [{
            "img":"http://static.timeface.cn/resource/suolvpic/2514921f29648724fa978b0aae2dcf28.png",
            "name":"横线",
            "id":"935"
        }/*,{
            "img":"http://static.timeface.cn/resource/suolvpic/da6d80af13460272e8290d96aba1e5ab.png",
            "name":"点阵",
            "id":"934"
        }*/,{
            "img":"http://static.timeface.cn/resource/suolvpic/a601765483035fcbf77081c43c9f4ec0.png",
            "name":"空白",
            "id":"936"
        }];
        let paperHtml = paperData.map((item,index) => {
            return(
                <li key={index} onClick={this.selectPaper.bind(this,item)}>
                    <img src={item.img} />
                    <p>{item.name}</p>
                    <div className={innerId == item.id ? "paperSelect" : null}></div>
                </li>
            )
        });
        return (
            <div className="SelectPaperBox">
                <div className="SelectPaper">
                    <ul>
                        {paperHtml}
                    </ul>
                </div>
                <div className="SelectPaperFoot" onClick={this.paperComplete.bind(this,this.props.paperId)}>完成</div>
            </div>
        )
    }
}

export default SelectPaper;