import React from "react";
import PropTypes from "prop-types";
import {
    Form
} from "element-react";

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

import {
    logError,
} from "@/widget/utility"

import FieldString from "./FieldString"
import FieldNumber from "./FieldNumber"
import FieldEnumSelect from "./FieldEnumSelect"

const defaultFilterComponents = {
    FieldString,
    FieldNumber,
    FieldEnumSelect,
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

        this._hasInjectFilterComponent = props.filters.some((item)=>{
            return item.editorComponent.component;
        });

        const watchFilters = props.filters.filter(item=>item.watch);
        if(watchFilters.length){
            reaction(()=>{
                return watchFilters.map(item=>this._formData[item.field]);
            },this.search);
        }

        this.filterComponents = Object.assign({},defaultFilterComponents);
        this._importFilterComponents();
    }

    search = ()=>{
        this.props.onSearch && this.props.onSearch();
    }
    
    get formData(){
        return JSON.parse(JSON.stringify(this._formData));
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
        this._formData[field] = value;
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
                                value={this._formData[item.field]}
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
    onSearch:PropTypes.func,
}

Filters.defaultProps = {
    filters:[],
    filterOperators:[],
}