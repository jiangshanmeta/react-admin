import React from 'react';
import PropTypes from "prop-types";
import {
    Table,
    Pagination,
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

import Filters from "@/components/common/editor/Filters"




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
    @observable sortOrder = null;
    @observable pageIndex = 1;
    @observable pageSize = 20;

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

        this.pageSize = props.pageSize;

        reaction(()=>{
            return {
                sortField:this.sortField,
                sortOrder:this.sortOrder,
                pageIndex:this.pageIndex,
                pageSize:this.pageSize,
            }
        },this.getListInfo);

        this.state = {
            componentsInjected:false,
            data:[],
            formData:{},
            selectedData:[],
            fields:[],
            total:0,
        };

        this.$refs = {};
        this._setFiltersRef = this._setRef.bind(this,'filters');

        this._fieldTableColumnMap = {};
        this.__isViewComponent = isViewComponent.bind(null,props.fieldList);
        this._hasViewComponent = Object.keys(props.fieldList).some(this.__isViewComponent);
        this._importViewComponent();
        this.getListInfo();
    }

    _setRef(refName,refValue){
        this.$refs[refName] = refValue;
    }

    _handleSortChange = ({prop,order})=>{
        transaction(()=>{
            this.sortField = prop;
            this.sortOrder = order;
            this.pageIndex = 1;
        })
    }

    getListInfo = ()=>{
        if(this.props.filters.length && !this.$refs.filters){
            setTimeout(this.getListInfo,0);
            return;
        }

        let params = {};

        if(this.props.filters.length){
            params = Object.assign(params,this.$refs.filters.formData);
        }

        params[this.props.sortFieldReqName] = this.sortField;
        params[this.props.sortOrderReqName] = this.sortOrder;
        if(this.props.paginated){
            params[this.props.pageSizeReqName] = this.pageSize;
            params[this.props.pageIndexReqName] = this.pageIndex;
        }

        console.log(params);

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



    _setFieldTableColumnMap(fieldViewComponentMap){
        const fieldList = this.props.fieldList;
        const fieldRender = tableColumnRender.bind(null,fieldList,fieldViewComponentMap);
        this._fieldTableColumnMap = Object.keys(fieldList).reduce((obj,field)=>{
            obj[field] = Object.assign({
                prop:field,
                label:fieldList[field].label,
                sortable:this.props.sortFields.includes(field)?'custom':false,
                render:fieldRender
            },fieldList[field].tableColumnConfig || {});
            return obj;
        },{});
    }

    _importViewComponent(){
        const fieldViewComponentMap = {};
        
        if(!this._hasViewComponent){
            this._setFieldTableColumnMap(fieldViewComponentMap);
            return;
        }
        const fieldList = this.props.fieldList;
        const fields = Object.keys(fieldList);
        const hasViewComponentFields = fields.filter(this.__isViewComponent);
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


    _renderTable(){
        if(this.state.data.length === 0 || this.state.fields.length === 0){
            return null;
        }

        const columns = this.state.fields.map((field)=>this._fieldTableColumnMap[field]);

        if(this.props.selection){
            columns.unshift({
                type:'selection',
            });
        }

        return (
            <Table
                columns={columns}
                data={this.state.data}
                onSortChange={this._handleSortChange}
                defaultSort={this.defaultSort}
                {...this.props.tableConfig}
            />
        )
    }

    _renderEmptyDataTip(){
        if(this.state.data.length){
            return null;
        }
        return (
            <section>{this.props.emptyText}</section>
        )
    }

    _handleCurrentChange = (pageIndex)=>{
        this.pageIndex = pageIndex;
    }

    _handleSizeChange = (pageSize)=>{
        this.pageSize = pageSize;
    }

    _renderPagination(){
        if(!this.props.paginated || this.state.data.length === 0){
            return null;
        }

        return (
            <Pagination
                currentPage={this.pageIndex}
                pageSize={this.pageSize}
                total={this.state.total}
                onCurrentChange={this._handleCurrentChange}
                onSizeChange={this._handleSizeChange}
                {...this.props.paginationConfig}
            />
        )
        
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
                <Filters
                    ref={this._setFiltersRef}
                    fieldList={this.props.fieldList}
                    filters={this.props.filters}
                    filterOperators={this.props.filterOperators}
                />
                {this.props.afterFilters(beforeAfterFilterData)}
                {this._renderTable()}
                {this._renderEmptyDataTip()}
                {this._renderPagination()}
            </section>
        )
    }
}

ListInfo.propTypes = {
    fieldList:PropTypes.object.isRequired,

    beforeFilters:PropTypes.func,
    filters:PropTypes.array,
    filterOperators:PropTypes.array,
    afterFilters:PropTypes.func,

    // data
    defaultSort:PropTypes.object,
    sortFieldReqName:PropTypes.string,
    sortOrderReqName:PropTypes.string,
    pageSize:PropTypes.number,
    pageSizeReqName:PropTypes.string,
    pageIndexReqName:PropTypes.string,
    transformRequestData:PropTypes.func,
    listRequest:PropTypes.func.isRequired,
    transformListData:PropTypes.func,

    // table
    tableConfig:PropTypes.object,
    selection:PropTypes.bool,
    sortFields:PropTypes.array,

    emptyText:PropTypes.string,
    
    // pagination
    paginated:PropTypes.bool,
    paginationConfig:PropTypes.object,

}

function renderNull(info){
    return null;
}

ListInfo.defaultProps = {
    beforeFilters:renderNull,
    filters:[],
    filterOperators:[],
    afterFilters:renderNull,

    // data
    defaultSort:null,
    sortFieldReqName:"sortField",
    sortOrderReqName:"sortOrder",
    pageSize:20,
    pageSizeReqName:"pageSize",
    pageIndexReqName:"pageIndex",
    transformRequestData:identity,
    transformListData:identity,


    // table
    tableConfig:{},
    selection:false,
    sortFields:[],

    emptyText:"暂无数据",

    // pagination
    paginated:true,
    paginationConfig:{},

}
