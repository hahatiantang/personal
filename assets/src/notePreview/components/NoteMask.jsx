import React from 'react';
import '../less/noteshare.less'

class NoteMask extends React.Component{
    constructor(props){
        super(props)
    }


    render(){
        return (
            <div className="mask" onClick={this.props.closeMask}>
                <div className="maskimg"><img src={require('../images/sharetip.png')} alt=""/></div>
            </div>
        )
    }
}

export default NoteMask;