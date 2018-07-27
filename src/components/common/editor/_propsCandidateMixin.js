import PropTypes from "prop-types";

export default function(Component){
    if(!Component.propTypes){
        Component.propTypes = {};
    }

    Component.propTypes.candidate = PropTypes.array.isRequired;

    return Component;
}