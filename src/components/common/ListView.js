import React from "react";
import PropTypes from "prop-types";

import ListInfo from "./ListInfo"

// import SelectItems from "@/components/common/editor/_selectItems"

// console.log(ListInfo,Object.keys(ListInfo))
// console.log(ListInfo.prototype,Object.keys(ListInfo.prototype))
// console.log(ListInfo.prototype.hasOwnProperty('render'))
// console.log(SelectItems,Object.keys(SelectItems))

export default class ListView extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }

        this.renderStaticOperators = this.renderStaticOperators.bind(this);
    }


    renderStaticOperators(info){
        return (
            <div>
                static Operators
            </div>
        )
    }

    render(){


        return (
            <section>
                {this.props.beforeAll}
                <ListInfo
                    beforeFilters={this.renderStaticOperators}
                    fieldList={this.props.fieldList}
                    filters={this.props.filters}
                    filterOperators={this.props.filterOperators}
                    {...this.props.listConfig}
                ></ListInfo>

                {this.props.afterAll}
            </section>
        );
    }
}


ListView.propTypes = {
    beforeAll:PropTypes.any,
    afterAll:PropTypes.any,
    fieldList:PropTypes.object.isRequired,
    staticOperators:PropTypes.array,
    filters:PropTypes.array,
    filterOperators:PropTypes.array,
    listConfig:PropTypes.object.isRequired,
    operators:PropTypes.array,
}

ListView.defaultProps = {
    staticOperators:[],
    filters:[],
    filterOperators:[],
    operators:[],
}
