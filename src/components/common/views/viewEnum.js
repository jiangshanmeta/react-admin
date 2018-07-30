import React from "react";

export default function viewEnum(props){
    const {
        enums,
        data,
    } = props;
    return (
        <span>{enums[data]}</span>
    )
}