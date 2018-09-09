import React from "react";
import PropTypes from "prop-types";

import {
    Button,
    Modal,
} from "antd"

import {
    logError,
    handleNonFuncProp,
} from "@/widget/utility"

import {
    injectComponents
} from "@/widget/injectComponents"


import MetaTable from "@/components/common/MetaTable"
import Labels from "@/components/common/labels/Labels"
import Views from "@/components/common/views/Views"

import filterLabelComponents from "@/injectHelper/labelComponentHelper"

export default class Info extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            labelComponentsInjected:false,
            viewComponentsInjected:false,
            dialogVisible:false,
        };
        this.canInitDialog = false;
        this.fields = [];
        this.record = null;



        this.injectInited = false;

        this.labelComponents = {};
        this.viewComponents = {};
    }

    get componentsInjected(){
        return this.state.labelComponentsInjected && this.state.viewComponentsInjected;
    }

    handleClick = ()=>{
        if(!this.injectInited){
            const {
                list,
                map
            } = filterLabelComponents(this.props.fieldList,Object.keys(this.props.fieldList),'info');
    
            this.needInjectLabelComponentsList = list;
            this.needInjectLabelComponentsMap = map;
    
            this.needInjectViewComponents = Object.keys(this.props.fieldList).filter((field)=>{
                return this.props.fieldList[field].view && this.props.fieldList[field].view.component;
            }).map((field)=>{
                return {
                    name:field,
                    component:this.props.fieldList[field].view.component,
                };
            });

            this.injectLabelComponents();
            this.injectViewComponents();
            this.injectInited = true;
        }

        new Promise((resolve)=>{
            this.props.getDetailInfo.call(this,resolve);
        }).then(({fields,record})=>{
            this.fields = fields;
            this.record = record;

            this.canInitDialog = true;
            this.setState({
                dialogVisible:true,
            });
        }).catch(logError);
    }

    injectLabelComponents(){
        if(!this.needInjectLabelComponentsList.length){
            return this.setState({
                labelComponentsInjected:true,
            });
        }

        injectComponents(this.needInjectLabelComponentsList,this.labelComponents).then(()=>{
            this.setState({
                labelComponentsInjected:true,
            })
        }).catch(logError);
    }

    injectViewComponents(){
        if(!this.needInjectViewComponents.length){
            return this.setState({
                viewComponentsInjected:true,
            });
        }

        injectComponents(this.needInjectViewComponents,this.viewComponents).then(()=>{
            this.setState({
                viewComponentsInjected:true,
            })
        }).catch(logError);
    }

    closeDialog = ()=>{
        this.setState({
            dialogVisible:false,
        });
    }

    renderLabel = ({field})=>{
        const descriptor = this.props.fieldList[field];
        return (
            <Labels
                label={descriptor.label}
                Component={this.labelComponents[field]}
                labelComponent={this.needInjectLabelComponentsMap[field]}
            />
        )
    }

    renderField = ({field})=>{
        return (
            <Views
                data={this.record}
                descriptor={this.props.fieldList[field].view}
                field={field}
                Component={this.viewComponents[field]}
            />
        )
    }

    renderDialog(){
        if(!this.canInitDialog){
            return null;
        }
        return (
            <Modal
                visible={this.state.dialogVisible}
                onCancel={this.closeDialog}
                footer={null}
                {...this.props.dialogConfig}
            >
                {this.componentsInjected &&
                <MetaTable
                    fieldList={this.props.fieldList}
                    fields={this.fields}
                    renderLabel={this.renderLabel}
                    renderField={this.renderField}
                    mode="info"
                ></MetaTable>
                }
            </Modal>
        )
    }

    render(){
        const triggerConfig = handleNonFuncProp(this.props.triggerConfig);

        return (
            <div>
                <Button
                    onClick={this.handleClick}
                    {...triggerConfig}
                >
                    {triggerConfig.text}
                </Button>
                {this.renderDialog()}
            </div>
        )
    }
}

Info.propTypes = {
    fieldList:PropTypes.object.isRequired,
    data:PropTypes.object.isRequired,
    getDetailInfo:PropTypes.func.isRequired,
    triggerConfig:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    dialogConfig:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
}

Info.defaultProps = {
    triggerConfig:{
        text:"详情",
        type:"primary",
    },
    dialogConfig:{
        title:"用户详情",
    },
}