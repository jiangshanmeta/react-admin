import React from "react";

import FieldNumber from "./FieldNumber"

export default class FieldInt extends React.Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value){
        let intValue;
        if(value !== undefined){
            intValue = Number.parseInt(value,10);
            // 和element-react的InputNumber逻辑一致
            // 无效值时直接重置为undefined
            if(intValue !== value){
                intValue = undefined;
            }

        }

        this.props.onChange && this.props.onChange(intValue);
    }

    render(){
        const {value,onChange,defaultValue=0,...restProps} = this.props;

        let intValue;
        if(value !== undefined){
            intValue = Number.parseInt(value,10);
            if(intValue !== value){
                console.error("invalid value for FieldInt");
                return null;
            }
        }

        return (
            <FieldNumber
                value={intValue}
                defaultValue={intValue}
                onChange={this.handleChange}
                {...restProps}
            />
        )
    }
}