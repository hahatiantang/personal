/**
 * 文件说明:上传进度
 * 详细描述:
 * 创建者: 胡许彬
 * 创建时间: 17/2/14
 * 变更记录:
 */
import React from 'react';
import '../less/photoBookUpload.less';

class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            timer: null
        };
    }

    render(){
        this.progressBar = this.props.progressBar;
        let finish = this.props.finish||0;
        let fail = this.props.fail||0;

        // 尺寸处理
        this.clientWidth = document.documentElement.clientWidth;
        document.documentElement.style.fontSize = this.clientWidth / 7.5 + 'px';
        this.baseSize = this.clientWidth / 7.5;

        let width = parseInt(1.6 * this.baseSize);
        let height = parseInt(1.6 * this.baseSize);

        if(finish || fail){
            clearInterval(this.state.timer);
        }

        let containerStyle = {
            height: height,
            width: width,
            background: '#4c4c4c',
            opacity: 0.8,
            position:'absolute',
            top:0
        };

        let progressStyle = {
            marginTop:'0.75rem',
            marginLeft:'0.1rem',
            width: '1.4rem'
        };

        let failStyle = {
            marginTop:'-0.15rem',
            marginLeft:'0.6rem'
        };

        let progress = this.state.progress + "%";

        return (
            <div>
                {
                    finish ? null:
                        fail?
                            <div style={containerStyle}>
                                <div className="weui_progress" style={failStyle}>
                                    <i className="weui_icon_warn"></i>
                                </div>
                            </div>
                        :
                        <div style={containerStyle}>
                            <div className="weui_progress" style={progressStyle}>
                                <div className="weui_progress_bar">
                                    <div className="weui_progress_inner_bar js_progress" style={{width:progress}}></div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }

    componentDidMount(){
        this.upload();
    }

    componentWillUnmount () {
        this.state.toastTimer && clearInterval(this.state.toastTimer);
    }

    upload(){
        if (!this.progressBar){
            return;
        }
        this.setState({
            progress: (++this.state.progress % 100) > 95 ? 95:++this.state.progress % 100
        });
        this.state.toastTimer = setTimeout(this.upload.bind(this),1000);
    }

}

export default ProgressBar;