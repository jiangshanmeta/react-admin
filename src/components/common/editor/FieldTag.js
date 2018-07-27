import React from "react";
import {
    Checkbox,
} from "element-react";

import propsModelMixin from "./_propsModelMixin";
import propsValueArrayMixin from "./_propsValueArrayMixin";
import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";

export default class FieldTag extends React.Component{
    constructor(){
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value){
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
                {candidate.map((item)=>{
                    return (
                        <Checkbox
                            value={item[valuefield]}
                            key={item[valuefield]}
                        >
                            {item[labelfield]}
                        </Checkbox>
                    )
                })}
            </Checkbox.Group>
        )
    }
}


propsModelMixin(FieldTag);
propsValueArrayMixin(FieldTag);
propsLabelValueMixin(FieldTag);
propsCandidateMixin(FieldTag);