import React from "react"
import PropTypes from "prop-types";

import propsCandidateMixin from "./_propsCandidateMixin";
import propsLabelValueMixin from "./_propsLabelValueMixin";


import FieldEnumSelect from "./FieldEnumSelect"

export default class FilterEnum extends React.Component{
    get filterCandidate(){
        const [...arr] = this.props.candidate;
        arr.unshift({
            [this.props.labelfield]:this.props.alllabel,
            [this.props.valuefield]:this.props.allvalue,
        });
        return arr;
    }

    render(){
        const {...$attrs} = this.props;
        delete $attrs.candidate;

        return (
            <FieldEnumSelect
                candidate={this.filterCandidate}
                {...$attrs}
            />
        )
    }
}

FilterEnum.propTypes = {
    alllabel:PropTypes.string,
}

FilterEnum.defaultProps = {
    alllabel:"不限",
    allvalue:"",
}

propsCandidateMixin(FilterEnum);
propsLabelValueMixin(FilterEnum);