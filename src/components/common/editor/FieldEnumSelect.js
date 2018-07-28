import React from "react";
import {
    Select
} from "element-react";

import propsModelMixin from "./_propsModelMixin";
import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";

import SelectItems from "./_selectItems"

export default class FieldEnumSelect extends React.Component{

    render(){
        const {
            candidate,
            valuefield,
            labelfield,
            ...restProps,
        } = this.props;

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
}

propsModelMixin(FieldEnumSelect);
propsLabelValueMixin(FieldEnumSelect);
propsCandidateMixin(FieldEnumSelect);