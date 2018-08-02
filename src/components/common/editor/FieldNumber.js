import React from 'react';
import PropTypes from "prop-types";
import {
    InputNumber
} from 'element-react';


export default class FieldNumber extends React.Component{
    handleChange = (value)=>{
        if(value === undefined){
            value = 0;
        }
        this.props.onChange(value);
    }

    render(){
        let {
            value,
            ...restProps
        } = this.props;
        delete restProps.onChange;
        delete restProps.defaultValue;

        return (
            <InputNumber
                value={value}
                defaultValue={value}
                onChange={this.handleChange}
                {...restProps}
            />
        )
    }
}

FieldNumber.propTypes = {
    value:PropTypes.number.isRequired,
    onChange:PropTypes.func.isRequired,
}