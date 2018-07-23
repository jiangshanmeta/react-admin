import React from "react";
import PropTypes from "prop-types";
import {
    Input
} from "element-react";



export default class FieldPwd extends React.Component{
    render(){
        const {
            value,
            onChange,
            ...restProps
        } = this.props;
        return (
            <Input
                type="password"
                value={value}
                onChange={onChange}
                {...restProps}
            />
        )
    }
}

FieldPwd.propTypes = {
    value:PropTypes.any.isRequired,
    onChange:PropTypes.func.isRequired,
}