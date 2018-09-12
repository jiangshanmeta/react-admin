import React from "react"
import "./AppHeader.css"

import {
    observer
} from "mobx-react"

import {
    withRouter
} from "react-router-dom"

import LoginStore from "@/store/LoginStore"

const logoutBtnStyle = {
    position:"relative",
    color:"#fff",
    top:"8px",
    cursor:"pointer",
}

@observer
class AppHeader extends React.Component{
    doLogout = ()=>{
        LoginStore.doLogout(()=>this.props.history.push("/index/login"));
    }

    render(){
        return (
            <header className="admin-header">
                <div className="pull-left">
                    <div className="admin-header-title">管理系统</div>
                </div>
                {LoginStore.isLogin &&
                <div className="pull-right">
                    <span
                        style={logoutBtnStyle}
                        onClick={this.doLogout}
                    >Logout</span>
                </div>}
            </header>   
        )
    }
}

export default withRouter(AppHeader)