import React from "react";
import PropTypes from "prop-types";
import {
    Input
} from "element-react";


export default class FieldInt extends React.Component{
    handleChange = (value)=>{
        if(value === ""){
            value = 0;
        }

        const intValue = Number.parseInt(value,10);
        if(Number.isNaN(intValue)){
            return;
        }

        this.props.onChange(intValue);
    }

    render(){
        const {
            value,
            ...restProps
        } = this.props;

        delete restProps.onChange;

        return (
            <Input
                value={value}
                onChange={this.handleChange}
                {...restProps}
            />
        )
    }
}

FieldInt.propTypes = {
    value(props,propName){
        const value = props[propName];
        if(value === undefined){
            return new Error(`value is required for FieldInt`);
        }

        const intValue = Number.parseInt(value,10);
        if(value !== intValue){
            return new Error("Int number is required for FieldInt");
        }
    },
    onChange:PropTypes.func.isRequired,
}