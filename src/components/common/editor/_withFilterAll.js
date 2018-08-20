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

    Component.propTypes = {
        alllabel:PropTypes.string,
    }
    
    Component.defaultProps = {
        alllabel:"不限",
        allvalue:"",
    }

    propsCandidateMixin(Component);
    propsLabelValueMixin(Component);

    return WithFilterAllComponent;
}