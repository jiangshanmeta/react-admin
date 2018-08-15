import React from "react"
import PropTypes from "prop-types";

import {
    observable,
    computed,
    reaction,
    action,
} from "mobx"

import {
    observer
} from "mobx-react"

import MetaTable from "@/components/common/MetaTable"
import Labels from "@/components/common/labels/Labels"

import filterLabelComponents from "@/injectHelper/labelComponentHelper"

import {
    injectComponents
} from "@/widget/injectComponents"

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
        return filterLabelComponents(this.props.fieldList,this.fieldsPlain,this.props.mode);
    }

    @computed get needInjectEditorComponents(){
        // TODO
        return [];
    }

    @computed get hasInjectComponent(){
        return this.needInjectLabelComponents.list.length || this.needInjectEditorComponents.length;
    }

    @computed get componentsInjected(){
        return this.labelComponentsInjected && this.editorComponentsInjected;
    }



    constructor(props){
        super(props);
        this.state = {

        };

        this.$refs = {};

        this.labelComponents = {};
        this.editorComponents = {};

        reaction(()=>{
            return {
                record:this.props.record
            }
        },this.reset,{
            fireImmediately:true,
        });
    }

    @action
    reset = ()=>{
        this.labelComponentsInjected = false;
        this.editorComponentsInjected = false;
        this.injectLabelComponents();
        this.injectEditorComponents();
    }

    injectLabelComponents(){
        console.log(this.needInjectLabelComponents.list);
        if(!this.needInjectLabelComponents.list.length){
            return this.labelComponentsInjected = true;
        }

        injectComponents(this.needInjectLabelComponents.list,this.labelComponents).then(()=>{
            this.labelComponentsInjected = true;
        });
    }

    injectEditorComponents(){
        if(!this.needInjectEditorComponents.length){
            return this.editorComponentsInjected = true;
        }
        // TODO
        

    }

    setRef(refKey,refValue){
        this.$refs[refKey] = refValue;
    }

    renderLabel = ({field})=>{
        const descriptor = this.props.fieldList[field];
        return (
            <Labels
                label={descriptor.label}
                Component={this.labelComponents[field]}
                labelComponent={this.needInjectLabelComponents.map[field]}
            />
        )
    }

    renderField = ({field})=>{
        return (
            <div>{this.props.record[field]}</div>
        )
    }

    render(){
        if(this.hasInjectComponent && !this.componentsInjected){
            return null;
        }

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

