import React from 'react';

import {
    InputNumber
} from 'element-react'

import withHandleChange from "./_withHandleChange"

class FieldNumber extends React.Component{
    render(){
        let {value,onChange,defaultValue=0,...restProps} = this.props;
        
        let numberValue = Number(value);
        if(typeof numberValue !== 'number' || Number.isNaN(numberValue)){
            numberValue = defaultValue;
            onChange(numberValue)
        }

        return (
            <InputNumber
                value={numberValue}
                defaultValue={numberValue}
                onChange={onChange}
                {...restProps}
            />
        )
    }
}

export default withHandleChange(FieldNumber);