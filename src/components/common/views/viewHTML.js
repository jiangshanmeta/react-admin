import React from "react"

export default function(props){
    const {
        data
    } = props;

    const dangerousHTMLObj = {
        __html:data,
    }
    return <div dangerouslySetInnerHTML={dangerousHTMLObj}></div>
}