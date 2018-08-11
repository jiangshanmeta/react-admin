import React from "react"
import PropTypes from "prop-types";

export default function viewTransform(props){
    return (
        <span>{props.transform(props.data)}</span>
    )
}

viewTransform.propTypes = {
    transform:PropTypes.func,
}

viewTransform.defaultProps = {
    transform:function(data){
        return data;
    }
}