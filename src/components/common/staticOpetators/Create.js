import React from "react"
import PropTypes from "prop-types";
import {
    Button,
    Modal,
} from "antd"

import Editor from "@/components/common/editor/Editor"

import {
    logError,
    handleNonFuncProp,
} from "@/widget/utility"

export default class Create extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dialogVisible:false,
        }

        this.canInitDialog = false;

        this.fields = [];
        this.record = null;
        this.$refs = {};

        this._setEditorRef = this.setRef.bind(this,'editor');
    }

    setRef(key,value){
        this.$refs[key] = value;
    }

    resetRecord(){
        this.record = this.fields.reduce((obj,row)=>{
            row.forEach((field)=>{
                const configDefault = this.props.fieldList[field].editorComponent.default;
                obj[field] = typeof configDefault === 'function'?configDefault.call(this,field):configDefault;
            });
            return obj;
        },{});
    }

    handleClick = ()=>{
        if(this.fields.length === 0){
            new Promise((resolve)=>{
                this.props.getCreateFields.call(this,resolve);
            }).then((fields)=>{
                this.canInitDialog = true;
                this.fields = fields;
                this.resetRecord();
                this.showDialog();
            }).catch(logError);
        }else{
            this.resetRecord();
            this.showDialog();
        }

    }

    closeDialog = ()=>{
        this.setState({
            dialogVisible:false,
        });
    }

    showDialog(){
        this.setState({
            dialogVisible:true,
        })
    }

    doCreate = ()=>{
        const data = JSON.parse(JSON.stringify(this.$refs.editor.formData));

        new Promise((resolve)=>{
            this.props.doCreateRequest.call(this,resolve,this.props.transformData.call(this,data));
        }).then(()=>{
            this.closeDialog();
            this.props.onUpdate();
        }).catch(logError);
    }

    _renderFooter(){
        const cancelBtnConfig = handleNonFuncProp(this.props.cancelBtnConfig);
        const createBtnConfig = handleNonFuncProp(this.props.createBtnConfig);

        return (
            <React.Fragment>
                <Button
                    {...cancelBtnConfig}
                    onClick={this.closeDialog}
                >
                    {cancelBtnConfig.text}
                </Button>
                <Button
                    {...createBtnConfig}
                    onClick={this.doCreate}
                >
                    {createBtnConfig.text}
                </Button>
            </React.Fragment>
        )
    }

    renderDialog(){
        if(!this.canInitDialog){
            return null;
        }

        return (
            <Modal
                {...this.props.dialogConfig}
                visible={this.state.dialogVisible}
                onCancel={this.closeDialog}
                footer={this._renderFooter()}
            >
                <Editor
                    ref={this._setEditorRef}
                    fieldList={this.props.fieldList}
                    fields={this.fields}
                    record={this.record}
                    mode="create"
                ></Editor>
            </Modal>
        )

    }

    render(){
        const triggerConfig = handleNonFuncProp(this.props.triggerConfig);

        return (
            <div>
                <Button
                    {...triggerConfig}
                    onClick={this.handleClick}
                >
                    {triggerConfig.text}
                </Button>
                {this.renderDialog()}
            </div>
        )
    }
}

Create.propTypes = {
    fieldList:PropTypes.object.isRequired,
    triggerConfig:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    dialogConfig:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    createBtnConfig:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    cancelBtnConfig:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),

    getCreateFields:PropTypes.func.isRequired,
    transformData:PropTypes.func,
    doCreateRequest:PropTypes.func.isRequired,
}

Create.defaultProps = {
    triggerConfig:{
        text:"新建",
        type:"primary",  
    },
    dialogConfig:{
        title:"新建",
    },
    createBtnConfig:{
        text:"确定",
        type:"primary",
    },
    cancelBtnConfig:{
        text:"取消",
    },
    transformData:function(data){
        return data;
    }
}