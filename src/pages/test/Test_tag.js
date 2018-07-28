import React from "react";

import FieldTag from "@/components/common/editor/FieldTag"
import FieldArrayModel from "@/components/common/editor/FieldArrayModel"
import FieldAsyncTag from "@/components/common/editor/FieldAsyncTag"
import FieldAsyncArrayModel from "@/components/common/editor/FieldAsyncArrayModel"

import TestTable from "./_testTable"

const Components = {
    FieldTag,
    FieldArrayModel,
    FieldAsyncTag,
    FieldAsyncArrayModel,
}


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
            FieldAsyncTag:[2],
            FieldAsyncArrayModel:[2],
        };

        const fields = [
            "FieldTag",
            "FieldArrayModel",
            "FieldAsyncTag",
            "FieldAsyncArrayModel",
        ];

        fields.forEach((field)=>{
            this[`handle${field}Change`] = this.handleChange.bind(this,field);
        });


        this.config = {
            FieldTag:{
                candidate:FieldTagCandidate,
                labelfield:"name",
                valuefield:"id",
            },
            FieldArrayModel:{
                candidate:FieldArrayModelCandidate,
                labelfield:"name",
                valuefield:"id",
            },
            FieldAsyncTag:{
                getCandidate:this.getAsyncCandidate.bind(null,FieldTagCandidate),
                labelfield:"name",
                valuefield:"id",
            },
            FieldAsyncArrayModel:{
                getCandidate:this.getAsyncCandidate.bind(null,FieldArrayModelCandidate),
                labelfield:"name",
                valuefield:"id",
            },
        }
    
    
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


    getAsyncCandidate(enums,cb){
        setTimeout(()=>{
            cb(enums);
        },1000);
    }

    render(){
        return (
            <TestTable>
                <React.Fragment>
                    {this.renderField('FieldTag')}
                    {this.renderField('FieldArrayModel')}
                    {this.renderField('FieldAsyncTag')}
                    {this.renderField('FieldAsyncArrayModel')}
                </React.Fragment>
            </TestTable>
        )
    }
}