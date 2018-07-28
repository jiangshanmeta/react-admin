import React from "react";
import {
    Select
} from "element-react";

export default function({candidate,valuefield,labelfield}){
    return candidate.map((item)=>{
        return (
            <Select.Option 
                key={item[valuefield]}
                value={item[valuefield]}
                label={item[labelfield]}
            />
        )
    })
}