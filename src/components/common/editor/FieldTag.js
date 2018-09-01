import React from "react";
import {
    Checkbox,
} from "element-react";

import withFieldArray from "./_withFieldArray"

function CheckboxItems({candidate,valuefield,labelfield}){
    return candidate.map((item)=>{
        return (
            <Checkbox
                value={item[valuefield]}
                key={item[valuefield]}
            >
                {item[labelfield]}
            </Checkbox>
        );
    });
}

class BetterCheckbox extends React.PureComponent{
    handleChange = (value)=>{
        this.props.onChange(value.slice());
    }

    render(){
        const {
            candidate,
            valuefield,
            labelfield,
            ...restProps
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

function renderFunc(candidate,valuefield,labelfield,restProps){
    return (
        <BetterCheckbox
            candidate={candidate}
            valuefield={valuefield}
            labelfield={labelfield}
            {...restProps}
        />
    )
}

export default withFieldArray(renderFunc);