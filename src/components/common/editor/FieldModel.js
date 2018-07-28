import React from "react";
import {
    Select
} from "element-react";

import propsModelMixin from "./_propsModelMixin"
import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";

import SelectItems from "./_selectItems"

export default class FieldModel extends React.Component{

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
                {...restProps}
            >
                <SelectItems
                    candidate={candidate}
                    labelfield={labelfield}
                    valuefield={valuefield}
                />

                {/* {candidate.map((item)=>{
                    return (
                        <Select.Option 
                            key={item[valuefield]}
                            value={item[valuefield]}
                            label={item[labelfield]}
                        />
                    )
                })} */}
            </Select>
        )
    }
}


propsModelMixin(FieldModel);
propsLabelValueMixin(FieldModel);
propsCandidateMixin(FieldModel);