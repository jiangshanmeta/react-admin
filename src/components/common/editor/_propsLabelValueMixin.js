import PropTypes from "prop-types";

export default function(Component){
    if(!Component.propTypes){
        Component.propTypes = {};
    }

    const propTypes = Component.propTypes;
    propTypes.valuefield = PropTypes.string;
    propTypes.labelfield = PropTypes.string;

    if(!Component.defaultProps){
        Component.defaultProps = {};
    }

    const defaultProps = Component.defaultProps;
    defaultProps.valuefield = 'value';
    defaultProps.labelfield = 'label';

    return Component;
}