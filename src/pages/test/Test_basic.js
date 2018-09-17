import React from 'react';

import FieldString from "@/components/common/editor/FieldString"
import FieldText from "@/components/common/editor/FieldText"
import FieldPwd from "@/components/common/editor/FieldPwd"
import FieldNumber from "@/components/common/editor/FieldNumber"
import FieldInt from "@/components/common/editor/FieldInt"

import MetaTest from "./_metaTest";


const components = {
    FieldString,
    FieldText,
    FieldPwd,
    FieldNumber,
    FieldInt,
};

const defaultValues = {
    FieldString:"",
    FieldText:"",
    FieldPwd:"",
    FieldNumber:10,
    FieldInt:1,
};

const fieldConfig = {
    FieldString:{
        placeholder:"请输入",
    },
    FieldText:{
        placeholder:"测试textarea",
    },
    FieldPwd:{
        placeholder:"测试FieldPwd",
    },
    FieldNumber:{
        defaultValue:100,
        invalidValue:15
    },
    FieldInt:{

    },
}

const renderFields = [
    'FieldString',
    'FieldText',
    'FieldPwd',
    'FieldNumber',
    'FieldInt',
];

export default function(){
    return (
        <MetaTest
            components={components}
            defaultValues={defaultValues}
            fieldConfig={fieldConfig}
            renderFields={renderFields}
        />
    )
}