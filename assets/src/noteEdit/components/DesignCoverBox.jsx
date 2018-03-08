/**
 * 文件说明:记事本设计封面详细页
 * 详细描述:
 * 创建者: 邵纪昊
 * 创建时间: 2016/11/15
 * 变更记录:
 */

import React from 'react';

import ImageCropDialog from '../../edit/components/ImageCropDialog.jsx';
import forMapImg from '../../edit/images/formap.png';
import cropImg from '../../edit/images/crop.png';

class DesignCoverBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            imageCropDialog:false,
            imgConfig:'',
            imageIndex:null
        }
    }

    //判断图片是jpg格式添加压缩参数
    handImgCrop(ops){
        if((/\.jpg$|\.jpeg$/i).test(ops.image_url)){
            return ops.image_url + '@4096w_4096h_1l_60q_1pr_' + ops.image_rotation + 'r_2o'
        }else{
            return ops.image_url
        }
    }

    //编辑文字
    handEditText(res,index){
        let textConfig = {
            element_list:res,
            index:index,
            flag:'cover',
            coverIndex:0
        };
        this.props.handEditTextDialog(textConfig);
    }

    /*图片弹出层显示*/
    handImageCrop(imageFig,index){
        this.setState({
            imgConfig:imageFig,
            imageIndex:index
        },()=>{
            this.setState({
                imageCropDialog:true
            })
        })
    }

    /*图片弹出层隐藏*/
    handCloseImgCropDialog(){
        this.setState({
            imageCropDialog:false
        })
    }

    /*替换图片*/
    handUploadImage(imageFig,index){
        var files = document.getElementById(index).files;
        console.log(files,'files');
        this.props.handUploadImg(files,imageFig,index,'cover',0);
    }

    render(){
        /*获取默认数据*/
        let initialTempDetailStore = this.props.initialTempDetailStore || {};
        /*尺寸转换*/
        let styleRatio = 0.0115 * this.props.proportion;

        /*外壳页面样式*/
        let boxStyle = {
            'width':initialTempDetailStore.book_width * styleRatio + "rem",
            'height':initialTempDetailStore.book_height * styleRatio + "rem"
        };

        /*封面绘制*/
        let bookData = initialTempDetailStore.content_list || [];
        let coverData = bookData.cover[0] || {};
        let coverStyle = {
            'backgroundColor':coverData.page_color,
            'backgroundImage':coverData.page_image ? 'url('+coverData.page_image+')' : 'none',
            'backgroundSize':'100% 100%',
            'backgroundRepeat':coverData.page_image ? 'no-repeat' : '',
            'width':'100%',
            'height':'100%'
        };
        let listData = coverData.element_list || [];
        let coverHtml = listData.map((res,index)=>{
            /*盒子样式*/
            let shellStyle = {
                'width':res.element_width * styleRatio + "rem",
                'height':res.element_height * styleRatio + "rem",
                'position':'absolute',
                'top':res.element_top * styleRatio + "rem",
                'left':res.element_left * styleRatio + "rem",
                'backgroundImage':res.element_background ? 'url('+res.element_background+')' : 'none',
                'backgroundSize':'100% 100%',
                'backgroundRepeat':res.element_background ? 'no-repeat' : '',
                'zIndex':res.element_depth,
                'overflow':'hidden'
            };
            let imageFig = res.image_content_expand || {};
            let imgBor =  imageFig.image_height * imageFig.image_scale;
            /*图片背景样式*/
            let imgBoxStyle = {
                'position': 'absolute',
                'left':res.element_content_left * styleRatio +'rem',
                'right':res.element_content_right * styleRatio +'rem',
                'top':res.element_content_top * styleRatio +'rem',
                'bottom':res.element_content_bottom * styleRatio +'rem',
                'overflow':'hidden'
            };
            /*内容样式*/
            let contentStyle = {};
            if(parseInt(imageFig.image_orientation) == 8 || parseInt(imageFig.image_orientation) == 6){
                contentStyle = {
                    'width':imgBor > 1 ? imgBor * styleRatio + "rem" : '0.01rem',
                    'height':imageFig.image_width * imageFig.image_scale * styleRatio + "rem",
                    'top':(imageFig.image_padding_top + imageFig.image_start_point_y)  * styleRatio + "rem",
                    'left':(imageFig.image_padding_left + imageFig.image_start_point_x )  * styleRatio + "rem",
                    'position': 'absolute'
                };
            }else{
                contentStyle = {
                    'width':imageFig.image_width * imageFig.image_scale * styleRatio + "rem",
                    'height':imgBor > 1 ? imgBor * styleRatio + "rem" : '0.01rem',
                    'top':(imageFig.image_padding_top + imageFig.image_start_point_y)  * styleRatio + "rem",
                    'left':(imageFig.image_padding_left + imageFig.image_start_point_x )  * styleRatio + "rem",
                    'position': 'absolute'
                };
            }
            if(res.element_type == 1){
                if(res.element_content){
                    return(
                        <div key={index} style={shellStyle}>
                            <div style={imgBoxStyle}>
                                <img style={contentStyle} src={this.handImgCrop(imageFig)} />
                            </div>
                            <div className="btnBoxBgBox">
                                <div className="btnBoxBg" style={{marginTop:coverData.template_id == '103'?'1.5rem':'-0.5rem'}}>
                                    <div className="btnBox">
                                        <img src={forMapImg} alt=""/><span>换图</span>
                                        <input onChange={this.handUploadImage.bind(this,res,index)} type="file" id={index} />
                                    </div>
                                    <div className="btnBox" onClick={this.handImageCrop.bind(this,res,index)}>
                                        <img src={cropImg} alt=""/><span>裁剪</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }else{
                    return(
                        <div key={index} style={shellStyle}>
                            <div style={imgBoxStyle}>
                                <img style={contentStyle} src={this.handImgCrop(imageFig)} className="btnBoxBgTwo" />
                            </div>
                            <div className="btnBoxBgOne">
                                <input onChange={this.handUploadImage.bind(this,res,index)} type="file" id={index} />
                            </div>
                        </div>
                    )
                }
            }else if(res.element_type == 2){
                return(
                    <div key={index} style={shellStyle} className="textStyle">
                        {res.element_deleted == 1 ? null :
                            <div style={imgBoxStyle} onClick={res.element_readonly == 1 ? null : this.handEditText.bind(this,res,index)}>
                                <img style={contentStyle} src={this.handImgCrop(imageFig)} />
                            </div>
                        }
                    </div>
                )
            }else{
                return(
                    <div key={index} style={shellStyle}>
                        <div style={imgBoxStyle}>
                            <img style={contentStyle} src={this.handImgCrop(imageFig)} />
                        </div>
                    </div>
                )
            }
        });
        return (
            <div className="designCover" style={boxStyle}>
                <div style={coverStyle}>
                    {coverHtml}
                </div>
                {/*图片裁剪弹窗*/}
                {this.state.imageCropDialog ?
                    <ImageCropDialog {...this.props}
                        imgConfig={this.state.imgConfig}
                        imageIndex={this.state.imageIndex}
                        bookType={this.props.templateId == 66 ? 70 : 69}
                        handCloseImgCropDialog={this.handCloseImgCropDialog.bind(this)}
                        flag={'cover'}
                    />
                    :null
                }
            </div>
        )
    }
}

export default DesignCoverBox;