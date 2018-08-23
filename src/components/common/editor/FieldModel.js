import React from "react";
import {
    Select
} from "element-react";

import SelectItems from "./_selectItems"
import withFieldEnum from "./_withFieldEnum"


function renderFunc(candidate,valuefield,labelfield,restProps){
    restProps.filterable = true;

    return (
        <Select
            {...restProps}
        >
            <SelectItems
                candidate={candidate}
                valuefield={valuefield}
                labelfield={labelfield}
            />
        </Select>
    )
}

export default withFieldEnum(renderFunc);