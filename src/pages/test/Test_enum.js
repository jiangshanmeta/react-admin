import React from "react"

import FieldEnumRadio from "@/components/common/editor/FieldEnumRadio"
import FieldEnumSelect from "@/components/common/editor/FieldEnumSelect"
import FieldModel from "@/components/common/editor/FieldModel"

import FieldAsyncEnumRadio from "@/components/common/editor/FieldAsyncEnumRadio"
import FieldAsyncEnumSelect from "@/components/common/editor/FieldAsyncEnumSelect"
import FieldAsyncModel from "@/components/common/editor/FieldAsyncModel"


const FieldEnumRadioCandidate = [
    {label:"item0",value:0},
    {label:"item1",value:1},
    {label:"item2",value:2},
]

function aaa(){
    console.log(123)
    return FieldEnumRadioCandidate
}


const FieldEnumSelectCandidate = [
    {label:"itemA",value:0},
    {label:"itemB",value:1},
    {label:"itemC",value:2},
];

const FieldModelCandidate = [
    {label:"itemA",value:0},
    {label:"itemB",value:1},
    {label:"itemC",value:2},
    {label:"itemD",value:3},
    {label:"itemE",value:4},
    {label:"itemF",value:5},
    {label:"itemG",value:6},
    {label:"itemH",value:7},
    {label:"itemI",value:8},
    {label:"itemJ",value:9},
    {label:"itemK",value:10},
    {label:"itemL",value:11},
];




export default class Test_enum extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            FieldEnumRadio:0,
            FieldEnumSelect:1,
            FieldModel:0,
            FieldAsyncEnumRadio:1,
            FieldAsyncEnumSelect:2,
            FieldAsyncModel:6,
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

        this.getAsyncEnumRadioCandidate = this.getAsyncCandidate.bind(null,FieldEnumRadioCandidate)
        this.getAsyncEnumSelectCandidate = this.getAsyncCandidate.bind(null,FieldEnumSelectCandidate)
        this.getAsyncModelCandidate = this.getAsyncCandidate.bind(null,FieldModelCandidate)
    
    }


    handleChange(field,value){
        this.setState({
            [field]:value
        })
    }

    renderFieldEnumRadio(){
        return (
            <tr>
                <td>FieldEnumRadio</td>
                <td>{this.state.FieldEnumRadio}</td>
                <td>
                    <FieldEnumRadio
                        value={this.state.FieldEnumRadio}
                        onChange={this.handleFieldEnumRadioChange}
                        candidate={FieldEnumRadioCandidate}
                    ></FieldEnumRadio>
                </td>
            </tr>
        )
    }

    renderFieldEnumSelect(){
        return (
            <tr>
                <td>FieldEnumSelect</td>
                <td>{this.state.FieldEnumSelect}</td>
                <td>
                    <FieldEnumSelect 
                        value={this.state.FieldEnumSelect}
                        onChange={this.handleFieldEnumSelectChange}
                        candidate={FieldEnumSelectCandidate}
                    />
                </td>
            </tr>
        )
    }

    renderFieldModel(){
        return (
            <tr>
                <td>FieldModel</td>
                <td>{this.state.FieldModel}</td>
                <td>
                    <FieldModel
                        value={this.state.FieldModel}
                        onChange={this.handleFieldModelChange}
                        candidate={FieldModelCandidate}
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

    renderFieldAsyncEnumRadio(){
        return (
            <tr>
                <td>FieldAsyncEnumRadio</td>
                <td>{this.state.FieldAsyncEnumRadio}</td>
                <td>
                    <FieldAsyncEnumRadio
                        value={this.state.FieldAsyncEnumRadio}
                        onChange={this.handleFieldAsyncEnumRadioChange}
                        getCandidate={this.getAsyncEnumRadioCandidate}
                    />
                </td>
            </tr>
        )
    }

    renderFieldAsyncEnumSelect(){
        return (
            <tr>
                <td>FieldAsyncEnumSelect</td>
                <td>{this.state.FieldAsyncEnumSelect}</td>
                <td>
                    <FieldAsyncEnumSelect
                        value={this.state.FieldAsyncEnumSelect}
                        onChange={this.handleFieldAsyncEnumSelectChange}
                        getCandidate={this.getAsyncEnumSelectCandidate}
                    />
                </td>
            </tr>
        );
    }

    renderFieldAsynModel(){
        return (
            <tr>
                <td>FieldAsyncModel</td>
                <td>{this.state.FieldAsyncModel}</td>
                <td>
                    <FieldAsyncModel
                        value={this.state.FieldAsyncModel}
                        onChange={this.handleFieldModelChange}
                        getCandidate={this.getAsyncModelCandidate}
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
                    {this.renderFieldEnumRadio()}
                    {this.renderFieldEnumSelect()}
                    {this.renderFieldModel()}
                    {this.renderFieldAsyncEnumRadio()}
                    {this.renderFieldAsyncEnumSelect()}
                    {this.renderFieldAsynModel()}
                </tbody>
            </table>
        );
    }
}