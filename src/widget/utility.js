function logError(e){
    console && console.log && console.log(e);
}

function identity(value){
    return value
}

function enumArr2Hash(arr,label='label',value='value'){
    return arr.reduce((obj,item)=>{
        obj[item[value]] = item[label];
        return obj;
    },{})
}

function handleNonFuncProp(prop,context){
    return typeof prop === 'function'?prop.call(context):prop;
}

export {
    logError,
    identity,
    enumArr2Hash,
    handleNonFuncProp,
}