import React from "react";
import PropTypes from "prop-types";
import {
    Button
} from "antd"

export default class Reset extends React.Component{
    handleClick = ()=>{
        this.props.filters.forEach(({field,editorComponent})=>{
            const defaultConfig = editorComponent.default;
            const value = typeof defaultConfig === 'function'?defaultConfig.call(this):defaultConfig;
            this.props.data[field] = value;
        });
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

Reset.propTypes = {
    filters:PropTypes.array.isRequired,
    data:PropTypes.object.isRequired,
    triggerConfig:PropTypes.object,
}

Reset.defaultProps = {
    triggerConfig:{
        type:"warning",
        text:"重置",
    }
}

