import React from "react";

import propsModelMixin from "./_propsModelMixin";
import propsValueArrayMixin from "./_propsValueArrayMixin";
import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";

export default function withFieldArray(renderFunc){
    class FieldArray extends React.PureComponent{
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

    return FieldArray;
}