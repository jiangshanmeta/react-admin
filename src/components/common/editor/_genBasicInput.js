import React from "react";
import {
    Input
} from "antd"

import propsModelMixin from "./_propsModelMixin"

export default function genBasicInput(type,component){
    let Component = Input;
    if(component){
        Component = Input[component]
    }

    class FieldBasic extends React.Component{
        handleChange = (e)=>{
            this.props.onChange(e.target.value);
        }

        render(){
            return (
                <Component
                    type={type}
                    {...this.props}
                    onChange={this.handleChange}
                />
            )
        }
    }

    propsModelMixin(FieldBasic);

    return FieldBasic
}
