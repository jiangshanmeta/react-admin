import React from "react"
// import PropTypes from "prop-types";

import ListView from "@/components/common/ListView"

export default class ListPage extends React.Component{
    constructor(props){
        super();
        this.state = {
            model:{},
        }

        const meta = props.meta;

        import(`@/models/${meta.model}`).then((rst)=>{
            this.setState({
                model:rst.default,
            })
        })
    }



    render(){
        const model = this.state.model;
        if(Object.keys(model).length === 0){
            return null;
        }

        return (
            <ListView {...model}/>
        )
    }
}