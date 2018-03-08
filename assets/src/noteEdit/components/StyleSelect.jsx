/**
 * 文件说明:记事本样式选择
 * 详细描述:
 * 创建者: 邵纪昊
 * 创建时间: 2016/11/14
 * 变更记录:
 */

import React from 'react';

import '../less/noteEdit.less';

class StyleSelect extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        $(".popupBody ul").css({"width":this.props.listData.length * 1.56 + 'rem'})
    }

    /*选择样式*/
    listActive(id){
        this.props.newPodCover(id);
    }

    render(){
        let activeStyle = this.props.activeStyle || 0;
        let title = this.props.title || "";
        let listData = this.props.listData || [];
        let list = listData.map((item,index) => {
            if(this.props.flag == 'cover'){
                return(
                    <li key={index} onClick={this.listActive.bind(this,item.template_id)}>
                        <img src={item.thumbnail} />
                        <div className={activeStyle == item.template_id ? "listDataSelect" : null}></div>
                    </li>
                )
            }else{
                return(
                    <li key={index} onClick={this.listActive.bind(this,index)}>
                        <img src={item.SUO_LV_TU} />
                        <div className={activeStyle == item.PAGE.template_id ? "listDataSelect" : null}></div>
                    </li>
                )
            }
        });
        return (
            <div className="popupBoxBg">
                <div className="popupBox">
                    <div className="popupHead">{title}<div className="popupHeadBtn" onClick={() => this.props.popupShow(false)}></div></div>
                    <div className="popupBody">
                        <ul>
                            {list}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default StyleSelect;