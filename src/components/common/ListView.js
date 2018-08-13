import React from "react";
import PropTypes from "prop-types";

import ListInfo from "./ListInfo"
import Operators from "@/components/common/operators/Operators"


export default class ListView extends React.Component{
    constructor(props){
        super(props);
        this.$refs = {};
        this.setListInfoRef = this.setRef.bind(this,'listInfo');
    }

    setRef(refName,refValue){
        this.$refs[refName] = refValue;
    }

    refreshListData = ()=>{
        this.$refs.listInfo && this.$refs.listInfo.getListInfo();
    }


    renderStaticOperators = (info)=>{
        return (
            <Operators
                fieldList={this.props.fieldList}
                operators={this.props.staticOperators}
                onUpdate={this.refreshListData}
                {...info}
            ></Operators>
        )
    }

    render(){
        return (
            <section>
                {this.props.beforeAll}
                <ListInfo
                    ref={this.setListInfoRef}
                    beforeFilters={this.renderStaticOperators}
                    fieldList={this.props.fieldList}
                    filters={this.props.filters}
                    filterOperators={this.props.filterOperators}
                    operators={this.props.operators}
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
