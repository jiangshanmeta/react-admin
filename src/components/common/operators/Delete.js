import React from "react"
import PropTypes from "prop-types";
import {
    Button,
    MessageBox,
} from "element-react";

import {
    logError,
} from "@/widget/utility"

export default class Delete extends React.Component{
    handleClick = ()=>{
        MessageBox.confirm('确认删除？', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then(()=>{
            new Promise((resolve)=>{
                this.props.doDeleteRequest.call(this,resolve,this.props.data);
            }).then(()=>{
                this.props.onUpdate();
            }).catch(logError);
        }).catch(()=>{});
    }

    render(){
        return (
            <Button
                onClick={this.handleClick}
                {...this.props.triggerConfig}
            >
                {this.props.triggerConfig.text}
            </Button>
        )
    }
}

Delete.propTypes = {
    data:PropTypes.object.isRequired,
    doDeleteRequest:PropTypes.func.isRequired,
    onUpdate:PropTypes.func.isRequired,
    triggerConfig:PropTypes.object,
}

Delete.defaultProps = {
    triggerConfig:{},
}