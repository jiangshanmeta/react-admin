import React from "react"
import PropTypes from "prop-types";

import {
    Button,
    Modal,
} from "antd"

import {
    logError,
    handleNonFuncProp,
} from "@/widget/utility"


export default class Delete extends React.Component{
    handleClick = ()=>{
        const confirmConfig = handleNonFuncProp(this.props.confirmConfig,this);
       
        const onOk = (close)=>{
            new Promise((resolve)=>{
                this.props.doDeleteRequest.call(this,resolve,this.props.data);
            }).then(()=>{
                close();
                this.props.onUpdate();
            }).catch(logError);
        }

        Modal.confirm(Object.assign({},confirmConfig,{onOk}));
    }

    render(){
        const triggerConfig = handleNonFuncProp(this.props.triggerConfig,this);

        return (
            <Button
                onClick={this.handleClick}
                {...triggerConfig}
            >
                {triggerConfig.text}
            </Button>
        )
    }
}

Delete.propTypes = {
    data:PropTypes.object.isRequired,
    doDeleteRequest:PropTypes.func.isRequired,
    onUpdate:PropTypes.func.isRequired,
    triggerConfig:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    confirmConfig:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
}

Delete.defaultProps = {
    triggerConfig:{
        type:"danger",
        text:"删除",
    },
    confirmConfig:{
        title:"确认删除？",
        okText:"确定",
        okType:"danger",
        cancelText:"取消",
    },
}