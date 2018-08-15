import React from "react"
import PropTypes from "prop-types";

import MetaTable from "@/components/common/MetaTable"

import {
    observable,
    computed,
    reaction,
    action,
} from "mobx"

import {
    observer
} from "mobx-react"

@observer
export default class Editor extends React.Component{
    @observable labelComponentsInjected = false;
    @observable editorComponentsInjected = false;

    @computed get fieldsPlain(){
        return this.props.fields.reduce((arr,row)=>{
            row.reduce((arr,field)=>{
                arr.push(field);
                return arr;
            },arr);
            return arr;
        },[]);
    }

    @computed get formData(){
        return this.fieldsPlain.reduce((obj,field)=>{
            obj[field] = this.props.record[this.field];
            return obj;
        },{});
    }

    @computed get needInjectLabelComponents(){

    }

    @computed get needInjectEditorComponents(){

    }

    @computed get hasInjectComponent(){

    }

    @computed get componentsInjected(){

    }



    constructor(props){
        super(props);
        this.state = {

        };

        this.$refs = {};

        reaction(()=>{
            return {
                record:this.props.record
            }
        },()=>{
            console.log("watch record")
        },{
            fireImmediately:true,
        });
    }

    setRef(refKey,refValue){
        this.$refs[refKey] = refValue;
    }

    renderLabel = ({field})=>{
        return (
            <div>{field}</div>
        )
    }

    renderField = ({field})=>{
        return (
            <div>{this.props.record[field]}</div>
        )
    }

    render(){
        return (
            <MetaTable
                fieldList={this.props.fieldList}
                fields={this.props.fields}
                mode={this.props.mode}
                renderLabel={this.renderLabel}
                renderField={this.renderField}
            ></MetaTable>
        )
    }
}

Editor.propTypes = {
    fieldList:PropTypes.object.isRequired,
    fields:PropTypes.array.isRequired,
    record:PropTypes.object.isRequired,
    mode:PropTypes.string.isRequired,
}

