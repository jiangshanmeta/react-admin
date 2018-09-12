import React from 'react';
import PropTypes from "prop-types";

import {
    Table,
} from "antd"


import {
    observable,
    reaction,
    action,
    toJS
} from "mobx";
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

        this.pageSize = props.pageSize;
        if(this.props.defaultSortField && this.props.defaultSortOrder){
            this.sortField = this.props.defaultSortField;
            this.sortOrder = this.props.defaultSortOrder;
        }

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
            loading:false,
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

        this.setState({
            loading:true,
        })
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
                    loading:false,
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
            },
            fieldList[field].tableColumnConfig || {},
            this.props.defaultSortField === field?{defaultSortOrder:this.props.defaultSortOrder}:{}
            );
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

    @action
    _handleTableChange = (pagination,filters,sorter)=>{
        this.pageIndex = pagination.current;
        this.pageSize = pagination.pageSize;

        if(this.sortField !== sorter.field || this.sortOrder !== sorter.order){
            this.pageIndex = 1;
        }
        this.sortField = sorter.field;
        this.sortOrder = sorter.order;
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

        let paginationConfig = false;
        if(this.props.paginated){
            paginationConfig = {
                ...this.props.paginationConfig,
                current:this.pageIndex,
                pageSize:this.pageSize,
                total:this.state.total,
            }
        }

        return (
            <Table
                rowKey={this.props.rowKey}
                columns={this._cacheColumns}
                dataSource={this.state.data}
                rowSelection={this._rowSelection}
                loading={this.state.loading}
                pagination={paginationConfig}
                onChange={this._handleTableChange}
                {...this.props.tableConfig}
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
    rowKey:PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
    ]),
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
    defaultSortField:PropTypes.string,
    defaultSortOrder:PropTypes.oneOf(['ascend','descend']),
    
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

    // pagination
    paginated:true,
    paginationConfig:{},
}
