import React from "react";
import PropTypes from "prop-types";
import {
    Button,
    Dialog,
} from "element-react";

import Editor from "@/components/common/editor/Editor"

import {
    logError,
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
        console.log("doEdit");
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
                        fieldList={this.props.fieldList}
                        fields={this.fields}
                        record={this.record}
                        mode="edit"
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
                        onClick={this.doEdit}
                        {...this.props.editBtnConfig}
                    >
                        {this.props.editBtnConfig.text}
                    </Button>
                </Dialog.Footer>
            </Dialog>
        )

    }

    render(){
        return (
            <div>
                <Button
                    onClick={this.getEditFields}
                    {...this.props.triggerConfig}
                >
                    {this.props.triggerConfig.text}
                </Button>
                {this.renderDialog()}
            </div>
        )
    }
}

Edit.propTypes = {
    fieldList:PropTypes.object.isRequired,
    data:PropTypes.object.isRequired,

    triggerConfig:PropTypes.object,
    getEditInfo:PropTypes.func.isRequired,


    dialogConfig:PropTypes.object,
    cancelBtnConfig:PropTypes.object,
    editBtnConfig:PropTypes.object,
}

Edit.defaultProps = {
    triggerConfig:{},
    dialogConfig:{},
    cancelBtnConfig:{},
    editBtnConfig:{},
}