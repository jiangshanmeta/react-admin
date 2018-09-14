import React from "react"
import PropTypes from "prop-types";

import {
    observable,
    computed,
    reaction,
    action,
    toJS,
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

const defaultEditorComponent = {
    FieldString:()=>import("./FieldString").then(rst=>rst.default),
    FieldPwd:()=>import("./FieldPwd").then(rst=>rst.default),
    FieldText:()=>import("./FieldText").then(rst=>rst.default),
    FieldNumber:()=>import("./FieldNumber").then(rst=>rst.default),
    FieldInt:()=>import("./FieldInt").then(rst=>rst.default),
    FieldTextRich:()=>import("./FieldTextRich").then(rst=>rst.default),

    FieldEnumRadio:()=>import("./FieldEnumRadio").then(rst=>rst.default),
    FieldEnumSelect:()=>import("./FieldEnumSelect").then(rst=>rst.default),
    FieldModel:()=>import("./FieldModel").then(rst=>rst.default),
    FieldAsyncEnumRadio:()=>import("./FieldAsyncEnumRadio").then(rst=>rst.default),
    FieldAsyncEnumSelect:()=>import("./FieldAsyncEnumSelect").then(rst=>rst.default),
    FieldAsyncModel:()=>import("./FieldAsyncModel").then(rst=>rst.default),

    FieldTag:()=>import("./FieldTag").then(rst=>rst.default),
    FieldArrayModel:()=>import("./FieldArrayModel").then(rst=>rst.default),
    FieldAsyncTag:()=>import("./FieldAsyncTag").then(rst=>rst.default),
    FieldAsyncArrayModel:()=>import("./FieldAsyncArrayModel").then(rst=>rst.default),
    FieldTagJSON:()=>import("./FieldTagJSON").then(rst=>rst.default),
    FieldArrayModelJSON:()=>import("./FieldArrayModelJSON").then(rst=>rst.default),
    FieldAsyncTagJSON:()=>import("./FieldAsyncTagJSON").then(rst=>rst.default),
    FieldAsyncArrayModelJSON:()=>import("./FieldAsyncArrayModelJSON").then(rst=>rst.default),
};


@observer
export default class Editor extends React.Component{
    @observable record = {};
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
        const record = toJS(this.record)
        return this.fieldsPlain.reduce((obj,field)=>{
            obj[field] = record[field];
            return obj;
        },{});
    }

    @computed get needInjectLabelComponents(){
        return filterLabelComponents(this.props.fieldList,this.fieldsPlain,this.props.mode);
    }

    @computed get needInjectEditorComponents(){
        return this.fieldsPlain.map((field)=>{
            const editorComponentConfig = this.props.fieldList[field].editorComponent;
            let component;
            if(editorComponentConfig.component){
                component = editorComponentConfig.component;
            }else if(editorComponentConfig.name){
                component = defaultEditorComponent[editorComponentConfig.name];
            }
            
            return {
                name:field,
                component,
            };
        });
    }

    @computed get hasInjectComponent(){
        return this.needInjectLabelComponents.list.length || this.needInjectEditorComponents.length;
    }

    @computed get componentsInjected(){
        return this.labelComponentsInjected && this.editorComponentsInjected;
    }

    constructor(props){
        super(props);

        this.$refs = {};

        this.labelComponents = {};
        this.editorComponents = {};

        this.onChangeMap = {};
        this.$refs = {};
        this.recordUnwatchs = [];

        reaction(()=>{
            return this.props.record;
        },this.recordChangeHandler,{
            fireImmediately:true,
        });

        reaction(()=>{
            return this.props.fields;
        },this.fieldsChangeHandler,{
            fireImmediately:true,
        });

        reaction(()=>{
            return {
                record:this.props.record,
                fields:this.props.fields,
            }
        },this.resetRelates,{
            fireImmediately:true,
        });

    }

    onChange(field,value){
        this.record[field] = value;
    }

    @action
    fieldsChangeHandler = ()=>{
        this.onChangeMap = {};
        this.fieldsPlain.forEach((field)=>{
            this.onChangeMap[field] = this.onChange.bind(this,field);
        });

        this.labelComponentsInjected = false;
        this.editorComponentsInjected = false;
        this.injectLabelComponents();
        this.injectEditorComponents();

        this.$refs = {};
        this._setRefMap = this.fieldsPlain.reduce((obj,field)=>{
            obj[field] = this.setRef.bind(this,field)
            return obj;
        },{});

    }

    getRelateData(relateItem){
        // support multi and mono relate field
        if(Array.isArray(relateItem.relateField)){
            return relateItem.relateField.reduce((obj,relateField)=>{
                obj[relateField] = this.record[relateField];
                return obj;
            },{});
        }else{
            return this.record[relateItem.relateField];
        }
    }

    resetRelates = ()=>{
        this.recordUnwatchs.forEach((unwatch)=>{
            unwatch();
        });
        this.recordUnwatchs = [];

        this.fieldsPlain.forEach((field)=>{
            const editorComponent = this.props.fieldList[field].editorComponent;
            if(!editorComponent || !editorComponent.config || !editorComponent.config.relates){
                return;
            }
            const relates = editorComponent.config.relates;

            relates.filter(item=>typeof item.handler === 'function').forEach((relateItem)=>{
                const callback = function(newVal){
                    if(this.$refs[field]){
                        relateItem.handler.call(this.$refs[field],newVal);
                    }else{
                        setTimeout(()=>{
                            callback.call(this,newVal);
                        },0);
                    }
                };

                const unwatch = reaction(()=>{
                    return this.getRelateData(relateItem);
                },callback.bind(this),relateItem.config)

                this.recordUnwatchs.push(unwatch);

            });

        });
    }

    @action
    recordChangeHandler = ()=>{
        this.record = JSON.parse(JSON.stringify(this.props.record));
    }

    injectLabelComponents(){

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

        injectComponents(this.needInjectEditorComponents,this.editorComponents).then(()=>{
            this.editorComponentsInjected = true;
        });
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
        const Component = this.editorComponents[field];
        const fieldConfig = this.props.fieldList[field];
        const editorConfigs = fieldConfig.editorComponent;

        const defaultConfig = editorConfigs.config || {};
        const modeConfig = editorConfigs[`${this.props.mode}Config`] || {};
        const config = Object.assign({},defaultConfig,modeConfig);
        const tip = fieldConfig.tip;

        const {
            relates=[]
        } = config;

        const relateProps = relates.filter(item=>item.propField).reduce((obj,item)=>{
            obj[item.propField] = this.getRelateData(item);
            return obj;
        },Object.create(null));

        return (
            <React.Fragment>
                <Component
                    ref={this._setRefMap[field]}
                    value={this.record[field]}
                    onChange={this.onChangeMap[field]}
                    {...config}
                    {...relateProps}
                />
                {tip && <div className="form-helper">{tip}</div>}
            </React.Fragment>
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

