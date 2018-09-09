import React from "react";
import {
    computed,
} from "mobx"

import {
    observer
} from "mobx-react"

import {
    List,
    Icon,
} from "antd"

import withFieldArray from "./_withFieldArray";
import FieldModel from "./FieldModel"

const listItemStyle = {
    width:"100%",
};

function FieldArrayModelList({value,valueLabelMap,removeItem}){
    const renderItem = function(item){
        return (
            <List.Item>
                <div className="clearfix" style={listItemStyle}>
                    <span>
                        {valueLabelMap.has(item)?valueLabelMap.get(item):item}
                    </span>
                    <Icon
                        className="pull-right"
                        type="close" 
                        theme="outlined"
                        onClick={()=>removeItem(item)}
                    />
                </div>
            </List.Item>
        )
    }

    return (
        <List
            bordered
            dataSource={value}
            renderItem={renderItem}
        />
    )
}


@observer
class FieldArrayModelRenderComponent extends React.Component{
    @computed get valueLabelMap(){
        const labelfield = this.props.labelfield;
        const valuefield = this.props.valuefield;
        return this.props.candidate.reduce((map,item)=>{
            map.set(item[valuefield],item[labelfield]);
            return map;
        },new Map());
    }

    removeItem = (item)=>{
        const index = this.props.value.indexOf(item);
        const copyArr = Array.from(this.props.value);
        copyArr.splice(index,1);
        this.props.onChange(copyArr);
    }

    addItem = (item)=>{
        if(!this.props.value.includes(item)){
            this.props.onChange(this.props.value.concat(item));
        }
    }

    render(){
        const listProps = {
            value:this.props.value,
            valueLabelMap:this.valueLabelMap,
            removeItem:this.removeItem,
        };

        return (
            <section>
                {FieldArrayModelList(listProps)}
                <FieldModel
                    {...this.props}
                    value={''}
                    onChange={this.addItem}
                />
            </section>
        )
    }
}

export default withFieldArray(FieldArrayModelRenderComponent);