const flagField = 'isReact'
// 爲了解決區分 import 進來的react組件（本質仍然是函數）和異步引入組件()=>import()

function isReactComponent(Component){
    return Component[flagField];
}

function setReactComponentFlag(...Components){
    Components.forEach((component)=>{
        component[flagField] = true;
    });
}

function injectComponents(Components,target){
    const syncComponents = Components.filter((item)=>isReactComponent(item.component));
    syncComponents.forEach((item)=>{
        target[item.name] = item.component;
    });


    const asyncComponets = Components.filter((item)=>!isReactComponent(item.component)).map((item)=>{
        return item.component().then((component)=>{
            target[item.name] = component;
        });
    });

    return Promise.all(asyncComponets);
}

export {
    setReactComponentFlag,
    injectComponents,
}