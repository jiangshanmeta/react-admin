import React from "react";
import {
    Checkbox,
} from "antd";

import withFieldArray from "./_withFieldArray"

function CheckboxItems({candidate,valuefield,labelfield}){
    return candidate.map((item)=>{
        return (
            <Checkbox
                key={item[valuefield]}
                value={item[valuefield]}
            >
                {item[labelfield]}
            </Checkbox>
        )
    });
}


function FieldTagRenderComponent(props){
    const {
        candidate,
        valuefield,
        labelfield,
        ...restProps,
    } = props;
    return (
        <Checkbox.Group
            {...restProps}
        >
            {CheckboxItems({candidate,valuefield,labelfield})}
        </Checkbox.Group>
    )
}



export default withFieldArray(FieldTagRenderComponent);