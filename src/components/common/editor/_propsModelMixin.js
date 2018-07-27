import PropTypes from "prop-types";

export default function(Component){
    if(!Component.propTypes){
        Component.propTypes = {};
    }

    const propTypes = Component.propTypes;

    propTypes.value = PropTypes.any.isRequired;
    propTypes.onChange = PropTypes.func.isRequired;

    return Component;
}