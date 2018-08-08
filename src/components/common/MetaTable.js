import React from 'react';
import PropTypes from "prop-types";
import {computed} from "mobx";
import {observer} from "mobx-react";

const defaultColspan = {
    label:1,
    field:1,
};

@observer
export default class MetaTable extends React.Component{
    @computed get colspanMapByField(){
        const {fieldList,mode} = this.props;

        return Object.keys(fieldList).reduce((obj,field)=>{
            let colspan = defaultColspan;
            const configColspan = fieldList[field].colspan;
            if(configColspan){
                if(configColspan[mode]){
                    colspan = configColspan[mode];
                }else if(configColspan.default){
                    colspan = configColspan[mode];
                }

                if(typeof colspan !== 'object'){
                    colspan = {
                        label:1,
                        field:colspan,
                    }
                }
            }

            obj[field] = colspan;
            return obj;
        },Object.create(null));
    }

    @computed get rowColspans(){
        return this.props.fields.map((row)=>{
            return row.reduce((count,field)=>{
                const colspanConfig = this.colspanMapByField[field];
                return count + colspanConfig.label + colspanConfig.field;
            },0);
        });
    }

    @computed get maxCol(){
        return Math.max(...this.rowColspans);
    }

    @computed get restCols(){
        return this.rowColspans.map((colspan)=>{
            return this.maxCol - colspan;
        });
    }

    _renderRow(row){
        return row.map((field)=>{
            return (
                <React.Fragment key={field}>
                    <td colSpan={this.colspanMapByField[field].label}>
                        {typeof this.props.renderLabel === 'function' && this.props.renderLabel({field})}
                    </td>
                    <td colSpan={this.colspanMapByField[field].field}>
                        {typeof this.props.renderField === 'function' && this.props.renderField({field})}
                    </td>
                </React.Fragment>
            )
        })

    }

    _renderRowRest(rowIndex){
        if(!this.restCols[rowIndex]){
            return null;
        }

        return (
            <td colSpan={this.restCols[rowIndex]}></td>
        )
    }

    render(){
        // return (<div>2222</div>)

        return (
            <table className="table">
                <tbody>
                    {this.props.fields.map((row,rowIndex)=>{
                        return (
                            <tr key={rowIndex}>
                                {this._renderRow(row)}
                                {this._renderRowRest(rowIndex)}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }
}

MetaTable.propTypes = {
    fieldList:PropTypes.object.isRequired,
    fields:PropTypes.array.isRequired,
    mode:PropTypes.string.isRequired,
    renderLabel:PropTypes.func.isRequired,
    renderField:PropTypes.func.isRequired,
};