import React from "react"
import propTypes from "prop-types"

import FieldText from "@/components/common/editor/FieldText"
export default class BookAddress extends React.Component{
    render(){
        return (
            <section>
                customername: {this.props.customername}
                <FieldText
                    {...this.props}
                />
            </section>
        )
    }
}

BookAddress.propTypes = {
    customername:propTypes.string.isRequired,
}