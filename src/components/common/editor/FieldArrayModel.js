import React from "react";
import {
    Select
} from "element-react";

import SelectItems from "./_selectItems"

import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";


export default class FieldArrayModel extends React.PureComponent{
    render(){
        const {
            candidate,
            valuefield,
            labelfield,
            ...restProps,
        } = this.props;

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
}

propsLabelValueMixin(FieldArrayModel);
propsCandidateMixin(FieldArrayModel);