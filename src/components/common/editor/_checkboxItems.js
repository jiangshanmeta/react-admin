import React from "react";
import {
    Checkbox,
} from "element-react";

export default function({candidate,valuefield,labelfield}){
    return candidate.map((item)=>{
        return (
            <Checkbox
                value={item[valuefield]}
                key={item[valuefield]}
            >
                {item[labelfield]}
            </Checkbox>
        );
    });
}