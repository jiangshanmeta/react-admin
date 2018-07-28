import React from "react";

import FieldTag from "@/components/common/editor/FieldTag"
import FieldArrayModel from "@/components/common/editor/FieldArrayModel"

const FieldTagCandidate = [
    {id:1,name:"zhangsan"},
    {id:2,name:"lisi"},
    {id:3,name:"wangwu"},
    {id:4,name:"heliu"}
];

const FieldArrayModelCandidate = [
    {id:1,name:"zhangsan"},
    {id:2,name:"lisi"},
    {id:3,name:"wangwu"},
    {id:4,name:"heliu"},
    {id:5,name:"tianqi"},
    {id:6,name:"naive"},
    {id:7,name:"simple"},
    {id:8,name:"young"},
]


export default class Test_tag extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            FieldTag:[2],
            FieldArrayModel:[2],
        };

        const fields = [
            "FieldTag",
            "FieldArrayModel",
        ];

        fields.forEach((field)=>{
            this[`handle${field}Change`] = this.handleChange.bind(this,field);
        });

    }

    handleChange(field,value){
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

    renderFieldArrayModel(){
        return (
            <tr>
                <td>FieldArrayModel</td>
                <td>{this.state.FieldArrayModel}</td>
                <td>
                    <FieldArrayModel
                        value={this.state.FieldArrayModel}
                        onChange={this.handleFieldArrayModelChange}
                        labelfield='name'
                        valuefield='id'
                        candidate={FieldArrayModelCandidate}
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
                    {this.renderFieldArrayModel()}
                </tbody>
            </table>
        )
    }
}