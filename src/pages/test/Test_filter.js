import React from "react"

import FilterEnum from "@/components/common/editor/FilterEnum"
import FilterAsyncEnum from "@/components/common/editor/FilterAsyncEnum"
import FilterModel from "@/components/common/editor/FilterModel"
import FilterAsyncModel from "@/components/common/editor/FilterAsyncModel"

import MetaTest from "./_metaTest";

const filter_enum_candidate = [
    {id:4,name:'value1'},
    {id:5,name:'value2'},
    {id:6,name:'value3'},
];

const filter_model_candidate = [
    {id:9,name:"张三"},
    {id:10,name:"张四"},
    {id:11,name:"李四"},
    {id:12,name:"李五"},
    {id:13,name:"王五"},
];

function getAsyncCandidate(enums,cb){
    setTimeout(()=>{
        cb(enums);
    },1000);
}


const components = {
    FilterEnum,
    FilterAsyncEnum,
    FilterModel,
    FilterAsyncModel,
};

const defaultValues = {
    FilterEnum:"all",
    FilterAsyncEnum:-1,
    FilterModel:"all",
    FilterAsyncModel:"-1",
}

const fieldConfig = {
    FilterEnum:{
        labelfield:"name",
        valuefield:"id",
        allvalue:"all",
        alllabel:"不限1",
        candidate:filter_enum_candidate,
    },
    FilterAsyncEnum:{
        getCandidate:getAsyncCandidate.bind(null,filter_enum_candidate),
        allvalue:-1,
        alllabel:"不限2",
        labelfield:"name",
        valuefield:"id",
    },
    FilterModel:{
        candidate:filter_model_candidate,
        valuefield:"id",
        labelfield:"name",
        allvalue:"all",
        alllabel:"全部",
    },
    FilterAsyncModel:{
        getCandidate:getAsyncCandidate.bind(null,filter_model_candidate),
        allvalue:"-1",
        alllabel:"不限8",
        labelfield:"name",
        valuefield:"id",
    },
}

const renderFields = [
    'FilterEnum',
    'FilterAsyncEnum',
    'FilterModel',
    'FilterAsyncModel',
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