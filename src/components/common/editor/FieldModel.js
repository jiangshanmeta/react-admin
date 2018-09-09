import React from "react";
import {
    observable,
    computed,
    reaction,
} from "mobx"

import {
    observer
} from "mobx-react"

import {
    AutoComplete
} from "antd"

import withFieldEnum from "./_withFieldEnum"

const Option = AutoComplete.Option;

@observer
class FieldModelRenderComponent extends React.Component{
    @observable showValue = '';
    constructor(props){
        super(props);
        this.state = {
            result:[],
        };

        reaction(()=>{
            return this.props.value;
        },this.setShowValueByValue,{
            fireImmediately:true,
        });

        reaction(()=>{
            return this.props.candidate;
        },this.setShowValueByValue,{
            fireImmediately:true,
        })
        
    }

    @computed get valueLabelMap(){
        const labelfield = this.props.labelfield;
        const valuefield = this.props.valuefield;

        return this.props.candidate.reduce((map,item)=>{
            map.set(item[valuefield],item[labelfield]);
            return map;
        },new Map());
    }

    @computed get labelValueMap(){
        const labelfield = this.props.labelfield;
        const valuefield = this.props.valuefield;

        return this.props.candidate.reduce((map,item)=>{
            map.set(item[labelfield],item[valuefield]);
            return map;
        },new Map());
    }

    setShowValueByValue = ()=>{
        const value = this.props.value;
        if(this.valueLabelMap.has(value)){
            this.showValue = this.valueLabelMap.get(value);
        }
    }

    handleChange = (value)=>{
        this.showValue = value;
    }

    handleSelect = (value)=>{
        this.props.onChange(this.labelValueMap.get(value));
    }

    handleSearch = (value)=>{
        const candidate = this.props.candidate;
        let result;
        if(!value){
            result = Array.from(candidate);
        }else{
            const labelfield = this.props.labelfield;
            result = candidate.filter((item)=>{
                return item[labelfield].includes(value);
            });
        }

        this.setState({
            result
        })
    }


    render(){
        const {
            labelfield,
            valuefield,
            ...restProps,
        } = this.props;

        const children = this.state.result.map((item)=>{
            return (
                <Option
                    key={item[valuefield]}
                    value={item[labelfield]}
                >
                    {item[labelfield]}
                </Option>
            )
        });

        return (
            <AutoComplete
                {...restProps}
                value={this.showValue}
                onChange={this.handleChange}
                onSearch={this.handleSearch}
                onSelect={this.handleSelect}
            >
                {children}
            </AutoComplete>
        )
    }
}



export default withFieldEnum(FieldModelRenderComponent);