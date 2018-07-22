import React from 'react';

import {
    InputNumber
} from 'element-react'

import withHandleChange from "./_withHandleChange"

class FieldNumber extends React.Component{
    render(){
        let {value,...restProps} = this.props;
        delete restProps.defaultValue;

        let numberValue;
        if(value !== undefined){
            numberValue = Number(value);
            if(Number.isNaN(numberValue)){
                console.error("invalid value for FieldNumber");
                return null;
            }
        }

        return (
            <InputNumber
                value={numberValue}
                defaultValue={numberValue}
                {...restProps}
            />
        )
    }
}

export default withHandleChange(FieldNumber);