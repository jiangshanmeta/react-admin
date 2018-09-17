import React from "react"

import FieldEnumRadio from "@/components/common/editor/FieldEnumRadio"
import FieldEnumSelect from "@/components/common/editor/FieldEnumSelect"
import FieldModel from "@/components/common/editor/FieldModel"

import FieldAsyncEnumRadio from "@/components/common/editor/FieldAsyncEnumRadio"
import FieldAsyncEnumSelect from "@/components/common/editor/FieldAsyncEnumSelect"
import FieldAsyncModel from "@/components/common/editor/FieldAsyncModel"

import MetaTest from "./_metaTest";

const FieldEnumRadioCandidate = [
    {label:"item0",value:0},
    {label:"item1",value:1},
    {label:"item2",value:2},
]

const FieldEnumSelectCandidate = [
    {label:"itemA",value:0},
    {label:"itemB",value:1},
    {label:"itemC",value:2},
];

const FieldModelCandidate = [
    {label:"itemA",value:10},
    {label:"itemB",value:11},
    {label:"itemC",value:12},
    {label:"itemD",value:13},
    {label:"itemE",value:14},
    {label:"itemF",value:15},
    {label:"itemG",value:16},
    {label:"itemH",value:17},
    {label:"itemI",value:18},
    {label:"itemJ",value:19},
    {label:"itemK",value:20},
    {label:"itemL",value:21},
];

function getAsyncCandidate(enums,cb){
    setTimeout(()=>{
        cb(enums);
    },1000);
}



const components = {
    FieldEnumRadio,
    FieldEnumSelect,
    FieldModel,
    FieldAsyncEnumRadio,
    FieldAsyncEnumSelect,
    FieldAsyncModel,
}

const defaultValues = {
    FieldEnumRadio:100,
    FieldEnumSelect:1,
    FieldModel:11,
    FieldAsyncEnumRadio:100,
    FieldAsyncEnumSelect:2,
    FieldAsyncModel:16,
}

const fieldConfig = {
    FieldEnumRadio:{
        candidate:FieldEnumRadioCandidate,
        handleInvalidValue(value,setvalue){
            this.props.onChange(setvalue[setvalue.length-1]);
        },
    },
    FieldEnumSelect:{
        candidate:FieldEnumSelectCandidate,
    },
    FieldModel:{
        candidate:FieldModelCandidate,
    },
    FieldAsyncEnumRadio:{
        getCandidate:getAsyncCandidate.bind(null,FieldEnumRadioCandidate),
        handleInvalidValue(value,setvalue){
            console.log(value,setvalue);
            this.props.onChange(setvalue[0]);
        },
    },
    FieldAsyncEnumSelect:{
        getCandidate:getAsyncCandidate.bind(null,FieldEnumSelectCandidate),
    },
    FieldAsyncModel:{
        getCandidate:getAsyncCandidate.bind(null,FieldModelCandidate)
    },
};

const renderFields = [
    'FieldEnumRadio',
    'FieldEnumSelect',
    'FieldModel',
    'FieldAsyncEnumRadio',
    'FieldAsyncEnumSelect',
    'FieldAsyncModel',
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