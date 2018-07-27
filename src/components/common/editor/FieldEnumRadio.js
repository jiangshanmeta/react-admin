import React from 'react'
import {
    Radio
} from "element-react";

import propsModelMixin from "./_propsModelMixin"
import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";

export default class FieldEnumRadio extends React.Component{

    render(){

        const {
            candidate,
            valuefield,
            labelfield,
            ...restProps,
        } = this.props;
        
        return (
            <Radio.Group
                {...restProps}
            >
                {candidate.map((item)=>{
                    return (
                        <Radio
                            value={item[valuefield]}
                            key={item[valuefield]}
                        >
                            {item[labelfield]}
                        </Radio>
                    )
                })}
            </Radio.Group>
        );
    }
}


propsModelMixin(FieldEnumRadio);
propsLabelValueMixin(FieldEnumRadio);
propsCandidateMixin(FieldEnumRadio);