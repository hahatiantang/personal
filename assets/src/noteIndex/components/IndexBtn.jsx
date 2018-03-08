import React,{Component} from "react"
import '../less/indexBtn.less'
import URL from 'url';
class IndexBtn extends Component{
    constructor (props){
        super(props)
        this.queryObj = URL.parse(window.location.href, true).query || {};
    }

    goToEdit(){
        var appid = this.queryObj.appid || ''
        window.location.href = "/calendar/noteedit?appid=" + appid
    }

    render(){
        return (
                <div className="indexBtn">
                    <button onClick={this.goToEdit.bind(this)}>立即制作</button>
                </div>
            )
    }
}
export default IndexBtn