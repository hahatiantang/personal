/**
 * 文件说明:记事本编辑页面中间部分
 * 详细描述:
 * 创建者: 邵纪昊
 * 创建时间: 2016/11/11
 * 变更记录:
 */

import React from 'react';

import DesignCover from './DesignCover.jsx';
import DesignInsert from './DesignInsert.jsx';
import PaperSelect from './PaperSelect.jsx';

class NoteEditBody extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let show = this.props.show || 0;
        return (
            <div className="NoteEditBody">
                {show == 0?
                    <DesignCover {...this.props} />
                :null}
                {show == 1?
                    <DesignInsert {...this.props} />
                :null}
                {show == 2?
                    <PaperSelect {...this.props} />
                :null}
            </div>
        )
    }
}

export default NoteEditBody;