import React from "react";
import {
    Select
} from "element-react";

import SelectItems from "./_selectItems"

import withFieldArray from "./_withFieldArray"

// TODO rewrite with autocomplete 卡頓
function renderFunc(candidate,valuefield,labelfield,restProps){
    delete restProps.filterable;
    return (
        <Select
            filterable={true}
            multiple={true}
            {...restProps}
        >
            <SelectItems
                candidate={candidate}
                valuefield={valuefield}
                labelfield={labelfield}
            ></SelectItems>
        </Select>
    )
}

export default withFieldArray(renderFunc);