import React from 'react';

export default function withHandleChange(Component){
    return function(props){
        const {value,onChange,...restProps} = props;

        function handleChange(value){
            onChange && onChange(value)
        }

        return <Component 
            value={value}
            onChange={handleChange}
            {...restProps}
        ></Component>
    }
}