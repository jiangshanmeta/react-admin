import React from "react"

import FieldEnumRadio from "@/components/common/editor/FieldEnumRadio"
import FieldEnumSelect from "@/components/common/editor/FieldEnumSelect"
import FieldModel from "@/components/common/editor/FieldModel"

import FieldAsyncEnumRadio from "@/components/common/editor/FieldAsyncEnumRadio"
import FieldAsyncEnumSelect from "@/components/common/editor/FieldAsyncEnumSelect"
import FieldAsyncModel from "@/components/common/editor/FieldAsyncModel"

import TestTable from "./_testTable"

const Components = {
    FieldEnumRadio,
    FieldEnumSelect,
    FieldModel,
    FieldAsyncEnumRadio,
    FieldAsyncEnumSelect,
    FieldAsyncModel,
}


const FieldEnumRadioCandidate = [
    {label:"item0",value:0},
    {label:"item1",value:1},
    {label:"item2",value:2},
]

const FieldEnumSelectCandidate = [
    {label:"itemA",value:0},
    {label:"itemB",value:1},
    {label:"itemC",value:2},
];

const FieldModelCandidate = [
    {label:"itemA",value:10},
    {label:"itemB",value:11},
    {label:"itemC",value:12},
    {label:"itemD",value:13},
    {label:"itemE",value:14},
    {label:"itemF",value:15},
    {label:"itemG",value:16},
    {label:"itemH",value:17},
    {label:"itemI",value:18},
    {label:"itemJ",value:19},
    {label:"itemK",value:20},
    {label:"itemL",value:21},
];




export default class Test_enum extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            FieldEnumRadio:100,
            FieldEnumSelect:1,
            FieldModel:11,
            FieldAsyncEnumRadio:100,
            FieldAsyncEnumSelect:2,
            FieldAsyncModel:16,
        }

        const fields = [
            "FieldEnumRadio",
            "FieldEnumSelect",
            "FieldModel",
            "FieldAsyncEnumRadio",
            "FieldAsyncEnumSelect",
            "FieldAsyncModel",
        ];

        fields.forEach((field)=>{
            this[`handle${field}Change`] = this.handleChange.bind(this,field);
        })

    
        this.config = {
            FieldEnumRadio:{
                candidate:FieldEnumRadioCandidate,
                handleInvalidValue(value,setvalue){
                    this.props.onChange(setvalue[setvalue.length-1]);
                },
            },
            FieldEnumSelect:{
                candidate:FieldEnumSelectCandidate,
            },
            FieldModel:{
                candidate:FieldModelCandidate,
            },
            FieldAsyncEnumRadio:{
                getCandidate:this.getAsyncCandidate.bind(null,FieldEnumRadioCandidate),
                handleInvalidValue(value,setvalue){
                    console.log(value,setvalue);
                    this.props.onChange(setvalue[0]);
                },
            },
            FieldAsyncEnumSelect:{
                getCandidate:this.getAsyncCandidate.bind(null,FieldEnumSelectCandidate),
            },
            FieldAsyncModel:{
                getCandidate:this.getAsyncCandidate.bind(null,FieldModelCandidate)
            },


        }


    }


    handleChange(field,value){
        this.setState({
            [field]:value
        })
    }


    renderField(Field){
        const FieldComponent = Components[Field];

        return (
            <tr>
                <td>{Field}</td>
                <td>{this.state[Field]} || {typeof this.state[Field]}</td>
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
                    {this.renderField('FieldEnumRadio')}
                    {this.renderField('FieldEnumSelect')}
                    {this.renderField('FieldModel')}
                    {this.renderField('FieldAsyncEnumRadio')}
                    {this.renderField('FieldAsyncEnumSelect')}
                    {this.renderField('FieldAsyncModel')}
                </React.Fragment>
            </TestTable>
        );
    }
}