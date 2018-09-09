import React from 'react';
import PropTypes from "prop-types";

import {
    Table,
    Pagination
} from "antd"


import {observable,computed,reaction,action,toJS} from "mobx";
import {observer} from 'mobx-react'

import Views from "@/components/common/views/Views"
import Operators from "@/components/common/operators/Operators"


import {
    logError,
    identity,
} from "@/widget/utility"

import {
    injectComponents
} from "@/widget/injectComponents"

import Filters from "@/components/common/editor/Filters"

@observer
export default class ListInfo extends React.Component{
    @observable sortField = null;
    @observable sortOrder = null;
    @observable pageIndex = 1;
    @observable pageSize = 20;
    @observable multipleSelection = [];


    get _formData(){
        return this.$refs.filters && this.$refs.filters.formData;
    }

    constructor(props){
        super(props);

        this.operatorMinWidth = 0;

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
            fields:[],
            total:0,
        };


        this.$refs = {};
        this._setFiltersRef = this._setRef.bind(this,'filters');

        this._fieldTableColumnMap = {};

        this._needInjectViewComponents = Object.keys(props.fieldList).filter((field)=>{
            return props.fieldList[field].view && props.fieldList[field].view.component;
        }).map((field)=>{
            return {
                name:field,
                component:props.fieldList[field].view.component,
            }
        });

        this._cacheColumns = null;
        this._rowSelection = null;
        this._injectViewComponents();
        this.getListInfo();
    }

    _setRef(refName,refValue){
        this.$refs[refName] = refValue;
    }

    @action
    _handleSortChange = ({field,order})=>{
        this.sortField = field;
        this.sortOrder = order;
        this.pageIndex = 1;
    }

    @action
    _handleCurrentChange = (pageIndex)=>{
        this.pageIndex = pageIndex;
    }

    @action
    _handleSizeChange = (pageIndex,pageSize)=>{
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
    }

    @action
    _handleSelectChange = (selection)=>{
        this.multipleSelection = selection;
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

        this._fieldTableColumnMap = Object.keys(fieldList).reduce((obj,field)=>{
            obj[field] = Object.assign({
                key:field,
                dataIndex:field,
                title:fieldList[field].label,
                sorter:this.props.sortFields.includes(field),
                // sortable:this.props.sortFields.includes(field)?'custom':false,
                render:(fieldValue,data)=>{
                    return (
                        <Views
                            data={data}
                            descriptor={fieldList[field].view}
                            field={field}
                            Component={fieldViewComponentMap[field]}
                        />
                    )
                }
            },fieldList[field].tableColumnConfig || {});
            return obj;
        },{});
    }

    _injectViewComponents(){
        const fieldViewComponentMap = {};

        if(!this._needInjectViewComponents.length){
            return this._setFieldTableColumnMap(fieldViewComponentMap);
        }

        injectComponents(this._needInjectViewComponents,fieldViewComponentMap).then(()=>{
            this._setFieldTableColumnMap(fieldViewComponentMap)
            this.setState({
                componentsInjected:true,
            })
        }).catch(logError);

    }

    _setCacheColumns(){
        const columns = this.state.fields.map((field)=>this._fieldTableColumnMap[field]);

        if(this.props.selection){
            const onChange = (selectedRowKeys, selectedRows)=>{
                this._handleSelectChange(selectedRows);
            };
            this._rowSelection = {
                onChange,
            }
        }

        if(this.props.operators.length){
            columns.push({
                title:this.props.operatorsLabel,
                render:(fieldValue,data)=>{
                    return (
                        <Operators
                            data={data}
                            fieldList={this.props.fieldList}
                            operators={this.props.operators}
                            onUpdate={this.getListInfo}
                        />
                    )
                },
            });
        }
        this._cacheColumns = columns;
    }

    _handleTableChange = (...args)=>{
        this._handleSortChange(args[2]);
    }

    _renderTable(){
        if(this.state.data.length === 0 || this.state.fields.length === 0){
            return null;
        }

        if(this._needInjectViewComponents.length && !this.state.componentsInjected){
            return null;
        }

        if(!this._cacheColumns){
            this._setCacheColumns();
        }

        return (
            <Table
                rowKey={this.props.rowKey}
                columns={this._cacheColumns}
                dataSource={this.state.data}
                rowSelection={this._rowSelection}

                onChange={this._handleTableChange}
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

    _renderPagination(){
        if(!this.props.paginated || this.state.data.length === 0){
            return null;
        }

        return (
            <Pagination
                current={this.pageIndex}
                pageSize={this.pageSize}
                total={this.state.total}
                onChange={this._handleCurrentChange}
                onShowSizeChange={this._handleSizeChange}
                {...this.props.paginationConfig}
            />
        )
    }

    render(){
        if(Object.keys(this.props.fieldList).length === 0){
            return null;
        }

        const beforeAfterFilterData = {
            data:this.state.data,
            formData:this._formData,
            selectedData:toJS(this.multipleSelection),
        };

        return (
            <section>
                {this.props.beforeFilters(beforeAfterFilterData)}
                <Filters
                    ref={this._setFiltersRef}
                    fieldList={this.props.fieldList}
                    filters={this.props.filters}
                    filterOperators={this.props.filterOperators}
                    onSearch={this.getListInfo}
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
    rowKey:PropTypes.string,
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
    
    operators:PropTypes.array,
    operatorsLabel:PropTypes.string,

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
    rowKey:"id",
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

    operators:[],
    operatorsLabel:"操作",

    emptyText:"暂无数据",

    // pagination
    paginated:true,
    paginationConfig:{},
}
