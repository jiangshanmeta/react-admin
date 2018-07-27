import React from "react";
import {
    Select
} from "element-react";

import propsModelMixin from "./_propsModelMixin";
import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";

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
                {candidate.map((item)=>{
                    return (
                        <Select.Option 
                            key={item[valuefield]}
                            value={item[valuefield]}
                            label={item[labelfield]}
                        />
                    )
                })}
            </Select>
        )
    }
}

propsModelMixin(FieldEnumSelect);
propsLabelValueMixin(FieldEnumSelect);
propsCandidateMixin(FieldEnumSelect);