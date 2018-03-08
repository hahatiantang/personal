/**
 * 文件说明:照片书编辑
 * 详细描述:
 * 创建者: 胡许彬
 * 创建时间: 2017/03/06
 * 变更记录:
 */
import React from 'react';
import ImageCropDialog from './ImageCropDialog.jsx';

class EditBook extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            picIndex:0,
            ratioWidth:1,
            ratioHeight:1,
            imageCropDialog:false,
            imgConfig:'',
            imageIndex:null,
            actionMenus:false
        };
    }

    //判断图片是jpg格式添加压缩参数
    handImgCrop(ops){
        if((/\.jpg$|\.jpeg$/i).test(ops.image_url)){
            return ops.image_url + '@4096w_4096h_1l_60q_1pr_' + ops.image_rotation + 'r_2o'
        }else{
            return ops.image_url
        }
    }

    // 绘制照片书外层box
    handPgeHtml(){
        const bookStyle = this.props.bookStyle;
        const pageStore = this.props.pageStore;

        const bookType = this.props.bookType;
        let bookSize = 83;
        if(this.props.bookSize == 228){
            bookSize = 73;
        }


        if(bookType == 69|| bookType == 93){
            bookSize = 100;
        }

        //书尺寸
        const pageBox = {
            'width':bookStyle.book_width * this.state.ratioWidth /bookSize +'rem',
            'height':bookStyle.book_height * this.state.ratioHeight/bookSize +'rem',
            'position': 'relative'
        };

        //设置内页
        const pageCenterBox = {
            'position': 'absolute',
            'width':bookStyle.content_width * this.state.ratioWidth/bookSize +'rem',
            'height':bookStyle.content_height * this.state.ratioHeight/bookSize +'rem',
            'left':bookStyle.content_padding_left * this.state.ratioWidth/bookSize +'rem',
            'top':bookStyle.content_padding_top * this.state.ratioHeight/bookSize +'rem'
        };

        const pageStyle = {
            'width':bookStyle.content_width * this.state.ratioWidth/bookSize +'rem',
            'height':bookStyle.content_height * this.state.ratioHeight/bookSize +'rem',
            'backgroundColor':pageStore.page_color || '#fff',
            'backgroundImage':pageStore.page_image ? 'url('+pageStore.page_image+'@70Q)' : 'none',
            'backgroundSize':'100% 100%',
            'backgroundRepeat':pageStore.page_image ? 'no-repeat' : ''
        };

        const centerHtml = this.handPageCenter();
        let pageHtml = <div style={pageBox} className="calendar_min_box">
            
            <div style={pageCenterBox}>
                <div style={pageStyle}>
                    {centerHtml}
                </div>
            </div>
        </div>;
        return pageHtml;
    }

    //编辑文字
    handEditText(res,index){
        let textConfig = {
            element_list:res,
            index:index
        };
        this.props.handEditTextDialog(textConfig);
    }



    //得到图片自身的旋转
    getOrientationRotation(orientation) {
        switch (orientation - 0) {
            case 3:
                return 180;
            case 6:
                return 90;
            case 8:
                return 270;
            default:
                return 0;
        }
    }

    // 上传照片
    handUploadImage(coverIndex){
        let files = $("#upload")[0].files;
        this.props.handUploadImg(files,this.state.imagefig,this.state.picIndex,coverIndex);
    }

    // 绘制照片书内页
    handPageCenter(){
        const bookType = this.props.bookType;
        let bookSize = 83;
        if(this.props.bookSize == 228){
            bookSize = 73;
        }

        if(bookType == 69 || bookType == 93){
            bookSize = 100;
        }
        let currentIndex = this.props.currentIndex;
        const pageStore = this.props.pageStore || {};
        const centerStore = pageStore.element_list || [];
        const centerHtml = centerStore.map((res,index)=>{
            //内容区域样式
            let pageStyle ={
                width:res.element_width * this.state.ratioWidth/bookSize +'rem',
                height:res.element_height * this.state.ratioHeight/bookSize +'rem',
                'position': 'absolute',
                'top':res.element_top * this.state.ratioHeight/bookSize +'rem',
                'left':res.element_left * this.state.ratioWidth/bookSize +'rem',
                'backgroundImage':res.element_background ? 'url('+res.element_background+')' : 'none',
                'backgroundSize':'100% 100%',
                'backgroundRepeat':res.element_background ? 'no-repeat' : '',
                'zIndex':res.element_depth
            };
            let imageCfig = res.image_content_expand || {};
            let imgBor =  imageCfig.image_height * imageCfig.image_scale * this.state.ratioHeight/bookSize +'rem';
            var rotation = imageCfig.image_rotation + this.getOrientationRotation(imageCfig.image_orientation);
            let imageRotation = imageCfig.image_rotation + this.getOrientationRotation(imageCfig.image_orientation);

            //图片样式
            let imageStyle = {
                width:imageCfig.image_width * imageCfig.image_scale * this.state.ratioWidth/bookSize +'rem',
                height:imgBor,
                'top':((imageCfig.image_padding_top + imageCfig.image_start_point_y)  * this.state.ratioHeight)/bookSize +'rem',
                'left':((imageCfig.image_padding_left + imageCfig.image_start_point_x )  * this.state.ratioWidth)/bookSize +'rem',
                'position': 'absolute'
            };
            if(rotation > 360){
                rotation = rotation - 360;
            }
            if(rotation == 90 || rotation == 270){
                imageStyle.width = imgBor;
                imageStyle.height = imageCfig.image_width * imageCfig.image_scale * this.state.ratioWidth/bookSize +'rem'
            }
            //挂件或文字背景translate(199.002px, 0px) scale(0.136282) rotate(90deg)
            let imgBox = {
                'position': 'absolute',
                'left':(res.element_content_left * this.state.ratioWidth -1)/bookSize +'rem',
                'right':(res.element_content_right* this.state.ratioWidth-1)/bookSize +'rem',
                'top':(res.element_content_top * this.state.ratioHeight-1)/bookSize +'rem',
                'bottom':(res.element_content_bottom * this.state.ratioHeight-1)/bookSize +'rem',
                'overflow':'hidden'
            };
            //图片背景
            let imgBox1 = {
                'position': 'absolute',
                'left':res.element_content_left * this.state.ratioWidth/bookSize +'rem',
                'right':res.element_content_right* this.state.ratioWidth/bookSize +'rem',
                'top':res.element_content_top * this.state.ratioHeight / bookSize +'rem',
                'bottom':res.element_content_bottom * this.state.ratioHeight/bookSize +'rem',
                'overflow':'hidden',
                'borderRadius':res.element_border_radius ? res.element_border_radius+'%'  : '',
                'backgroundRepeat':res.element_mask_image ? 'no-repeat' : ''
            };

            // 图片
            if(res.element_type == 1 || res.element_type == 8){

                return (

                    <div key={index} style={pageStyle} className="imgBox">
                        <div style={imgBox1}>
                            <img style={imageStyle} src={this.handImgCrop(imageCfig)} onClick={this.getImage.bind(this,index,res)}/>
                            <input type="file" accept="image/*" multiple="multiple" id="upload" style={{display:'none'}} onChange={this.handUploadImage.bind(this,currentIndex)}/>
                        </div>
                    </div>

                )
            }

            //挂件
            if(res.element_type == 5){
                return (<div  key={index} style={pageStyle}>
                    {res.element_deleted == 1 ? null :
                        <div  style={imgBox}>
                            <img style={imageStyle} src={this.handImgCrop(imageCfig)} alt=""/>
                        </div>
                    }
                </div>)
            }

            //文字
            if(res.element_type == 2){
                return (<div key={index} style={pageStyle}>
                    {res.element_deleted == 1 ? null :
                        <div style={imgBox} className="textStyle" onClick={res.element_readonly == 1 ? null : this.handEditText.bind(this,res,index)}>
                            <img className="settingText"
                                 style={imageStyle}
                                 src={imageCfig.image_url}
                                 alt=""/>
                        </div>
                    }
                </div>)
            }
        });
        return centerHtml;
    }


    getImage(index,res){

        this.setState({
            actionMenus:true,
            picIndex:index,
            imagefig:res
        })
    }

    handCloseImgCropDialog(){
        this.setState({
            imageCropDialog:false
        })
    }



    render() {
        let pageHtml = this.handPgeHtml();
        const bookType = this.props.bookType;

        console.log("index="+this.state.picIndex);

        return (
            <div className="calendar_box" style={{'marginTop':bookType == 69 ? '30%': ''}}>

                {pageHtml}

                {
                    this.state.imageCropDialog ?
                        <ImageCropDialog imgConfig={this.state.imagefig}
                                         imageIndex={this.state.picIndex}
                                         bookType={bookType}
                                         handCloseImgCropDialog={this.handCloseImgCropDialog.bind(this)}
                                         handStore={this.props.handStore.bind(this)}>
                        </ImageCropDialog>:''
                }


                <div id="actionSheet_wrap" className={this.state.actionMenus ? 'openFg':'closeFg'}>
                    <div className="weui_mask_transition weui_fade_toggle" id="mask" style={{display:'block',zIndex:'20'}}></div>
                    <div className="weui_actionsheet weui_actionsheet_toggle" id="weui_actionsheet" style={{zIndex:'20'}}>
                        <div className="weui_actionsheet_menu">
                            <div className="weui_actionsheet_cell" onClick={this.updatePhoto.bind(this)}>更换照片</div>
                            <div className="weui_actionsheet_cell" onClick={this.handImageCrop.bind(this)}>裁剪</div>
                        </div>
                        <div className="weui_actionsheet_action">
                            <div className="weui_actionsheet_cell" id="actionsheet_cancel" onClick={this.hide.bind(this)}>取消</div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    // 更换照片
    updatePhoto(){
        this.hide();
        $("#upload").trigger('click');
        $("#upload").trigger('click');
    }

    // 裁剪照片
    handImageCrop(){
        this.setState({
            imgConfig:this.state.imagefig,
            imageIndex:this.state.index,
            actionMenus:false
        },()=>{
            this.setState({
                imageCropDialog:true
            })
        })
    }


    // 隐藏actionSheet
    hide(){
        this.setState({
            actionMenus: false
        })
    }

}
export default EditBook;