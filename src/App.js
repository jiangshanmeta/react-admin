import React from 'react';

import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch,
} from "react-router-dom"

import router from "./router"

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
                <div>
                    <Link to="/test/test_basic">测试页面</Link>

                    <Link to="/404">not match page</Link>

                    {this.renderRouter()}
                </div>
            </Router>
        )
    }
}