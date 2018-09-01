import withValidate from "./_withValidate"

import propsModelMixin from "./_propsModelMixin"
import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";


function validateOption(){
    if(!this.props.isCandidateValid){
        return;
    }

    const valueSet = this.allvalueSet;
    if(!valueSet.has(this.props.value)){
        this.props.handleInvalidValue.call(this,this.props.value,[...valueSet]);
    }
}

export default withValidate(validateOption,[
    propsModelMixin,
    propsLabelValueMixin,
    propsCandidateMixin,
]);