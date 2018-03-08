/**
 * 文件说明:记事本设计封面
 * 详细描述:
 * 创建者: 邵纪昊
 * 创建时间: 2016/11/14
 * 变更记录:
 */

import React from 'react';

import DesignCoverBox from './DesignCoverBox.jsx';
import StyleSelect from './StyleSelect.jsx';

class DesignCover extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            close:false //弹窗显示
        }
    }

    /*下一步*/
    nextActive(){
        this.props.actions.insertPageNumClick();
        this.props.showActive(1);
    }

    /*选取新的封面*/
    newPodCover(id){
        let podId = this.props.initialTempDetailStore.book_id || "";
        let data = {
            book_id:podId,
            id:id || 0
        };
        this.props.layoutModification(data);
    }

    render(){
        /*获取书本相应信息*/
        let initialTempDetailStore = this.props.initialTempDetailStore || {};
        let contentList = initialTempDetailStore.content_list || {};
        let coverStyle = contentList.cover || [];
        let cover = coverStyle[0] || {};
        return (
            <div className="designCoverBox">
                {/*封面展示*/}
                <DesignCoverBox {...this.props}
                    initialTempDetailStore={initialTempDetailStore}
                    templateId={cover.template_id}
                />
                <div className="designCoverFoot">
                    <ul>
                        <li onClick={() => this.props.popupShow(true)}>封面样式</li>
                        <li onClick={this.nextActive.bind(this)}>下一步</li>
                    </ul>
                </div>
                {/*封面样式选择*/}
                {this.props.listClose?
                    <StyleSelect {...this.props}
                        title={"选择封面样式"}
                        flag={'cover'}
                        activeStyle={cover.template_id}
                        listData={this.props.noteTempListStore}
                        newPodCover={this.newPodCover.bind(this)}
                    />
                :null}
            </div>
        )
    }
}

export default DesignCover;