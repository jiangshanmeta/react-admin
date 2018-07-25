import React from "react"
import PropTypes from "prop-types";
import {logError} from "@/widget/utility"

function withAsyncCandidate(Component){
    class WithAsyncCandidateComponent extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                candidate:[],
                isRequest:true,
            };
        }

        getCandidate(){

            new Promise((resolve)=>{
                this.props.getCandidate(resolve);
            }).then((candidate)=>{
                this.setState({
                    isRequest:false,
                    candidate,
                })
            }).catch(logError);

        }

        componentDidMount(){
            this.getCandidate();
        }

        render(){
            const {
                ...restProps,
            } = this.props;

            delete restProps.getCandidate;

            return (
                <Component
                    candidate={this.state.candidate}
                    {...restProps}
                />
            )
        }
    }
    WithAsyncCandidateComponent.propTypes = {
        getCandidate:PropTypes.func.isRequired,
    }

    return WithAsyncCandidateComponent
}

export default withAsyncCandidate;