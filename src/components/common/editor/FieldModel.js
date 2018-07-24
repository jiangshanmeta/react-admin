import React from "react";
import PropTypes from "prop-types";
import {
    Select
} from "element-react"

export default class FieldModel extends React.Component{

    render(){
        const {
            value,
            onChange,
            candidate,
            valuefield,
            labelfield,
            ...restProps,
        } = this.props;

        delete restProps.filterable;

        return (
            <Select 
                value={value} 
                onChange={onChange}
                filterable={true}
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

FieldModel.propTypes = {
    value:PropTypes.any.isRequired,
    onChange:PropTypes.func.isRequired,
    candidate:PropTypes.array.isRequired,
}

FieldModel.defaultProps = {
    valuefield:"value",
    labelfield:"label",
}