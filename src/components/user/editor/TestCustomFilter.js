import React from "react"
import {
    Input
} from "element-react"

export default class TestCustomFilter extends React.Component{
    render(){
        return (
            <span>
                <Input
                    value={this.props.value}
                    onChange={this.props.onChange}
                />
                {this.props.value} || TestCustomFilter
            </span>
        )
    }
}