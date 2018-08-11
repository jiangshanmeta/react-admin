import React from "react";
import PropTypes from "prop-types";
import {
    Button,
    Dialog,
} from "element-react";

import {
    logError,
} from "@/widget/utility"

import {
    injectComponents
} from "@/widget/injectComponents"


import MetaTable from "@/components/common/MetaTable"
import Labels from "@/components/common/labels/Labels"
import Views from "@/components/common/views/Views"

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

        this.needInjectLabelComponents = Object.keys(props.fieldList).filter((field)=>{
            return props.fieldList[field].labelComponent;
        }).map((field)=>{
            return {
                name:field,
                component:props.fieldList[field].labelComponent.component,
            };
        });

        this.needInjectViewComponents = Object.keys(props.fieldList).filter((field)=>{
            return props.fieldList[field].view && props.fieldList[field].view.component;
        }).map((field)=>{
            return {
                name:field,
                component:props.fieldList[field].view.component,
            };
        });

        this.injectInited = false;

        this.labelComponents = {};
        this.viewComponents = {};
    }

    get componentsInjected(){
        return this.state.labelComponentsInjected && this.state.viewComponentsInjected;
    }

    handleClick = ()=>{
        if(!this.injectInited){
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
        if(!this.needInjectLabelComponents.length){
            return this.setState({
                labelComponentsInjected:true,
            });
        }

        injectComponents(this.needInjectLabelComponents,this.labelComponents).then(()=>{
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
                labelComponent={descriptor.labelComponent}
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
            <Dialog
                visible={this.state.dialogVisible}
                onCancel={this.closeDialog}
                {...this.props.dialogConfig}
            >
                {this.componentsInjected &&
                <Dialog.Body>
                    <MetaTable
                        fieldList={this.props.fieldList}
                        fields={this.fields}
                        renderLabel={this.renderLabel}
                        renderField={this.renderField}
                        mode="info"
                    ></MetaTable>
                </Dialog.Body>
                }
            </Dialog>
        )
    }

    render(){
        return (
            <div>
                <Button
                    onClick={this.handleClick}
                    {...this.props.triggerConfig}
                >
                    {this.props.triggerConfig.text}
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
    triggerConfig:PropTypes.object,
    dialogConfig:PropTypes.object,
}

Info.defaultProps = {
    triggerConfig:{},
    dialogConfig:{},
}