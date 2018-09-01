import withValidate from "./_withValidate"

import propsModelMixin from "./_propsModelMixin";
import propsValueArrayMixin from "./_propsValueArrayMixin";
import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";

function validateOption(){
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

export default withValidate(validateOption,[
    propsModelMixin,
    propsValueArrayMixin,
    propsLabelValueMixin,
    propsCandidateMixin,
]);