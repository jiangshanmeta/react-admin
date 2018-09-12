import React from 'react';

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom"

import AppHeader from "@/components/index/AppHeader"
import AppMenu from "@/components/index/AppMenu"

import router from "./router"
import "./App.css"

import LoginStore from "@/store/LoginStore"


export default class App extends React.Component {
    renderRouter(){
        return (
            <Switch>
                {router.map((item,key)=>{
                    return (
                        <Route
                            key={key}
                            path={item.path}
                            exact={item.exact}
                            render={(props)=>{
                                const {
                                    meta={},
                                } = item;
                                const isLogin = LoginStore.isLogin;
                                if(Array.isArray(meta.privilege) && !isLogin){
                                    const redirectConfig = {
                                        pathname:'/index/login',
                                        state:{
                                            from:item.path,
                                        }
                                    }
                                    return (
                                        <Redirect
                                            to={redirectConfig}
                                        />
                                    )
                                }
                                const Component = item.component;
                                return (
                                    <Component
                                        {...props}
                                        meta={item.meta}
                                    ></Component>
                                )
                            }}
                        ></Route>
                    );
                })}
            </Switch>
        )
    }

    render(){
        return (
            <Router>
                <div id="app">
                    <AppHeader></AppHeader>
                    <div id="app-main">
                        <Route component={AppMenu}></Route>
                        <div id="app-content">
                            {this.renderRouter()}
                        </div>
                    </div>
                </div>
            </Router>
        )
    }
}