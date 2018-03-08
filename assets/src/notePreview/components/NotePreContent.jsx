import React,{Component} from 'react';
import '../js/main.js';
import '../../common/lazyload/jquery.lazyload.js';
import '../less/notepreview.less';
import '../less/base.css';
import '../js/hammer.min.js';


class NotePreContent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ok: true,
            show: true,
            bookface: "封面",
            bookcover: "封底",
            bookNum: 1,
            ratioWidth: screen.width < 1920 ? (screen.height / 1080) * 0.85 : (1920 / 1920) * 0.95,
            ratioHeight: screen.height <1080 ? (screen.height / 1080)* 0.85  : (1080 / 1080) * 0.95
        };
        this.len = this.props.notePodData.length
    }

    componentDidMount() {
        let notePodData = this.props.notePodData;
        let len = notePodData.content_list.length;
        let that = this;

        window.fb =  new Timeface.FlipBook({
            // 容器名
            container: '.pageList',
            // 书本单页宽度
            width: notePodData.book_width,
            // 书本单页高度
            height: notePodData.book_height,
            ratioWidth: that.state.ratioWidth,
            ratioHeight: that.state.ratioHeight,
            // 是否单页显示 true, false or auto
            isSinglePage: 'auto', //'auto',
            //插页类型
            insertType: notePodData.insert_type,
            //是否启动键盘左右键翻页
            startKeyboard: false,
            zoomScale: 1,
            currentPageIndex: 0,
            allPageCount: notePodData.content_list.length,
            podData: notePodData.content_list,
            onFlipEndPage: function () {
                if( fb.currentPageIndex-1 < 1 ){
                    that.setState({
                        ok: true,
                        show: true
                    });
                }else if( fb.currentPageIndex-1 >= 1 && fb.currentPageIndex-1 <= len-4 ){
                    that.setState({
                        ok: false,
                        bookNum: fb.currentPageIndex - 1
                    })
                }else{
                    that.setState({
                        ok: true,
                        show: false
                    })
                }
                console.log(fb.currentPageIndex,  "currentIndexPage--翻页后返回的当前页数");
            }
        });

        //左右滑动
        var hammertime = new Hammer( $(".contentMask").get(0), {domEvents: true} );
        hammertime.on("swipeleft", function () {
            that.handelNext();
        });
        hammertime.on("swiperight", function () {
            that.handelPrev();
        })
    }


    //绘制内页
   /* handPageCenter(pages){
        let pageData= pages.element_list || [];
        let centerHtml = pageData.map((res,index)=>{
            //内容区域样式
            let pageStyle ={
                width:res.element_width * this.state.ratioWidth,
                height:res.element_height * this.state.ratioHeight,
                'position': 'absolute',
                'top':res.element_top * this.state.ratioHeight,
                'left':res.element_left * this.state.ratioWidth,
                'backgroundImage':res.element_background ? 'url('+res.element_background+')' : 'none',
                'backgroundSize':'100% 100%',
                'backgroundRepeat':res.element_background ? 'no-repeat' : '',
                'zIndex':res.element_depth
            };
            let imageCfig = res.image_content_expand || [];
            let pageBgWidth = (pageStyle.width - (res.element_content_left+imageCfig.image_padding_left)* this.state.ratioWidth);
            let pageBgHeight =  (pageStyle.height-(res.element_content_top+imageCfig.image_padding_top)* this.state.ratioHeight);
            let imageRotation = imageCfig.image_rotation + this.getOrientationRotation(imageCfig.image_orientation);
            let imgLine = (imageCfig.image_height * imageCfig.image_scale * this.state.ratioHeight);
            //图片样式
            let imageStyle = {
                width:imageCfig.image_width * imageCfig.image_scale * this.state.ratioWidth,
                height:imgLine > 1 ? imgLine : '1px',
                'top':(imageCfig.image_padding_top + imageCfig.image_start_point_y)  * this.state.ratioHeight,
                'left':(imageCfig.image_padding_left + imageCfig.image_start_point_x )  * this.state.ratioWidth,
                'position': 'absolute'
            };
            if(imageRotation == 90 || imageRotation == 270){
                imageStyle.width = imgLine;
                imageStyle.height = imageCfig.image_width * imageCfig.image_scale * this.state.ratioWidht;
            }
            //背景样式
            let pageBgStyle = {
                'top':res.element_content_top * this.state.ratioHeight,
                'left':res.element_content_left * this.state.ratioWidth,
                'right':res.element_content_right * this.state.ratioWidth,
                'bottom':res.element_content_bottom * this.state.ratioHeight - 1,
                'position': 'absolute',
                'overflow':'hidden',
                'borderRadius':res.element_border_radius ? res.element_border_radius+'%' : '',
                'backgroundRepeat':res.element_mask_image ? 'no-repeat' : ''
            };

            let svgHtml = '';
            let imageAli = '@' + imageCfig.image_rotation + 'r_2o';
            if(imageCfig.image_url&&res.element_mask_image){

                svgHtml = "<svg id='svg_mask_wrap" + index + "' width='" + pageBgWidth + "' height='" + pageBgHeight + "' baseProfile='full' version='1.2'>" +
                    "<defs><mask id='svg_mask_" + index + "' maskUnits='userSpaceOnUse' maskContentUnits='userSpaceOnUse'" +
                    "transform='scale(1)'><image fill='black' width='" +pageBgWidth + "' height='" + pageBgHeight + "' xlink:href='" +
                    res.element_mask_image + "' /></mask></defs><image mask='url(#svg_mask_" + index + ")'  y='" + imageStyle.top + "' x='" + imageStyle.left + "' " +
                    "width='" + imageStyle.width+ "' height='" + imageStyle.height + "' xlink:href='" +
                    imageCfig.image_url +imageAli+ "' /><rect mask='url(#svg_mask_" + index + ")' x='0' y='0' width='100%' height='100%'  class='svg_hover_style'  fill='#000000' opacity='0'/></svg>";

            }

            //图片
            if(res.element_type == 1){
                return (<div  key={index} style={pageStyle}>
                    {imageCfig.image_url && res.element_mask_image ?
                        <div style={pageBgStyle} dangerouslySetInnerHTML={{__html: svgHtml}}></div>
                        :
                        <div style={pageBgStyle}>
                            <img style={imageStyle} src={this.handImgCrop(imageCfig)} alt=""/>
                        </div>
                    }
                </div>)
            }

            //挂件
            if(res.element_type == 5){
                return (<div  key={index} style={pageStyle}>
                    <div  style={pageBgStyle}>
                        <img style={imageStyle} src={imageCfig.image_url + '@70Q_1pr.png'} alt=""/>
                    </div>
                </div>)
            }
            //文字
            if(res.element_type == 2){
                return (<div   key={index} style={pageStyle}>
                    <div style={pageBgStyle}>
                        <img style={imageStyle} src={imageCfig.image_url + '@1pr.png'} alt=""/>
                    </div>
                </div>)
            }
        });

        return centerHtml;
    }

    //绘制外页
    handelOutPage(pages){
        let bookStyle = this.props.notePodData || {};
        const pageBox = {
            'width':bookStyle.book_width * this.state.ratioWidth,
            'height':bookStyle.book_height * this.state.ratioHeight,
            'position': 'relative'
        };
        //设置内页
        const pageCenterBox = {
            'position': 'absolute',
            'width':bookStyle.content_width * this.state.ratioWidth,
            'height':bookStyle.content_height * this.state.ratioHeight,
            'left':bookStyle.content_padding_left * this.state.ratioWidth,
            'top':bookStyle.content_padding_top * this.state.ratioHeight,
            'backgroundColor':pages.page_color,
            'backgroundImage':'url('+pages.page_image+')',
            'backgroundSize':'100% 100%',
            'backgroundRepeat':pages.page_image ? 'no-repeat' : ''
        };
        const centerHtml = this.handPageCenter(pages);
        let pageHtml = <div style={pageBox}>
            <div style={pageCenterBox}>
                {centerHtml}
            </div>
        </div>;
        return pageHtml;
    }*/

    //上一页
    handelPrev() {
        if( this.props.notePodData.insert_type == 2 ){
              if(fb.currentPageIndex >= 191){
                  fb.currentRightPage(191)
              }else if(fb.currentPageIndex >= 96){
                  fb.currentRightPage(96)
              }else if(fb.currentPageIndex >= 95){
                  fb.currentRightPage(95)
              }else if( fb.currentPageIndex >= 94 ){
                  fb.currentRightPage(94)
              }else if( fb.currentPageIndex >= 93 ){
                  fb.currentRightPage(93)
              }else if( fb.currentPageIndex >= 78 ){
                  fb.currentRightPage(78)
              }else if( fb.currentPageIndex >= 77 ){
                  fb.currentRightPage(77)
              }else if( fb.currentPageIndex >= 76 ){
                  fb.currentRightPage(76)
              }else if( fb.currentPageIndex >= 75 ){
                  fb.currentRightPage(75)
              }else if( fb.currentPageIndex >= 60 ){
                  fb.currentRightPage(60)
              }else if( fb.currentPageIndex >= 59 ){
                  fb.currentRightPage(59)
              }else if( fb.currentPageIndex >= 58 ){
                  fb.currentRightPage(58)
              }else if( fb.currentPageIndex >= 57 ){
                  fb.currentRightPage(57)
              }else if( fb.currentPageIndex >= 42 ){
                  fb.currentRightPage(42)
              }else if( fb.currentPageIndex >= 41 ){
                  fb.currentRightPage(41)
              }else if( fb.currentPageIndex >= 40 ){
                  fb.currentRightPage(40)
              }else if( fb.currentPageIndex >= 39 ){
                  fb.currentRightPage(39)
              }else if( fb.currentPageIndex > 24 ){
                  fb.currentRightPage(24)
              }else if( fb.currentPageIndex >= 23 ){
                  fb.currentRightPage(23)
              }else if( fb.currentPageIndex >= 22 ){
                  fb.currentRightPage(22)
              }else if( fb.currentPageIndex >= 21 ){
                  fb.currentRightPage(21)
              }else if( fb.currentPageIndex >= 6 ){
                  fb.currentRightPage(6)
              }else if( fb.currentPageIndex >= 5 ){
                  fb.currentRightPage(5)
              }else if( fb.currentPageIndex >= 4 ){
                  fb.currentRightPage(4)
              }else if( fb.currentPageIndex >= 3 ){
                  fb.currentRightPage(3)
              }
            fb.aboutFlip("previous");
        }else {
            fb.aboutFlip("previous");
        }
    }

    //下一页
    handelNext(){
        console.log(fb.currentPageIndex, "1翻页前的当前页!!!!!!!!!");
        if( this.props.notePodData.insert_type == 2 ){
            if( fb.currentPageIndex < 1 ){
                fb.aboutFlip("next");
            } else if( fb.currentPageIndex < 2 ){
                fb.currentRightPage(1)
            }else if( fb.currentPageIndex < 3 ){
                fb.currentRightPage(2)
            }else if( fb.currentPageIndex < 4 ){
                fb.currentRightPage(3)
            }else if( fb.currentPageIndex < 5 ){
                fb.currentRightPage(4)
            }else if( fb.currentPageIndex < 20 ){
                fb.currentRightPage(19)
            }else if( fb.currentPageIndex < 21 ){
                fb.currentRightPage(20)
            }else if( fb.currentPageIndex < 22 ){
                fb.currentRightPage(21)
            }else if( fb.currentPageIndex < 23 ){
                fb.currentRightPage(22)
            }else if( fb.currentPageIndex < 38 ){
                fb.currentRightPage(37)
            }else if( fb.currentPageIndex < 39 ){
                fb.currentRightPage(38)
            }else if( fb.currentPageIndex < 40 ){
                fb.currentRightPage(39)
            }else if( fb.currentPageIndex < 41 ){
                fb.currentRightPage(40)
            }else if( fb.currentPageIndex < 56 ){
                fb.currentRightPage(55)
            }else if( fb.currentPageIndex < 57 ){
                fb.currentRightPage(56)
            }else if( fb.currentPageIndex < 58 ){
                fb.currentRightPage(57)
            }else if( fb.currentPageIndex < 59 ){
                fb.currentRightPage(58)
            }else if( fb.currentPageIndex < 74 ){
                fb.currentRightPage(73)
            }else if( fb.currentPageIndex < 75 ){
                fb.currentRightPage(74)
            }else if( fb.currentPageIndex < 76 ){
                fb.currentRightPage(75)
            }else if( fb.currentPageIndex < 77 ){
                fb.currentRightPage(76)
            }else if( fb.currentPageIndex < 92 ){
                fb.currentRightPage(91)
            }else if( fb.currentPageIndex < 93 ){
                fb.currentRightPage(92)
            }else if( fb.currentPageIndex < 94 ){
                fb.currentRightPage(93)
            }else if( fb.currentPageIndex < 95 ){
                fb.currentRightPage(94)
            }else if( fb.currentPageIndex < 190 ){
                fb.currentRightPage(189)
            }else if( fb.currentPageIndex < 191 ){
                fb.currentRightPage(190)
            }
            fb.aboutFlip("next");
        }else {
            fb.aboutFlip("next");
        }
    }
    render() {
        let boxStyle = {
            width: (this.props.notePodData.book_width) * this.styleRatio,
            height: (this.props.notePodData.book_height) * this.styleRatio,
            position: "relative",
            margin: "0 auto",
            backgroundColor: "#fff",
            overflow: "hidden"
        };

        let contentStyle = {
            width: this.props.notePodData.book_width * this.state.ratioWidth,
            height: this.props.notePodData.book_height*this.state.ratioHeight
        };
        let notePodData = this.props.notePodData;
        let allContainer = {
            transform: "scale(0.8)",
            overflow: "hidden",
            marginTop: "-0.8rem"
        };
        console.log(notePodData,"notePodData")
        return (
            <div>
                <div className="allcontainer" style={allContainer}>
                    <div className="contentMask"></div>
                    <div className="podBookContentBox" id="main" style={{
                        width: (this.props.notePodData.book_width),
                        height: (this.props.notePodData.book_height),
                        position: "relative",
                        margin: "0 auto",
                        backgroundColor: "#fff",
                        overflow: "hidden"
                    }}>
                        <div className="pageList"></div>
                    </div>
                </div>
                <div className="prePage">
                    <div className="preArrowL" onClick={this.handelPrev.bind(this)}></div>
                    <div className="preNum">
                        {this.state.ok ?
                            <span>{this.state.show ? "封面" : "封底" }</span> : <span>{this.state.bookNum} / {this.props.notePodData.content_list.length - 4}</span>
                        }
                    </div>
                    <div className="preArrowR" onClick={this.handelNext.bind(this)}></div>
                </div>
            </div>

    )
    }
}
export default NotePreContent