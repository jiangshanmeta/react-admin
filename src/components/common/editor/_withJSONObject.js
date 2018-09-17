import React from "react";
import PropTypes from "prop-types";

import {
    observable,
    reaction,
} from "mobx"

import {
    observer
} from "mobx-react"

function defaultStruct(){
    return [];
}

export default function(Component){
    @observer
    class WithJSONObject extends React.Component{
        static propTypes = {
            value:PropTypes.any.isRequired,
            struct:PropTypes.func,
        }

        static defaultProps = {
            struct:defaultStruct,
        }

        @observable localValue
        constructor(props){
            super(props);

            reaction(()=>{
                return this.props.value;
            },()=>{
                let value;
                try{
                    value = JSON.parse(this.props.value);
                }catch(e){
                    value = this.props.struct.call(this);
                    this.handleChange(value); 
                }

                this.localValue = value;
            },{
                fireImmediately:true,
            })

        }

        handleChange = (value)=>{
            this.props.onChange(JSON.stringify(value));
        }

        render(){
            const {
                ...restProps
            } = this.props;

            delete restProps.value;
            delete restProps.onChange;

            return (
                <Component
                    value={this.localValue}
                    onChange={this.handleChange}
                    {...restProps}
                />
            )
        }
    }

    return WithJSONObject;
}