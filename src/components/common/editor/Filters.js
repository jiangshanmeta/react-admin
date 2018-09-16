import React from "react";
import PropTypes from "prop-types";
import {
    Form,
    Button,
} from "antd";

import {
    observable,
    reaction,
} from "mobx";

import {
    observer
} from "mobx-react"

import {
    injectComponents
} from "@/widget/injectComponents"

import Operators from "@/components/common/operators/Operators"

import {
    logError,
} from "@/widget/utility"


const defaultFilterComponents = {
    FieldString:()=>import("./FieldString").then(rst=>rst.default),
    FieldNumber:()=>import("./FieldNumber").then(rst=>rst.default),
    FieldEnumSelect:()=>import("./FieldEnumSelect").then(rst=>rst.default),
    FilterEnum:()=>import("./FilterEnum").then(rst=>rst.default),
    FilterModel:()=>import("./FilterModel").then(rst=>rst.default),
    FilterAsyncEnum:()=>import("./FilterAsyncEnum").then(rst=>rst.default),
    FilterAsyncModel:()=>import("./FilterAsyncModel").then(rst=>rst.default),
    FilterRelatesEnum:()=>import("./FilterRelatesEnum").then(rst=>rst.default),
    FilterRelatesModel:()=>import("./FilterRelatesModel").then(rst=>rst.default),
};


@observer
export default class Filters extends React.Component{
    @observable _formData = {};
    constructor(props){
        super(props);
        this.state = {
            componentsInjected:false,
        };

        this._formData = props.filters.reduce((obj,{field,editorComponent})=>{
            const defaultConfig = editorComponent.default;
            obj[field] = typeof defaultConfig === 'function'?defaultConfig.call(this):defaultConfig;
            return obj;
        },{});

        this._changeHandlerMap = props.filters.reduce((obj,{field})=>{
            obj[field] = this._handleFieldChange.bind(this,field)
            return obj;
        },{});

        const watchFilters = props.filters.filter(item=>item.watch);
        if(watchFilters.length){
            reaction(()=>{
                return watchFilters.map(item=>this._formData[item.field]);
            },this.search);
        }

        this.filterComponents = {};
        this._importFilterComponents();

        this.$refs = {};
        this._setRefMap = {};
        this._initRelates();
    }

    search = ()=>{
        this.props.onSearch && this.props.onSearch();
    }
    
    get formData(){
        return JSON.parse(JSON.stringify(this._formData));
    }


    _importFilterComponents(){
        if(!this.props.filters.length){
            return;
        }

        const components = this.props.filters.reduce((arr,{field,editorComponent})=>{
            let filterComponent;
            if(editorComponent.component){
                filterComponent = editorComponent.component;
            }else if(editorComponent.name){
                filterComponent = defaultFilterComponents[editorComponent.name];
            }

            if(filterComponent){
                arr.push({
                    name:field,
                    component:filterComponent,
                })
            }

            return arr;
        },[]);

        injectComponents(components,this.filterComponents).then(()=>{
            this.setState({
                componentsInjected:true,
            })
        }).catch(logError);

    }

    _setRef(refName,refValue){
        this.$refs[refName] = refValue;
    }

    _getRelateData(relateItem){
        if(Array.isArray(relateItem.relateField)){
            return relateItem.relateField.reduce((obj,field)=>{
                obj[field] = this._formData[field];
                return obj;
            },{});
        }else{
            return this._formData[relateItem.relateField]
        }
    }

    _initRelates(){
        this.props.filters.forEach(({field,editorComponent})=>{
            this._setRefMap[field] = this._setRef.bind(this,field);
            const config = editorComponent.config || {};
            const relates = config.relates || [];

            relates.filter((relateItem)=>typeof relateItem.handler === 'function').forEach((relateItem)=>{
                const callback = function(newVal){
                    if(this.$refs[field]){
                        relateItem.handler.call(this.$refs[field],newVal);
                    }else{
                        setTimeout(()=>{
                            callback.call(this,newVal);
                        },0);
                    }
                };

                reaction(()=>{
                    return this._getRelateData(relateItem);
                },callback.bind(this),relateItem.config)

            });

        });
    }

    _handleFieldChange(field,value){
        this._formData[field] = value;
    }

    render(){
        if(!this.props.filters.length || (!this.state.componentsInjected) ){
            return null;
        }

        return (
            <Form layout="inline">
                {this.props.filters.map((item)=>{
                    const Component = this.filterComponents[item.field];
                    const config = item.editorComponent.config || {};
                    const relates = config.relates || [];
                    const relateProps = relates.filter(item=>item.propField).reduce((obj,item)=>{
                        obj[item.propField] = this._getRelateData(item);
                        return obj;
                    },Object.create(null));

                    return (
                        <Form.Item key={item.field} label={item.label}>
                            <Component
                                ref={this._setRefMap[item.field]}
                                value={this._formData[item.field]}
                                onChange={this._changeHandlerMap[item.field]}
                                {...config}
                                {...relateProps}
                            />
                        </Form.Item>
                    )

                })}

                <Form.Item>
                    <section style={{display:'flex',fontSize:0,alignItems:'bottom'}}>
                        <Button
                            type="primary"
                            onClick={this.search}
                        >
                            查询
                        </Button>

                        {Boolean(this.props.filterOperators.length) && 
                        <Operators
                            fieldList={this.props.fieldList}
                            operators={this.props.filterOperators}
                            filters={this.props.filters}
                            data={this._formData}
                            onUpdate={this.onSearch}
                        />}
                    </section>
                </Form.Item>
            </Form>
        )
    }

}

Filters.propTypes = {
    fieldList:PropTypes.object.isRequired,
    filters:PropTypes.array,
    filterOperators:PropTypes.array,
    onSearch:PropTypes.func,
}

Filters.defaultProps = {
    filters:[],
    filterOperators:[],
}