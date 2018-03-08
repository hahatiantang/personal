/**
 * 文件说明:记事本首页
 * 详细描述:
 * 创建者: hzw
 * 创建时间: 2016/11/14
 * 变更记录:
 */
import React,{Component} from 'react';
import "../less/indexListItem.less"
class IndexListItem extends Component{
    constructor (props){
        super(props)
    }

    componentDidMount() {

    }
    render() {
        let indexData = this.props.data
        return (
            <div>
                {
                    indexData.map(function (item, index) {
                        return (
                            <section key={index} className="item">
                                <div className="itemName">
                                    <span className="colorBlock" style={{background: indexData[index].color}}></span>
                                    <h1 className="itemTitle">{indexData[index].title}</h1>
                                </div>
                                <p className="itemSubtext">{indexData[index].sub}</p>
                                <div className="itemImg">
                                    <img src={require("../images/"+ (index+1) +".jpg")} alt=""/>
                                </div>
                            </section>
                        )
                    })
                }
            </div>
        )
    }
}

export default IndexListItem