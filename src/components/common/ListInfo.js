import React from 'react';
import PropTypes from "prop-types";
import {
    Table
} from "element-react";


import {
    logError,
    identity,
} from "@/widget/utility"

import {
    injectComponents
} from "@/widget/injectComponents"


function isViewComponent(fieldList,field){
    return fieldList[field].view && fieldList[field].view.component;
}

export default class ListInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            componentsInjected:false,
            data:[],
            formData:{},
            selectedData:[],
            fields:[],
            total:0,
        };

        this.viewComponents = {};
        this.fieldViewComponentMap = {};

        this.isViewComponent = isViewComponent.bind(null,this.props.fieldList);
    }

    getListInfo(){

        return new Promise((resolve)=>{
            this.props.listRequest(resolve)
        }).then((rst)=>{
            let {data,total,fields} = rst;
            let promise = this.props.transformListData(data);
            if(!(promise instanceof Promise)){
                promise = Promise.resolve(promise);
            }

            promise.then((data)=>{
                this.setState({
                    fields,
                    total,
                    data,
                });
            });

        }).catch(logError);
    }

    get hasViewComponent(){
        return Object.keys(this.props.fieldList).some(this.isViewComponent);
    }

    importViewComponent(){
        if(this.hasViewComponent){
            const fieldList = this.props.fieldList;
            const fields = Object.keys(fieldList);
            const hasViewComponentFields = fields.filter(this.isViewComponent);
            const components = hasViewComponentFields.map((field)=>{
                return {
                    name:fieldList[field].view.name,
                    component:fieldList[field].view.component,
                }
            })

            new Promise((resolve)=>{
                injectComponents(components,this.viewComponents,resolve)
            }).then(()=>{

                const fieldViewComponentMap = this.fieldViewComponentMap;
                const viewComponents = this.viewComponents;

                hasViewComponentFields.forEach((field)=>{
                    fieldViewComponentMap[field] = viewComponents[fieldList[field].view.name]  
                });

                this.setState({
                    componentsInjected:true,
                })

            }).catch(logError);

            console.log(components)
        }
    }

    componentDidMount(){
        this.getListInfo();

        this.importViewComponent();

    }


    renderTable(){
        if(this.state.data.length === 0 || this.state.fields.length === 0){
            return null;
        }

        const columns = this.state.fields.map((field)=>{
            const descriptor = this.props.fieldList[field];
            return Object.assign({},{
                prop:field,
                label:descriptor.label,
                sortable:this.props.sortFields.includes(field),
            },descriptor.tableColumnConfig || {});

        });

        if(this.props.selection){
            columns.unshift({
                type:'selection',
            });
        }

        return (
            <Table
                columns={columns}
                data={this.state.data}
            />
        )

        
    }

    renderEmptyDataTip(){
        return null;
    }

    renderPagination(){
        return null;
    }

    render(){
        if(Object.keys(this.props.fieldList).length === 0 || (this.hasViewComponent && !this.state.componentsInjected) ){
            return null;
        }


        const beforeAfterFilterData = {
            data:this.state.data,
            formData:this.state.formData,
            selectedData:this.state.formData,
        };

        return (
            <section>
                {this.props.beforeFilters(beforeAfterFilterData)}

                <div>
                    filter todo
                </div>

                {this.props.afterFilters(beforeAfterFilterData)}


                {this.renderTable()}
                {this.renderEmptyDataTip()}
                {this.renderPagination()}
                

            </section>
        )
    }
}

ListInfo.propTypes = {
    beforeFilters:PropTypes.func,
    afterFilters:PropTypes.func,

    selection:PropTypes.bool,
    listRequest:PropTypes.func.isRequired,
    transformRequestData:PropTypes.func,
    transformListData:PropTypes.func,
    sortFields:PropTypes.array,
}

function renderNull(info){
    return null;
}

ListInfo.defaultProps = {
    beforeFilters:renderNull,
    afterFilters:renderNull,

    selection:false,
    transformRequestData:identity,
    transformListData:identity,
    sortFields:[],
}
