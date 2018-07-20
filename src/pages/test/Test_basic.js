import React from 'react';

import FieldString from "@/components/common/editor/FieldString"

// import {
//     Input 
// } from 'element-react'

export default class Test_basic extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            FieldString:""
        };
        this.handleChange = this.handleChange.bind(this)
        console.log(this.props)
    }

    handleChange(value){
        // console.log(value);
        this.setState({
            FieldString:value,
        })
    }

    render(){
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>组件名</th>
                        <th>组件值</th>
                        <th>组件实例</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>FieldString</td>
                        <td>{this.state.FieldString}</td>
                        <td>
                            <FieldString
                                value={this.state.FieldString}
                                onChange={this.handleChange}
                            ></FieldString>
                        </td>
                    </tr>
                </tbody>
            </table>
            // <section>
            //     测试基础editor页面

            //     <Input value={this.state.fieldString} onChange={this.handleChange}/>
            // </section>
        )
    }
}