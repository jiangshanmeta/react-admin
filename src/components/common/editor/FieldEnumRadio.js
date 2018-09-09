import React from 'react'
import {
    Radio
} from "antd";

import withFieldEnum from "./_withFieldEnum"

function RadioItems({candidate,valuefield,labelfield}){
    return candidate.map((item)=>{
        return (
            <Radio
                key={item[valuefield]}
                value={item[valuefield]}
            >
                {item[labelfield]}
            </Radio>
        );
    })
}

class FieldEnumRadioRenderComponent extends React.PureComponent{
    handleChange = (e)=>{
        const value = e.target.value;
        this.props.onChange(value);
    }

    render(){
        const {
            candidate,
            valuefield,
            labelfield,
            ...restProps,
        } = this.props;

        return (
            <Radio.Group
                {...restProps}
                onChange={this.handleChange}
            >
                {RadioItems({candidate,valuefield,labelfield})}
            </Radio.Group>
        )
    }
}




export default withFieldEnum(FieldEnumRadioRenderComponent);