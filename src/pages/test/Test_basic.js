import React from 'react';

import FieldString from "@/components/common/editor/FieldString"
import FieldText from "@/components/common/editor/FieldText"
import FieldPwd from "@/components/common/editor/FieldPwd"
import FieldNumber from "@/components/common/editor/FieldNumber"
import FieldInt from "@/components/common/editor/FieldInt"

import TestTable from "./_testTable"

const Components = {
    FieldString,
    FieldText,
    FieldPwd,
    FieldNumber,
    FieldInt,
};

export default class Test_basic extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            FieldString:"",
            FieldText:"",
            FieldPwd:"",
            FieldNumber:10,
            FieldInt:1,
        };

        const fields = [
            "FieldString",
            "FieldText",
            "FieldPwd",
            "FieldNumber",
            "FieldInt",
        ];

        fields.forEach((field)=>{
            this[`handle${field}Change`] = this.handleChange.bind(this,field);
        });

        this.config = {
            FieldString:{
                placeholder:"请输入",
            },
            FieldText:{
                placeholder:"测试textarea",
            },
            FieldPwd:{
                placeholder:"测试FieldPwd",
            },
            FieldNumber:{

            },
            FieldInt:{

            },
        };

    
    }

    handleChange(field,value){
        this.setState({
            [field]:value,
        })
    }

    renderField(Field){
        const FieldComponent = Components[Field];

        return (
            <tr>
                <td>{Field}</td>
                <td>{this.state[Field]}</td>
                <td>
                    <FieldComponent
                        value={this.state[Field]}
                        onChange={this[`handle${Field}Change`]}
                        {...(this.config[Field] || {})}
                    />
                </td>
            </tr>
        )
    }


    render(){
        return (
            <TestTable>
                <React.Fragment>
                    {this.renderField('FieldString')}
                    {this.renderField('FieldText')}
                    {this.renderField('FieldPwd')}
                    {this.renderField('FieldNumber')}
                    {this.renderField('FieldInt')}
                </React.Fragment>
            </TestTable>
        )
    }
}