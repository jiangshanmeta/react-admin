import React from "react";
import {
    Radio
} from "element-react";

export default function({candidate,valuefield,labelfield}){
    return candidate.map((item)=>{
        return (
            <Radio
                key={item[valuefield]}
                value={item[valuefield]}
            >
                {item[labelfield]}
            </Radio>
        );
    })
}