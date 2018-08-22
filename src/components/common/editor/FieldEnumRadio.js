import React from 'react'
import {
    Radio
} from "element-react";

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

function renderFunc(candidate,valuefield,labelfield,restProps){
    return (
        <Radio.Group
            {...restProps}
        >
            {RadioItems({candidate,valuefield,labelfield})}
        </Radio.Group>
    )
}

export default withFieldEnum(renderFunc);