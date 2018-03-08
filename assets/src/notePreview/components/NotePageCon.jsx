import React from 'react';


class NotePageCon extends React.Component{
    constructor(props){
        super(props)
    }

    componentDidMount() {

    }

    //封面
    getCover() {
        let styleRatio = 0.0115;
        let pageData = this.props.data;
        let coverList = pageData[0].element_list; //拿到封面元素数组
        let coverData = [];
        let coverStyle = {
            zIndex: pageData.length-0,
            width: "100%",
            height: "100%",
            position: "absolute",
            backgroundSize: "cover",
            backgroundImage: "url("+pageData[0].page_image+")",
            backgroundColor: pageData[0].page_color,
            backgroundRepeat: "no-repeat"
        };
        return (
            <section data-book="封面" data-tag="tag" className="page" style={coverStyle}>
                {
                    coverList.map(function (item, index) {
                        return(
                            <div style={{
                                position: "absolute",
                                width: item.element_width*styleRatio+"rem",
                                height: item.element_height*styleRatio+"rem",
                                zIndex: item.element_depth,
                                left: item.contentX*styleRatio + "rem",
                                top: item.contentY*styleRatio + "rem", 
                            }}>
                                <img key={index} src={item.image_content_expand.image_url} style={{
                                    position: "absolute",
                                    width: item.image_content_expand.image_width*styleRatio*item.image_content_expand.image_scale + "rem",
                                    height: item.image_content_expand.image_height*styleRatio*item.image_content_expand.image_scale + "rem",
                                    left: item.contentX*styleRatio + "rem",
                                    top: item.contentY*styleRatio + "rem",
                                    zIndex: item.element_depth,
                                    backgroundColor: pageData[0].page_color
                                }}/>
                            </div>
                        )
                    })
                }
            </section>
        )
    }

    //封面反面
    getCoverBg() {
        let pageData = this.props.data;
        let coverbgColor = pageData[1].page_color;
        let coverImg = pageData[1].page_image;
        return (
            <section data-book="封面" className="page" style={{
                zIndex: pageData.length-1,
                width: "100%",
                height: "100%",
                position: "absolute",
                backgroundSize: "cover",
                backgroundImage: "url("+pageData[1].page_image+")",
                backgroundColor: pageData[1].page_color,
                backgroundRepeat: "no-repeat"
            }}> </section>
        )
    }

    //内页
    getInnerPage() {
        let styleRatio = 0.0115;
        let pageData = this.props.data;
        let len = pageData.length;
        let innerPageData = [];
        innerPageData = pageData.map(function (item, index) {
            if( item.content_type === 1 || item.content_type === 2 ){
                return (
                    <section data-index={index-1} data-book={item.content_type == 2?"插页":null} className="page" key={index} style={{
                        zIndex: len-index,
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        backgroundSize: "cover",
                        backgroundImage: "url("+item.page_image+")",
                        backgroundColor: item.page_color,
                        backgroundRepeat: "no-repeat"
                    }}>
                        {
                            item.element_list.map(function (ele, index) {
                                if( item.element_border_radius ){   //如果
                                    return (
                                        <img key={index} src={ele.image_content_expand.image_url} style={{
                                            width: ele.image_content_expand.image_width*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            height: ele.image_content_expand.image_height*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            position: "absolute",
                                            left: ele.contentX*styleRatio + "rem",
                                            top: ele.contentY*styleRatio + "rem",
                                            overflow: "hidden",
                                            zIndex: ele.element_depth,
                                            paddingTop: ele.image_content_expand.image_padding_top*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            paddingRight:ele.image_content_expand.image_padding_right*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            paddingBottom:ele.image_content_expand.image_padding_bottom*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            paddingLeft: ele.image_content_expand.image_padding_left*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            borderRadius: "50%"
                                        }} />
                                    )
                                }else{
                                    return (
                                        <img key={index} src={ele.image_content_expand.image_url} style={{
                                            width: ele.image_content_expand.image_width*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            height: ele.image_content_expand.image_height*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            position: "absolute",
                                            left: ele.contentX*styleRatio + "rem",
                                            top: ele.contentY*styleRatio + "rem",
                                            overflow: "hidden",
                                            zIndex: ele.element_depth
                                        }}/>
                                    )
                                }
                            })
                        }
                    </section>
                )
            }
        });
        return innerPageData;
    }

    //封底
    getBottom() {
        let styleRatio = 0.0115;
        let pageData = this.props.data;
        let len = pageData.length;
        let bottomData = [];
        bottomData = pageData.map(function (item, index) {
            if( item.content_type === 5 || item.content_type === 6 ){
                return (
                    <section data-book="封底" className="page" key={index} style={{
                        zIndex: len-index,
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        backgroundSize: "cover",
                        backgroundImage: "url("+item.page_image+")",
                        backgroundColor: item.page_color,
                        backgroundRepeat: "no-repeat"
                    }}>
                        {
                            item.element_list.map(function (ele, index) {
                                if( ele.element_border_radius ){   //如果
                                    return (
                                        <img key={index} src={ele.image_content_expand.image_url} style={{
                                            width: ele.image_content_expand.image_width*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            height: ele.image_content_expand.image_height*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            position: "absolute",
                                            left: ele.contentX*styleRatio + "rem",
                                            top: ele.contentY*styleRatio + "rem",
                                            overflow: "hidden",
                                            zIndex: ele.element_depth,
                                            paddingTop: ele.image_content_expand.image_padding_top*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            paddingRight:ele.image_content_expand.image_padding_right*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            paddingBottom:ele.image_content_expand.image_padding_bottom*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            paddingLeft: ele.image_content_expand.image_padding_left*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            borderRadius: "50%"
                                        }} />
                                    )
                                }else{
                                    return (
                                        <img key={index} src={ele.image_content_expand.image_url} style={{
                                            width: ele.image_content_expand.image_width*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            height: ele.image_content_expand.image_height*ele.image_content_expand.image_scale*styleRatio +"rem",
                                            position: "absolute",
                                            left: ele.contentX*styleRatio + "rem",
                                            top: ele.contentY*styleRatio + "rem",
                                            overflow: "hidden",
                                            zIndex: ele.element_depth
                                        }}/>
                                    )
                                }
                            })
                        }
                    </section>
                )
            }
        });
    return bottomData
    }

    render(){
        let coverData = this.getCover();  //封面
        let coverIndex = this.props.data.length;
        let getCoverBg = this.getCoverBg(); //封面背面
        let containerStyle = {
            width: "100%",
            height: "100%",
            position: "absolute"
        };
        let getInnerPage = this.getInnerPage(); //中间页
        let getBottom = this.getBottom(); //底部页面
        return (
            <div style={containerStyle}>
                {coverData}
                {getCoverBg}
                {getInnerPage}
                {getBottom}
            </div>
        )
    }
}

export default NotePageCon