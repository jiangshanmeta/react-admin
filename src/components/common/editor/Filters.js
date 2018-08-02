import React from "react";
import PropTypes from "prop-types";
import {
    Form
} from "element-react";

import {
    injectComponents
} from "@/widget/injectComponents"

import {
    logError,
} from "@/widget/utility"

import FieldString from "./FieldString"
import FieldEnumSelect from "./FieldEnumSelect"


const defaultFilterComponents = {
    FieldString,
    FieldEnumSelect,
};



export default class Filters extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            componentsInjected:false,
            formData:props.filters.reduce((obj,{field,editorComponent})=>{
                const defaultConfig = editorComponent.default;
                obj[field] = typeof defaultConfig === 'function'?defaultConfig.call(this):defaultConfig;
                return obj;
            },{}),
        };

        this._changeHandlerMap = props.filters.reduce((obj,{field})=>{
            obj[field] = this._handleFieldChange.bind(this,field)
            return obj;
        },{});

        this._hasInjectFilterComponent = props.filters.some((item)=>{
            return item.editorComponent.component;
        });

        this.filterComponents = Object.assign({},defaultFilterComponents);
        this._importFilterComponents();
    }
    
    get formData(){
        return JSON.parse(JSON.stringify(this.state.formData));
    }


    _importFilterComponents(){
        if(!this._hasInjectFilterComponent){
            return;
        }

        const components = this.props.filters.reduce((arr,{editorComponent})=>{
            if(editorComponent.component){
                arr.push({
                    name:editorComponent.name,
                    component:editorComponent.component,
                });
            }
            return arr;
        },[]);

        new Promise((resolve)=>{
            injectComponents(components,this.filterComponents,resolve)
        }).then(()=>{
            this.setState({
                componentsInjected:true,
            });
        }).catch(logError);
        

    }

    _handleFieldChange(field,value){
        this.setState({
            formData:Object.assign({},this.state.formData,{[field]:value}),
        });
    }

    render(){
        if(this._hasInjectFilterComponent && !this.state.componentsInjected){
            return null;
        }

        return (
            <Form inline={true}>
                {this.props.filters.map((item)=>{
                    const editorComponent = item.editorComponent;
                    const Component = this.filterComponents[editorComponent.name];
                    return (
                        <Form.Item key={item.field} label={item.label}>
                            <Component
                                value={this.state.formData[item.field]}
                                onChange={this._changeHandlerMap[item.field]}
                                {...(editorComponent.config || {})}
                            />
                        </Form.Item>
                    )

                })}
            </Form>
        )
    }

}

Filters.propTypes = {
    fieldList:PropTypes.object.isRequired,
    filters:PropTypes.array,
    filterOperators:PropTypes.array,
}

Filters.defaultProps = {
    filters:[],
    filterOperators:[],
}