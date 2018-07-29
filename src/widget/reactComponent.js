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

export {
    isReactComponent,
    setReactComponentFlag,
}