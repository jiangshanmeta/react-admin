import React from "react"
import PropTypes from "prop-types";
import {logError} from "@/widget/utility"

export default function withAsyncCandidate(Component){
    return class WithAsyncCandidateComponent extends React.Component{
        static propTypes = {
            getCandidate:PropTypes.func.isRequired,
        }

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
                    isCandidateValid={!this.state.isRequest}
                    candidate={this.state.candidate}
                    {...restProps}
                />
            )
        }
    }
}