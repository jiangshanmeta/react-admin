import React from 'react'
import PropTypes from "prop-types";
import {
    Radio
} from "element-react";


export default class FieldEnumRadio extends React.Component{

    render(){

        const {
            value,
            onChange,
            candidate,
            valuefield,
            labelfield,
            ...restProps,
        } = this.props;
        
        return (
            <Radio.Group
                value={value}
                onChange={onChange}
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


FieldEnumRadio.propTypes = {
    value:PropTypes.any.isRequired,
    onChange:PropTypes.func.isRequired,
    candidate:PropTypes.array.isRequired
}

FieldEnumRadio.defaultProps = {
    valuefield:"value",
    labelfield:"label",
}