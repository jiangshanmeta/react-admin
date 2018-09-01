import React from "react";

import {
    computed,
    reaction,
} from "mobx"

import {
    observer
} from "mobx-react"

import propsModelMixin from "./_propsModelMixin";
import propsValueArrayMixin from "./_propsValueArrayMixin";
import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";
import validateOptionMixin from "./_validateOptionMixin";

export default function withFieldArray(renderFunc){
    @observer
    class FieldArray extends React.Component{
        constructor(props){
            super(props);

            reaction(()=>{
                return {
                    value:this.props.value,
                    candidate:this.props.candidate
                }
            },this.validateOption,{
                fireImmediately:true,
            });

        }

        @computed get allvalueSet(){
            const valuefield = this.props.valuefield;
            return this.props.candidate.reduce((set,item)=>{
                set.add(item[valuefield]);
                return set;
            },new Set());
        }

        validateOption = ()=>{
            if(!this.props.isCandidateValid){
                return;
            }

            const allvalueSet = this.allvalueSet;
            const valueSet = new Set();

            for(let item of this.props.value){
                // 候选项没有该值，按无效处理
                if(!allvalueSet.has(item)){
                    this.props.handleInvalidValue.call(this,this.props.value,[...valueSet]);
                    return;
                }

                // 有重复的，按无效处理
                if(valueSet.has(item)){
                    this.props.handleInvalidValue.call(this,this.props.value,[...valueSet]);
                    return;
                }

                valueSet.add(item);
            }
        }

        render(){
            const {
                candidate,
                valuefield,
                labelfield,
                ...restProps,
            } = this.props;

            return renderFunc(candidate,valuefield,labelfield,restProps);
        }

    }

    propsModelMixin(FieldArray);
    propsValueArrayMixin(FieldArray);
    propsLabelValueMixin(FieldArray);
    propsCandidateMixin(FieldArray);
    validateOptionMixin(FieldArray);

    return FieldArray;
}