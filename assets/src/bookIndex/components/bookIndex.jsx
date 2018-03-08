/**
 * 文件说明: 照片书首页
 * 详细描述:
 * 创建者: 胡许彬
 * 创建时间: 2017/2/28
 * 变更记录:
 */
import React from 'react';

import '../less/photoBookIndex.less';

class PhotoBookIndex extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){

        return (
            <div>
                <img className="indexImg" src={require('../images/index.jpg')}/>
                <div style={{height:'1.5rem',width:'100%'}}></div>
                <div className="makeBg">
                    <div className="makeButton" onClick={this.makeBook.bind(this)}>
                        立即制作
                    </div>
                </div>
            </div>
        );
    }

    // 立即制作 到选择书类型
    makeBook(){
        window.location.href = "/calendar/photoBookType";
    }

}

export default PhotoBookIndex;