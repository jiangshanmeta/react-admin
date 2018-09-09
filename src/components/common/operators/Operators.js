import React from "react"
import PropTypes from "prop-types";
import {
    Button
} from "antd";

import {
    injectComponents
} from "@/widget/injectComponents"

import {
    logError,
} from "@/widget/utility"

export default class Operators extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            componentsInjected:false,
        }

        this._hasOperatorComponent = props.operators.some((item)=>item.component);
        this._operatorComponents = {};
        this._importOperatorComponents();
        this._triggetHandlerMap = props.operators.reduce((obj,item,index)=>{
            if(item.handler){
                obj[index] = this.handleOperatorTrigger.bind(this,item.handler);
            }
            return obj;
        },Object.create(null));

        this.$refs = {};
        this.setOperatorRef = this.setRefs.bind(this,'operators');
    }

    setRefs(refKey,refValue){
        this.$refs[refKey] = refValue;
    }

    _importOperatorComponents(){
        if(!this._hasOperatorComponent){
            return;
        }

        const components = this.props.operators.filter((item)=>item.component)

        injectComponents(components,this._operatorComponents).then(()=>{
            this.setState({
                componentsInjected:true,
            });
        }).catch(logError);
    }

    handleOperatorTrigger = (handler)=>{
        new Promise((resolve)=>{
            handler.call(this,resolve,this.props.data);
        }).then(this.notifyUpdate).catch(logError);

    }

    notifyUpdate = ()=>{
        this.props.onUpdate && this.props.onUpdate();
    }

    render(){
        if(this.props.operators.length === 0 || (this._hasOperatorComponent && !this.state.componentsInjected)){
            return null;
        }

        const $attrs = Object.assign({},this.props);
        delete $attrs.operators;
        
        return (
            <section className="operator-container" ref={this.setOperatorRef}>
                {this.props.operators.map((item,index)=>{
                    if(item.component){
                        const Component = this._operatorComponents[item.name];
                        return (
                            <Component
                                key={index}
                                data={this.props.data}
                                fieldList={this.props.fieldList}
                                onUpdate={this.notifyUpdate}
                                {...$attrs}
                                {...(item.config || {})}
                            />
                        )
                    }else if(item.handler){
                        return (
                            <Button
                                key={index}
                                onClick={this._triggetHandlerMap[index]}
                                {...(item.triggerConfig || {})}
                            >{item.triggerConfig && item.triggerConfig.text}</Button>
                        );
                    }
                    return null;
                })}
            </section>
        );



    }
}

Operators.propTypes = {
    fieldList:PropTypes.object.isRequired,
    operators:PropTypes.array,
    data:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]).isRequired,
    onUpdate:PropTypes.func,
}

Operators.defaultProps = {
    operators:[],

}