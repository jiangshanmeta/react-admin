import React from "react";
import {
    Input
} from "antd"

import propsModelMixin from "./_propsModelMixin"

export default function withBasicInput(type,component){
    let Component = Input;
    if(component){
        Component = Input[component]
    }

    @propsModelMixin
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

    return FieldBasic
}
