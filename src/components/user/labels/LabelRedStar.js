import React from "react";

const starStyle = {
    color:'red'
};

export default function({label}){
    return (
        <span>
            {label}
            <span style={starStyle}>*</span>
        </span>
    )
}