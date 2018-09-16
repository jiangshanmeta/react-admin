import React from "react"
import PropTypes from "prop-types";

import {
    computed,
} from "mobx"

import {
    observer
} from "mobx-react"

import propsCandidateMixin from "./_propsCandidateMixin";
import propsLabelValueMixin from "./_propsLabelValueMixin";


export default function withFilterAll(Component){
    @observer
    class WithFilterAllComponent extends React.Component{
        @computed get filterCandidate(){
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
                <Component
                    candidate={this.filterCandidate}
                    {...$attrs}
                />
            )
        }
    }

    WithFilterAllComponent.propTypes = {
        alllabel:PropTypes.string,
    }
    
    WithFilterAllComponent.defaultProps = {
        alllabel:"不限",
        allvalue:"",
    }

    propsCandidateMixin(WithFilterAllComponent);
    propsLabelValueMixin(WithFilterAllComponent);

    return WithFilterAllComponent;
}