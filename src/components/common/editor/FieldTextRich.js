import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import propsModelMixin from "./_propsModelMixin"

@propsModelMixin
export default class FieldTextRich extends React.PureComponent{
    render(){
        return (
            <ReactQuill
                {...this.props}
            />
        )
    }
}