import React from "react";
import PropTypes from "prop-types";
import {
    Button,
    Dialog,
} from "element-react";

import {
    logError,
} from "@/widget/utility"

import MetaTable from "@/components/common/MetaTable"

export default class Info extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dialogVisible:false,
        };
        this.canInitDialog = false;
        this.fields = [];
        this.record = null;

    }

    handleClick = ()=>{
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

    closeDialog = ()=>{
        this.setState({
            dialogVisible:false,
        });
    }

    renderLabel = ({field})=>{
        return this.props.fieldList[field].label;
    }

    renderField = ({field})=>{
        return this.record[field];
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
                    <MetaTable
                        fieldList={this.props.fieldList}
                        fields={this.fields}
                        renderLabel={this.renderLabel}
                        renderField={this.renderField}
                        mode="info"
                    ></MetaTable>
                </Dialog.Body>
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