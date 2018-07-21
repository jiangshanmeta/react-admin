import React from "react";

import {
    Input
} from "element-react"

import withHandleChange from "./_withHandleChange"

class FieldText extends React.Component{
    render(){
        const {value,onChange,...restProps} = this.props;
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

export default withHandleChange(FieldText);