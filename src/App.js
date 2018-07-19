import React from 'react';

import {
    BrowserRouter as Router,
    Route,
    Switch,
} from "react-router-dom"

import AppHeader from "@/components/index/AppHeader"
import AppMenu from "@/components/index/AppMenu"

import router from "./router"
import "./App.css"

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
                                return (
                                    <item.component
                                        {...props}
                                        meta={item.meta}
                                    ></item.component>
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