import React from "react";
import PropTypes from "prop-types";
import {
    Input
} from "element-react"

export default function genBasicInput(type){
    class FieldBasic extends React.Component{
        render(){
            return (
                <Input
                    type={type}
                    {...this.props}
                />
            )
        }
    }

    FieldBasic.propTypes = {
        value:PropTypes.any.isRequired,
        onChange:PropTypes.func.isRequired,
    }
    return FieldBasic
}
