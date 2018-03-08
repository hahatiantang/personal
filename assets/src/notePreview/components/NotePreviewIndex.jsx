import React from 'react';

class NotePreviewIndex extends React.Component{
    constructor(props){
        super(props)
    }

    //首页样式
    previewIndexPage() {
        let styleRatio = 0.0115;
        let content_list = this.props.data;
        let imgContainer= '';

        for( var i=0; i<content_list.length; i++ ){
            if( content_list[i].content_type === 3 ){
                imgContainer = content_list[i].element_list.map(function (ele, index) {
                    return (
                        <img key={index} src={ele.image_content_expand.image_url} style={{
                            width: ele.image_content_expand.image_width*ele.image_content_expand.image_scale*styleRatio + "rem",
                            height: ele.image_content_expand.image_height*ele.image_content_expand.image_scale*styleRatio + 'rem',
                            position: "absolute",
                            left: ele.contentX*styleRatio + "rem",
                            top: ele.contentY*styleRatio + "rem",
                        }}
                        />
                    )
                })
            }
        }
        return imgContainer
    }

    //获取插页数量
    getInsertPageNum(){
        let styleRatio = 0.0115;
        let content_list = this.props.data;
        let newInsertPageArr = [];

        content_list.map(function (item) {
            if( item.content_type === 2 ){
                newInsertPageArr.push(item)
            }
        });
        return newInsertPageArr
    }

    //生成插页
    getInsertpage(){
        let styleRatio = 0.0115;
        let insertArr = this.getInsertPageNum();
        let inserCon = '';
        console.log(insertArr)
        inserCon = insertArr.map(function (item, index) {
            return (
                <section className="page" key={index} style={{
                    position:"absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: 98-index,
                    background: "#fff",
                    overflow: "hidden"
                }}
                >
                    {item.element_list.map(function (item, index) {
                        if( item.element_border_radius){
                            return (
                                <img key={index} src={item.image_content_expand.image_url} style={{
                                    width: item.image_content_expand.image_width*item.image_content_expand.image_scale*styleRatio +"rem",
                                    height: item.image_content_expand.image_height*item.image_content_expand.image_scale*styleRatio +"rem",
                                    position: "absolute",
                                    left: item.contentX*styleRatio + "rem",
                                    top: item.contentY*styleRatio + "rem",
                                    overflow: "hidden",
                                    zIndex: item.element_depth,
                                    paddingTop: item.image_content_expand.image_padding_top*item.image_content_expand.image_scale*styleRatio +"rem",
                                    paddingRight:item.image_content_expand.image_padding_right*item.image_content_expand.image_scale*styleRatio +"rem",
                                    paddingBottom:item.image_content_expand.image_padding_bottom*item.image_content_expand.image_scale*styleRatio +"rem",
                                    paddingLeft: item.image_content_expand.image_padding_left*item.image_content_expand.image_scale*styleRatio +"rem",
                                    borderRadius: "50%"
                                }} />
                            )
                        }else{
                            return (
                                <img key={index} src={item.image_content_expand.image_url} style={{
                                    width: item.image_content_expand.image_width*item.image_content_expand.image_scale*styleRatio +"rem",
                                    height: item.image_content_expand.image_height*item.image_content_expand.image_scale*styleRatio +"rem",
                                    position: "absolute",
                                    left: item.contentX*styleRatio + "rem",
                                    top: item.contentY*styleRatio + "rem",
                                    overflow: "hidden",
                                    zIndex: item.element_depth
                                }} />
                            )
                        }

                    })}
                </section>
            )
        });
        return inserCon;
    }

    render(){
        let imgContainer =  this.previewIndexPage();
        let getInsertpage = this.getInsertpage();
        let style = {
            width: "100%",
            height: "100%",
            overflow: "hidden"
        }
        return(
            <div className="pageCon" style={style}>
                <section className="page" style={{
                    position:"absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: 99,
                    background: "#fff"
                }}
                >
                    { imgContainer }
                </section>
                {getInsertpage}
            </div>
        )
    }
}



export default NotePreviewIndex