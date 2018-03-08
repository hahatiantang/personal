/**
 * 文件说明:修改文字弹出层
 * 详细描述:
 * 创建者: ycl
 * 创建时间: 2016/10/18
 * 变更记录:
 */

import React from 'react';
import reactComposition from 'react-composition';
import _ from 'lodash';
import closeBtn from '../../notePreview/images/close.png';
class EditTextDialog extends React.Component{
  constructor(props){
    console.log('textConfig',props)
    super(props);
    let textInfo = props.textConfig.element_list.element_content == '请输入文字' ? '' : props.textConfig.element_list.element_content;
    this.state = {
      editText:textInfo
    }
  }
  /**
   * 书名
   */
  handleNameChange(event) {
    let data = event.target.value;
    let maxLength = this.props.textConfig.element_list.text_content_expand.max_text_count;
    if (event.reactComposition.composition === false) {
      if(data.trim().length > maxLength)
      data = data.trim().substring(0,maxLength)
    }
    console.log('data',data);
    this.setState({
      editText: data
    });
  }


  /**
   *修改书名确定
   */
  handSave() {
    var textConfig = _.cloneDeep(this.props.textConfig);
    textConfig.element_list.element_content =   this.state.editText;
    let index = {
      index: this.props.textConfig.index,
      element_flag:textConfig.element_list.element_flag,
      flag:this.props.textConfig.flag,
      coverIndex:this.props.textConfig.coverIndex
    };
    this.props.handelTextEdit(textConfig, index);
    this.props.closeTextDialog();
  }

  render(){
    let closeBtnStyle = {
      width:'0.32rem',
      height:'0.32rem',
      float:'right'
    };
    let self = this;
    /*记事本显示层级*/
    let noteTextShow = this.props.noteTextShow || "";
    return (
      <div className="weui_dialog_confirm tf_wx_dialog" id="ecit_text_dialog" style={{fontSize:'0.24rem'}}>
        <div className="weui_mask" style={{zIndex: noteTextShow ? noteTextShow : null}}></div>
        <div className="weui_dialog" style={{width:'85%'}}>
          <div className="weui_dialog_hd"><strong className="weui_dialog_title">添加文字</strong><img onClick={() => this.props.closeTextDialog()} style={closeBtnStyle} src={closeBtn} /></div>
          <div className="weui_dialog_bd">
            <div className="weui-cells weui-cells_form">
              <div className="weui-cell">
                <div className="weui-cell__bd" style={{textAlign:'center'}}>
                  <textarea style={{width:'90%'}} className="weui-textarea" placeholder="请输入文本" rows="3"
                            value={this.state.editText}
                    {...reactComposition({
                      onChange: (event)=>{
                        self.handleNameChange(event)
                      },
                      onCompositionEnd: (event)=>{
                        event.reactComposition = {composition: false};
                        self.handleNameChange(event)
                      }
                    })}
                  />
                  <div className="text_tip">排版样式以预览效果为准，特殊符号无法印刷。</div>
                </div>
              </div>
            </div>


           {/* <input

              className="weui-input"
              type="text"
              placeholder="请输入文本"  />*/}
          </div>
          <div className="weui_dialog_ft">
            <a href="javascript:;" onClick={this.handSave.bind(this)} className="weui-btn weui-btn_primary">确定</a>
          </div>
        </div>
      </div>
    )
  }
}

export default EditTextDialog;