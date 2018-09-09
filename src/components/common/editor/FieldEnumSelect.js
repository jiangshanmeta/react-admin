import React from "react";
import {
    Select
} from "antd";

import withFieldEnum from "./_withFieldEnum"

const Option = Select.Option;

function SelectOptions({candidate,valuefield,labelfield}){
    return candidate.map((item)=>{
        return (
            <Option
                key={item[valuefield]}
                value={item[valuefield]}
            >
                {item[labelfield]}
            </Option>
        )
    });
}


function FieldEnumSelectRenderComponent(props){
    const {
        candidate,
        valuefield,
        labelfield,
        ...restProps,
    } = props;

    return (
        <Select
            {...restProps}
        >
            {SelectOptions({candidate,valuefield,labelfield})}
        </Select>
    )
}


export default withFieldEnum(FieldEnumSelectRenderComponent);