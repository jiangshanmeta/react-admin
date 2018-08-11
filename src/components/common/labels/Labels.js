import React from "react";

export default function({labelComponent,label,Component}){
    if(!labelComponent || !Component){
        return (
            <span>{label}</span>
        )
    }

    return (
        <Component
            label={label}
            {...(labelComponent.config || {})}
        />
    )
}