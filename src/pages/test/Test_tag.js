import React from "react";

import FieldTag from "@/components/common/editor/FieldTag"

const FieldTagCandidate = [
    {id:1,name:"zhangsan"},
    {id:2,name:"lisi"},
    {id:3,name:"wangwu"},
    {id:4,name:"heliu"}
];

export default class Test_tag extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            FieldTag:[2],
        };

        const fields = [
            "FieldTag",
        ];

        fields.forEach((field)=>{
            this[`handle${field}Change`] = this.handleChange.bind(this,field);
        });

    }

    handleChange(field,value){
        console.log(field,value)
        this.setState({
            [field]:value,
        })
    }

    renderFieldTag(){
        return (
            <tr>
                <td>FieldTag</td>
                <td>{this.state.FieldTag}</td>
                <td>
                    <FieldTag
                        value={this.state.FieldTag}
                        onChange={this.handleFieldTagChange}
                        candidate={FieldTagCandidate}
                        labelfield='name'
                        valuefield='id'
                    />
                </td>
            </tr>
        )
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
                    {this.renderFieldTag()}
                </tbody>
            </table>
        )
    }
}