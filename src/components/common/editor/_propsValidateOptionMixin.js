import PropTypes from "prop-types";

function noop(){}

export default function(Component){
    if(!Component.propTypes){
        Component.propTypes = {};
    }
    const propTypes = Component.propTypes;
    
    propTypes.isCandidateValid = PropTypes.bool;
    propTypes.handleInvalidValue = PropTypes.func;


    if(!Component.defaultProps){
        Component.defaultProps = {};
    }
    const defaultProps = Component.defaultProps;

    defaultProps.isCandidateValid = true;
    defaultProps.handleInvalidValue = noop;

    return Component;
}