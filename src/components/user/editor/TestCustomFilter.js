import React from "react"
import {
    Input
} from "antd"

export default class TestCustomFilter extends React.Component{
    handleChange = (e)=>{
        const value = e.target.value;
        console.log(value);
        this.props.onChange(value);
    }

    render(){
        return (
            <span>
                <Input
                    value={this.props.value}
                    onChange={this.handleChange}
                />
            </span>
        )
    }
}