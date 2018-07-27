import React from "react";
import {
    Input
} from "element-react"

import propsModelMixin from "./_propsModelMixin"

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

    propsModelMixin(FieldBasic);

    return FieldBasic
}
