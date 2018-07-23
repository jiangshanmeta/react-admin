import React from 'react';
import PropTypes from "prop-types";
import {
    Input 
} from 'element-react';


export default class FieldString extends React.Component{
    render(){
        const {
            value,
            onChange,
            ...restProps
        } = this.props;
        return (
            <Input 
                type="text"
                value={value}
                onChange={onChange}
                {...restProps}
            />
        )
    }
}

FieldString.propTypes = {
    value:PropTypes.any.isRequired,
    onChange:PropTypes.func.isRequired,
}
