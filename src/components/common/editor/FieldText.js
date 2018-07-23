import React from "react";
import PropTypes from "prop-types";
import {
    Input
} from "element-react"


export default class FieldText extends React.Component{
    render(){
        const {
            value,
            onChange,
            ...restProps
        } = this.props;
        return (
            <Input
                type="textarea"
                value={value}
                onChange={onChange}
                {...restProps}
            />
        )
    }
}

FieldText.propTypes = {
    value:PropTypes.any.isRequired,
    onChange:PropTypes.func.isRequired,
}