import React from "react";

export default function({data,Component,descriptor,field}){
    let info = data[field];

    if(descriptor){

        const {
            config={},
            join,
            handler,
        } = descriptor;

        let isJoinField = false;

        if(typeof join === 'object'){
            isJoinField = true;
            let obj = {[field]:info};
            if(Array.isArray(join)){
                info = join.reduce((obj,field)=>{
                    obj[field] = data[field];
                    return obj;
                },obj);
            }else{
                info = Object.keys(join).reduce((obj,originalField)=>{
                    obj[join[originalField]] = data[originalField];
                    return obj;
                },obj);
            }
        }

        if(Component){
            if(!isJoinField){
                info = {data:info};
            }

            return <Component {...info} {...config}/>
        }else if(handler){
            return (
                <span>
                    {handler(isJoinField?info:data[field],config)}
                </span>
            )
        }

        console.error(`invalid property views for field ${field}`)
        return null;
    }else{
        return (<span>{data[field]}</span>)
    }
}