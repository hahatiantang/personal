/**
 * 文件说明:记事本预览页
 * 详细描述:
 * 创建者: hzw
 * 创建时间: 2016/11/15
 * 变更记录:
 */

import React,{Component} from 'react';
import '../less/notepreviewbtn.less'

class NotePreviewBtn extends Component{
    constructor(props){
        super(props)
    }

    goEdit() {
        window.location.href = "/calendar/noteedit?bookId=" + this.props.bookId;
    }

    render(){
        return (
            <div>
                <section className="preBtn">
                    <div className="preBtnEdit" onClick={this.goEdit.bind(this)}>
                        {/*<a href={'/calendar/noteedit?bookId='+this.props.bookId}></a>*/}
                        <dl className="preBtnItem">
                            <dt><img src={require('../images/edit.png')}/></dt>
                            <dd>编辑</dd>
                        </dl>
                    </div>
                    <div className="preBtnShare"  onClick={this.props.showMask}>
                        <dl className="preBtnItem">
                            <dt><img src={require('../images/share.png')}/></dt>
                            <dd>分享</dd>
                        </dl>
                    </div>
                    <div className="preBtnPrint" onClick={this.props.openDialog}>
                        <dl className="preBtnItem">
                            <dt><img src={require('../images/print.png')}/></dt>
                            <dd>印刷</dd>
                        </dl>
                    </div>
                </section>
            </div>
        )
    }
}

export default NotePreviewBtn
