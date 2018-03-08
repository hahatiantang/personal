/**
 * 文件说明:
 * 详细描述:
 * 创建者: zgw
 * 创建时间: 2017/7/6
 * 变更记录:
 */
import React,{Component,PropTypes} from 'react';
import {connect} from 'react-redux';
import AlertMsg from '../../common/AlertMsg.jsx';
import URL from 'url';
require('../js/yxMobileSlider');
import '../less/index.less'
import _ from 'lodash';
class IndexPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            deleteModal:false,
            calendarStyle:69,
            showAlert:false,
            alertMsg:''
        }
        this.queryObj = URL.parse(window.location.href, true).query || {};
    }
    render(){
        return(
            <div>wwww</div>
        )
    }
}


function mapStateToProps(state) {
    return state
}

export default connect(mapStateToProps())(IndexPage)