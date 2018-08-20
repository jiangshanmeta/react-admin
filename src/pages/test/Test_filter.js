import React from "react"
import TestTable from "./_testTable"

import FilterEnum from "@/components/common/editor/FilterEnum"


const Components = {
    FilterEnum,
};

export default class Test_filter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            FilterEnum:"all",
        }

        const fields = [
            "FilterEnum",
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
                candidate:[
                    {id:4,name:'value1'},
                    {id:5,name:'value2'},
                    {id:6,name:'value3'},
                ],
            },
        };

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
                </React.Fragment>
            </TestTable>
        );
    }    
}