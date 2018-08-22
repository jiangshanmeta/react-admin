import React from "react";

import propsModelMixin from "./_propsModelMixin"
import propsLabelValueMixin from "./_propsLabelValueMixin";
import propsCandidateMixin from "./_propsCandidateMixin";

export default function withFieldEnum(renderFunc){
    class FieldEnum extends React.Component{
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

    return FieldEnum;
}