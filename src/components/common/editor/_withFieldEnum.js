import React from "react";
import {
    computed,
    reaction,
} from "mobx"

import {
    observer
} from "mobx-react"


import propsModelMixin from "./_propsModelMixin"
import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";
import validateOptionMixin from "./_validateOptionMixin";


export default function withFieldEnum(renderFunc){
    @observer
    class FieldEnum extends React.Component{
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

            const valueSet = this.allvalueSet;
            if(!valueSet.has(this.props.value)){
                this.props.handleInvalidValue.call(this,this.props.value,[...valueSet]);
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

    propsModelMixin(FieldEnum);
    propsLabelValueMixin(FieldEnum);
    propsCandidateMixin(FieldEnum);
    validateOptionMixin(FieldEnum);

    return FieldEnum;
}