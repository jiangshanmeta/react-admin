import React from "react"
import TestTable from "./_testTable"

import FilterEnum from "@/components/common/editor/FilterEnum"
import FilterAsyncEnum from "@/components/common/editor/FilterAsyncEnum"
import FilterModel from "@/components/common/editor/FilterModel"
import FilterAsyncModel from "@/components/common/editor/FilterAsyncModel"

const Components = {
    FilterEnum,
    FilterAsyncEnum,
    FilterModel,
    FilterAsyncModel,
};


const filter_enum_candidate = [
    {id:4,name:'value1'},
    {id:5,name:'value2'},
    {id:6,name:'value3'},
];

const filter_model_candidate = [
    {id:9,name:"张三"},
    {id:10,name:"张四"},
    {id:11,name:"李四"},
    {id:12,name:"李五"},
    {id:13,name:"王五"},
];

export default class Test_filter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            FilterEnum:"all",
            FilterAsyncEnum:-1,
            FilterModel:"all",
            FilterAsyncModel:"-1",
        }

        const fields = [
            "FilterEnum",
            "FilterAsyncEnum",
            "FilterModel",
            "FilterAsyncModel",
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
            FilterModel:{
                candidate:filter_model_candidate,
                valuefield:"id",
                labelfield:"name",
                allvalue:"all",
                alllabel:"全部",
            },
            FilterAsyncModel:{
                getCandidate:this.getAsyncCandidate.bind(this,filter_model_candidate),
                allvalue:"-1",
                alllabel:"不限8",
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
                    {this.renderField('FilterModel')}
                    {this.renderField("FilterAsyncModel")}
                </React.Fragment>
            </TestTable>
        );
    }    
}