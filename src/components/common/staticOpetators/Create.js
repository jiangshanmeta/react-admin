import React from "react"
import PropTypes from "prop-types";
import {
    Button,
    Dialog,
} from "element-react";

import Editor from "@/components/common/editor/Editor"

import {
    logError,
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
                <Dialog.Body>
                    <Editor
                        ref={this._setEditorRef}
                        fieldList={this.props.fieldList}
                        fields={this.fields}
                        record={this.record}
                        mode="create"
                    ></Editor>
                </Dialog.Body>
                <Dialog.Footer>
                    <Button
                        onClick={this.closeDialog}
                        {...this.props.cancelBtnConfig}
                    >
                        {this.props.cancelBtnConfig.text}
                    </Button>
                    <Button
                        onClick={this.doCreate}
                        {...this.props.createBtnConfig}
                    >
                        {this.props.createBtnConfig.text}
                    </Button>
                </Dialog.Footer>
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

Create.propTypes = {
    fieldList:PropTypes.object.isRequired,
    triggerConfig:PropTypes.object,
    dialogConfig:PropTypes.object,
    createBtnConfig:PropTypes.object,
    cancelBtnConfig:PropTypes.object,

    getCreateFields:PropTypes.func.isRequired,
    transformData:PropTypes.func,
    doCreateRequest:PropTypes.func.isRequired,
}

Create.defaultProps = {
    triggerConfig:{},
    dialogConfig:{},
    createBtnConfig:{},
    cancelBtnConfig:{},
    transformData:function(data){
        return data;
    }
}