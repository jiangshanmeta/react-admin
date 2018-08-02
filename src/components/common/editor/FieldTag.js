import React from "react";
import {
    Checkbox,
} from "element-react";

import CheckboxItems from "./_checkboxItems"

import propsModelMixin from "./_propsModelMixin";
import propsValueArrayMixin from "./_propsValueArrayMixin";
import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";

export default class FieldTag extends React.Component{
    handleChange = (value)=>{
        this.props.onChange(value.slice());
    }

    render(){
        const {
            candidate,
            labelfield,
            valuefield,
            ...restProps,
        } = this.props;

        delete restProps.onChange;

        return (
            <Checkbox.Group
                onChange={this.handleChange}
                {...restProps}
            >
                {CheckboxItems({candidate,valuefield,labelfield})}
            </Checkbox.Group>
        )
    }
}


propsModelMixin(FieldTag);
propsValueArrayMixin(FieldTag);
propsLabelValueMixin(FieldTag);
propsCandidateMixin(FieldTag);