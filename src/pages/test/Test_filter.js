import React from "react"
import TestTable from "./_testTable"

import FilterEnum from "@/components/common/editor/FilterEnum"
import FilterAsyncEnum from "@/components/common/editor/FilterAsyncEnum"

const Components = {
    FilterEnum,
    FilterAsyncEnum,
};


const filter_enum_candidate = [
    {id:4,name:'value1'},
    {id:5,name:'value2'},
    {id:6,name:'value3'},
];

export default class Test_filter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            FilterEnum:"all",
            FilterAsyncEnum:-1,
        }

        const fields = [
            "FilterEnum",
            "FilterAsyncEnum",
        ];

        fields.forEach((field)=>{
            this[`handle${field}Change`] = this.handleChange.bind(this,field);
        });

        this.config = {
            FilterEnum:{
                labelfield:"name",
                valuefield:"id",
                allvalue:"all",
                alllabel:"不限1",
                candidate:filter_enum_candidate,
            },
            FilterAsyncEnum:{
                getCandidate:this.getAsyncCandidate.bind(this,filter_enum_candidate),
                allvalue:-1,
                alllabel:"不限2",
                labelfield:"name",
                valuefield:"id",
            },


        };

    }

    getAsyncCandidate(enums,cb){
        setTimeout(()=>{
            cb(enums);
        },1000);
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
                    {this.renderField('FilterEnum')}
                    {this.renderField('FilterAsyncEnum')}
                </React.Fragment>
            </TestTable>
        );
    }    
}