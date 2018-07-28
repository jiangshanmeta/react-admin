import React from "react"

export default function(props){
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>组件名</th>
                    <th>组件值</th>
                    <th>组件实例</th>
                </tr>
            </thead>
            <tbody>
                {props.children}
            </tbody>
        </table>
    )
}