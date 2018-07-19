import React from "react"
import "./AppHeader.css"

export default class AppHeader extends React.Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    render(){
        return (
            <header className="admin-header">
                <div className="pull-left">
                    <div className="admin-header-title">管理系统</div>
                </div>
            </header>   
        )
    }
}