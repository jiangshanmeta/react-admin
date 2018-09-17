import React from "react";

import FieldTag from "@/components/common/editor/FieldTag"
import FieldArrayModel from "@/components/common/editor/FieldArrayModel"
import FieldAsyncTag from "@/components/common/editor/FieldAsyncTag"
import FieldAsyncArrayModel from "@/components/common/editor/FieldAsyncArrayModel"

import FieldTagJSON from "@/components/common/editor/FieldTagJSON"
import FieldAsyncTagJSON from "@/components/common/editor/FieldAsyncTagJSON"
import FieldArrayModelJSON from "@/components/common/editor/FieldArrayModelJSON"
import FieldAsyncArrayModelJSON from "@/components/common/editor/FieldAsyncArrayModelJSON"

import MetaTest from "./_metaTest";


const FieldTagCandidate = [
    {id:1,name:"zhangsan"},
    {id:2,name:"lisi"},
    {id:3,name:"wangwu"},
    {id:4,name:"heliu"}
];

const FieldArrayModelCandidate = [
    {id:1,name:"zhangsan"},
    {id:2,name:"lisi"},
    {id:3,name:"wangwu"},
    {id:4,name:"heliu"},
    {id:5,name:"tianqi"},
    {id:6,name:"naive"},
    {id:7,name:"simple"},
    {id:8,name:"young"},
];

function getAsyncCandidate(enums,cb){
    setTimeout(()=>{
        cb(enums);
    },1000);
}

const components = {
    FieldTag,
    FieldArrayModel,
    FieldAsyncTag,
    FieldAsyncArrayModel,
    FieldTagJSON,
    FieldAsyncTagJSON,
    FieldArrayModelJSON,
    FieldAsyncArrayModelJSON,
}

const defaultValues = {
    FieldTag:[2,2],
    FieldArrayModel:[2],
    FieldAsyncTag:[2],
    FieldAsyncArrayModel:[2],
    FieldTagJSON:JSON.stringify([2,2]),
    FieldAsyncTagJSON:JSON.stringify([1]),
    FieldArrayModelJSON:JSON.stringify([2]),
    FieldAsyncArrayModelJSON:JSON.stringify([1]),
}

const fieldConfig = {
    FieldTag:{
        candidate:FieldTagCandidate,
        labelfield:"name",
        valuefield:"id",
        handleInvalidValue(){
            console.log("fieldtag invalid");
            this.props.onChange([]);
        }
    },
    FieldArrayModel:{
        candidate:FieldArrayModelCandidate,
        labelfield:"name",
        valuefield:"id",
    },
    FieldAsyncTag:{
        getCandidate:getAsyncCandidate.bind(null,FieldTagCandidate),
        labelfield:"name",
        valuefield:"id",
    },
    FieldAsyncArrayModel:{
        getCandidate:getAsyncCandidate.bind(null,FieldArrayModelCandidate),
        labelfield:"name",
        valuefield:"id",
    },
    FieldTagJSON:{
        candidate:FieldTagCandidate,
        labelfield:"name",
        valuefield:"id",
        handleInvalidValue(){
            console.log("FieldTagJSON invalid");
            this.props.onChange([]);
        }
    },
    FieldAsyncTagJSON:{
        getCandidate:getAsyncCandidate.bind(null,FieldTagCandidate),
        labelfield:"name",
        valuefield:"id",
    },
    FieldArrayModelJSON:{
        candidate:FieldArrayModelCandidate,
        labelfield:"name",
        valuefield:"id",
    },
    FieldAsyncArrayModelJSON:{
        getCandidate:getAsyncCandidate.bind(null,FieldArrayModelCandidate),
        labelfield:"name",
        valuefield:"id",
    },
}

const renderFields = [
    'FieldTag',
    'FieldArrayModel',
    'FieldAsyncTag',
    'FieldAsyncArrayModel',
    'FieldTagJSON',
    'FieldAsyncTagJSON',
    'FieldArrayModelJSON',
    'FieldAsyncArrayModelJSON',
]

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