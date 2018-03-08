/**
 * 文件说明:记事本设计插页
 * 详细描述:
 * 创建者: 邵纪昊
 * 创建时间: 2016/11/14
 * 变更记录:
 */

import React from 'react';
import _ from 'lodash';

import StyleSelect from './StyleSelect.jsx';
import DesignInsertBox from './DesignInsertBox.jsx';

import displayFront from '../images/displayFront.jpg';
import interlude from '../images/interlude.jpg';
import notNeedInsert from '../images/notNeedInsert.jpg';

class DesignInsert extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            insertSetShow:false
        }
    }

    /*下一步*/
    nextActive(){
        this.props.showActive(2);
    }

    /*插页设置*/
    insertSet(id){
        this.props.handStore('insertSet',id);
        this.insertSetShow(false)
    }

    /*插页选择弹窗显示*/
    insertSetShow(flag){
        this.setState({
            insertSetShow:flag
        })
    }

    /*选择新的插页样式*/
    newPodInsert(num){
        let initialTempDetailStore = this.props.initialTempDetailStore || {};
        let insertPageListStore = this.props.insertPageListStore || [];
        let podId = initialTempDetailStore.book_id || "";
        let tempId = insertPageListStore[num].PAGE.template_id;
        let tempStore = "";
        if(num == 0){
            tempStore = insertPageListStore[num].PAGE;
            this.props.insertEdit(tempStore,this.props.insertPageNumStore,num,tempId);
        }else{
            tempStore = _.filter(insertPageListStore[num].PAGE.element_list,(list) => {
                return list.element_type == 2;
            })[0];
            let elementList = "";
            let tempInfo = "";
            if(initialTempDetailStore.content_list.insert[this.props.insertPageNumStore].template_id == 0){
                tempInfo = tempStore;
            }else{
                elementList = initialTempDetailStore.content_list.insert[this.props.insertPageNumStore].element_list;
                console.log(elementList,'tempStore')
                tempInfo = _.filter(elementList,(list) => {
                    return list.element_type == 2;
                })[0];
            }
            let data = {
                noteId:podId,
                tempId:tempId,
                tempInfo:tempStore,
                text:tempInfo.element_content
            };
            this.props.insertEdit(data,this.props.insertPageNumStore,num,tempId);
        }
    }

    /*翻页页码*/
    pageNumClick(flag){
        if(flag == 1){
            this.props.actions.insertPageNumClick(-1);
        }else{
            this.props.actions.insertPageNumClick(1);
        }
    }

    render(){
        /*获取书本相应信息*/
        let initialTempDetailStore = this.props.initialTempDetailStore || {};

        /*插页设置*/
        let insertSetListData = [{
            img:displayFront,
            id:1
        },{
            img:interlude,
            id:2
        },{
            img:notNeedInsert,
            id:0
        }];
        let insertSetList = insertSetListData.map((item,index) => {
            return(
                <li key={index} onClick={this.insertSet.bind(this,item.id)}>
                    <img src={item.img} />
                    <div  className={initialTempDetailStore.insert_type == item.id ? "insertSetSelect" : null}></div>
                </li>
            )
        });

        let notNeedInsertBg = (this.props.initialTempDetailStore.book_height * 0.011 * this.props.proportion + 1)+'rem';

        return (
            <div className="designInsertBg">
                {initialTempDetailStore.insert_type == 0?<div className="notNeedInsertBg" style={{ height:notNeedInsertBg }}></div>:null}
                <div className="designInsertBody">
                    <div className="designInsertBox">
                        {initialTempDetailStore.insert_type == 0?<div className="notNeedInsert"><span>无插页</span></div>:null}
                        <DesignInsertBox {...this.props}
                            initialTempDetailStore={initialTempDetailStore}
                        />
                    </div>
                    <div className="designInsertPage">
                        <div className="designInsertPageLeft" onClick={this.props.insertPageNumStore == 0 ? null : this.pageNumClick.bind(this,1)}></div>
                        <div className="designInsertPageBody">{this.props.insertPageNumStore + 1}/12</div>
                        <div className="designInsertPageRight" onClick={this.props.insertPageNumStore == 11 ? null : this.pageNumClick.bind(this,2)}></div>
                    </div>
                </div>
                <div className="designInsertFoot">
                    <ul>
                        <li onClick={this.insertSetShow.bind(this,true)}>插页设置</li>
                        {initialTempDetailStore.insert_type == 0?
                            <li className="designInsertFootNot">插页样式</li>
                            :
                            <li onClick={() => this.props.popupShow(true)}>插页样式</li>
                        }
                        <li onClick={this.nextActive.bind(this)}>下一步</li>
                    </ul>
                </div>
                {/*插页设置弹窗*/}
                {this.state.insertSetShow?
                    <div className="insertSetBg">
                        <div className="insertSetBox">
                            <div className="insertSetHead">插页设置<div className="popupHeadBtn" onClick={this.insertSetShow.bind(this,false)}></div></div>
                            <ul>
                                {insertSetList}
                            </ul>
                        </div>
                    </div>
                :null}
                {/*封面样式选择*/}
                {this.props.listClose?
                    <StyleSelect {...this.props}
                        title={"选择插页样式"}
                        flag={"insert"}
                        activeStyle={initialTempDetailStore.content_list.insert[this.props.insertPageNumStore].template_id}
                        listData={this.props.insertPageListStore}
                        newPodCover={this.newPodInsert.bind(this)}
                    />
                :null}
            </div>
        )
    }
}

export default DesignInsert;