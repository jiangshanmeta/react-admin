import React from "react"
import PropTypes from "prop-types";
import {logError} from "@/widget/utility"


import {
    observable,
    reaction,
    computed,
    action,
    set,
    toJS,
} from "mobx"

import {
    observer
} from "mobx-react"

function noop(){}

export default function withFieldRelates(Component){
    @observer
    class FieldRelates extends React.Component{
        static propTypes = {
            relates:PropTypes.array.isRequired,
            getCandidate:PropTypes.func.isRequired,
            handleInvalidRelateIds:PropTypes.func,
            relateData:PropTypes.object.isRequired,            
        }

        static defaultProps = {
            handleInvalidRelateIds:noop
        }


        @observable optionsCache = {};
        constructor(props){
            super(props);
            reaction(()=>{
                return this.props.relateData;
            },this.getOptions,{
                fireImmediately:true,
            })
        }

        getOptions = ()=>{
            if(!this.hasValidIds){
                this.props.handleInvalidRelateIds();
                return;
            }

            if(this.hasCachedOptions){
                return;
            }

            const queryObj = this.relateKeys.reduce((queryObj,field)=>{
                const queryKey = this.requestFieldMap.hasOwnProperty(field)?this.requestFieldMap[field]:field;
                queryObj[queryKey] = this.props.relateData[field];
                return queryObj;
            },Object.create(null));

            const cacheObj = JSON.parse(JSON.stringify(this.props.relateData));

            new Promise((resolve,reject)=>{
                this.props.getCandidate.call(this,resolve,queryObj)
            }).then((candidate)=>{
                this.setCacheOptions(candidate,cacheObj)
            }).catch(logError);
        }

        @action
        setCacheOptions(options,cacheObj){
            let start = this.optionsCache;
            const len = this.relateKeys.length;
            let counter = 0;
            while(counter<len-1){
                let cacheKey = cacheObj[this.relateKeys[counter++]];
                if(!start.hasOwnProperty(cacheKey)){
                    set(start,cacheKey,{})
                }
                start = start[cacheKey];
            }
            set(start,cacheObj[this.relateKeys[len-1]],options);
        }



        @computed get relateKeys(){
            return Object.keys(this.props.relateData);
        }

        @computed get requestFieldMap(){
            return this.props.relates[0].requestField || {};
        }

        @computed get invalidValueMap(){
            return this.props.relates[0].invalidValue || {};
        }

        @computed get hasValidIds(){
            return this.relateKeys.every((field)=>{
                return this.props.relateData[field] !== this.invalidValueMap[field];
            });
        }

        @computed get hasCachedOptions(){
            let start = toJS(this.optionsCache);
            const len = this.relateKeys.length;
            let counter = 0;
            let relateId;

            while(counter<len){
                relateId = this.props.relateData[this.relateKeys[counter++]]

                if(!start.hasOwnProperty(relateId)){
                    return false;
                }
                start = start[relateId];
            }
            return true;
        }


        @computed get finalOptions(){
            if(!this.hasValidIds || !this.hasCachedOptions){
                return [];
            }

            const length = this.relateKeys.length;
            let counter = 0;
            let start = toJS(this.optionsCache);
            while(counter<length){
                start = start[this.props.relateData[this.relateKeys[counter++]]];
            }
            return start;
        }

        render(){
            return (
                <Component
                    {...this.props}
                    candidate={this.finalOptions}
                    isCandidateValid={this.hasCachedOptions}
                />
            )
        }

    }

    return FieldRelates;
}