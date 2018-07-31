import React from 'react';
import PropTypes from "prop-types";
import {
    Table
} from "element-react";

import {observable,computed,reaction,transaction} from "mobx";

import Views from "@/components/common/views/Views"


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

function tableColumnRender(fieldList,Components,data,{prop:field}){
    return <Views 
                data={data}
                descriptor={fieldList[field].view}
                field={field}
                Component={Components[field]}
            />
}

export default class ListInfo extends React.Component{
    @observable sortField = null;
    @observable sortOrder = 'descending';
    @observable pageIndex = 1;

    @computed get defaultSort(){
        return {
            prop:this.sortField,
            order:this.sortOrder,
        }
    }

    constructor(props){
        super(props);

        if(props.defaultSort){
            this.sortField = props.defaultSort.prop;
            this.sortOrder = props.defaultSort.order;
        }

        reaction(()=>{
            return {
                sortField:this.sortField,
                sortOrder:this.sortOrder,
                pageIndex:this.pageIndex,
            }
        },()=>this.getListInfo());

        this.state = {
            componentsInjected:false,
            data:[],
            formData:{},
            selectedData:[],
            fields:[],
            total:0,
        };

        this.isViewComponent = isViewComponent.bind(null,this.props.fieldList);
        
        this.fieldTableColumnMap = {};

        this.handleSortChange = this.handleSortChange.bind(this);
    }

    handleSortChange({prop,order}){

        transaction(()=>{
            this.sortField = prop;
            this.sortOrder = order;
            this.pageIndex = 1;
        })

    }

    getListInfo(){


        let params = {};
        params[this.props.sortFieldReqName] = this.sortField;
        params[this.props.sortOrderReqName] = this.sortOrder;

        return new Promise((resolve)=>{
            this.props.listRequest(resolve,this.props.transformRequestData(params))
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

    _setFieldTableColumnMap(fieldViewComponentMap){
        const fieldList = this.props.fieldList;
        const fieldRender = tableColumnRender.bind(null,fieldList,fieldViewComponentMap);
        this.fieldTableColumnMap = Object.keys(fieldList).reduce((obj,field)=>{
            obj[field] = Object.assign({
                prop:field,
                label:fieldList[field].label,
                sortable:this.props.sortFields.includes(field)?'custom':false,
                render:fieldRender
            },fieldList[field].tableColumnConfig || {});
            return obj;
        },{});
    }

    importViewComponent(){
        const fieldViewComponentMap = {};
        
        if(!this.hasViewComponent){
            this._setFieldTableColumnMap(fieldViewComponentMap);
            return;
        }
        const fieldList = this.props.fieldList;
        const fields = Object.keys(fieldList);
        const hasViewComponentFields = fields.filter(this.isViewComponent);
        const components = hasViewComponentFields.map((field)=>{
            return {
                name:field,
                component:fieldList[field].view.component,
            }
        })
        
        new Promise((resolve)=>{
            injectComponents(components,fieldViewComponentMap,resolve)
        }).then(()=>{
            this._setFieldTableColumnMap(fieldViewComponentMap)
            this.setState({
                componentsInjected:true,
            })
        }).catch(logError);
    }


    componentDidMount(){
        this.getListInfo();
        this.importViewComponent();

    }


    renderTable(){
        if(this.state.data.length === 0 || this.state.fields.length === 0){
            return null;
        }

        const columns = this.state.fields.map((field)=>this.fieldTableColumnMap[field]);

        if(this.props.selection){
            columns.unshift({
                type:'selection',
            });
        }

        return (
            <Table
                columns={columns}
                data={this.state.data}
                onSortChange={this.handleSortChange}
                defaultSort={this.defaultSort}
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
    sortFieldReqName:PropTypes.string,
    sortOrderReqName:PropTypes.string,
    defaultSort:PropTypes.object,
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
    sortFieldReqName:"sortField",
    sortOrderReqName:"sortOrder",
    defaultSort:null,
}
