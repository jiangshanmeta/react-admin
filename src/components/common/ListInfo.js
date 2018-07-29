import React from 'react';
import PropTypes from "prop-types";
import {
    Table
} from "element-react";


import {
    logError,
    identity,
} from "@/widget/utility"



export default class ListInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data:[],
            formData:{},
            selectedData:[],
            fields:[],
        };
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

    componentDidMount(){
        this.getListInfo();
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
