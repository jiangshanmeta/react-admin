import React from "react"

import FieldEnumRadio from "@/components/common/editor/FieldEnumRadio"

const FieldEnumRadioCandidate = [
    {label:"item0",value:0},
    {label:"item1",value:1},
    {label:"item2",value:2},
]

export default class Test_enum extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            FieldEnumRadio:0,
        }

        this.handleFieldEnumRadioChange = this.handleChange.bind(this,'FieldEnumRadio')
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
                </tbody>
            </table>
        );
    }
}