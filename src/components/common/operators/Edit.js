import React from "react";
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

export default class Edit extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dialogVisible:false,
        };
        this.canInitDialog = false;
        this.fields = [];
        this.record = null;
        this.$refs = {};

        this._setEditorRef = this.setRef.bind(this,'editor');
    }

    setRef(key,value){
        this.$refs[key] = value;
    }

    getEditFields = ()=>{
        new Promise((resolve)=>{
            this.props.getEditInfo.call(this,resolve);
        }).then(({fields,record})=>{
            this.canInitDialog = true;
            this.fields = fields;
            this.record = record;
            this.setState({
                dialogVisible:true,
            });

        }).catch(logError)
    }

    closeDialog = ()=>{
        this.setState({
            dialogVisible:false,
        });
    }

    doEdit = ()=>{
        const data = JSON.parse(JSON.stringify(this.$refs.editor.formData));

        this.props.reserveFields.forEach((field)=>{
            data[field] = this.record[field];
        });

        new Promise((resolve)=>{
            this.props.doEditRequest.call(this,resolve,this.props.transformData.call(this,data));
        }).then(()=>{
            this.closeDialog();
            this.props.onUpdate();
        }).catch(logError);

    }

    _renderDialogFooter(){
        const cancelBtnConfig = handleNonFuncProp(this.props.cancelBtnConfig,this);
        const editBtnConfig = handleNonFuncProp(this.props.editBtnConfig,this);
        return (
            <React.Fragment>
                <Button
                    {...cancelBtnConfig}
                    onClick={this.closeDialog}
                >
                    {cancelBtnConfig.text}
                </Button>
                <Button
                    {...editBtnConfig}
                    onClick={this.doEdit}
                >
                    {editBtnConfig.text}
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
                footer={this._renderDialogFooter()}
            >
                <Editor
                    ref={this._setEditorRef}
                    fieldList={this.props.fieldList}
                    fields={this.fields}
                    record={this.record}
                    mode="edit"
                ></Editor>
            </Modal>
        )

    }

    render(){
        const triggerConfig = handleNonFuncProp(this.props.triggerConfig,this);
        return (
            <div>
                <Button
                    {...triggerConfig}
                    onClick={this.getEditFields}
                >
                    {triggerConfig.text}
                </Button>
                {this.renderDialog()}
            </div>
        )
    }
}

Edit.propTypes = {
    fieldList:PropTypes.object.isRequired,
    data:PropTypes.object.isRequired,

    triggerConfig:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    getEditInfo:PropTypes.func.isRequired,


    dialogConfig:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    cancelBtnConfig:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    editBtnConfig:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),

    transformData:PropTypes.func,
    reserveFields:PropTypes.array,
    doEditRequest:PropTypes.func.isRequired,

}

Edit.defaultProps = {
    triggerConfig:{
        text:"编辑",
        type:"primary",
    },
    dialogConfig:{
        title:"编辑",
    },
    cancelBtnConfig:{
        text:"取消",
    },
    editBtnConfig:{
        type:"primary",
        text:"确定",
    },
    transformData(data){
        return data;
    },
    reserveFields:[],
}