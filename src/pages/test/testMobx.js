import React from "react"
import{
    observable,
    action,
}from "mobx"

import {
    observer
}from "mobx-react"

class Store{
    @observable booleanVal = false;
    
    @action.bound
    setTrue(){
        this.booleanVal = true;
        console.log(store.booleanVal)
    }
    @action.bound
    setFalse(){
        this.booleanVal = false;
        console.log(store.booleanVal)
    }
}

const store = new Store();

@observer
class True extends React.Component{
    render(){
        return (
            <div>
                {String(store.booleanVal)}

                <button onClick={store.setTrue}>setTrue</button>
            </div>
        )
    }
}
@observer
class False extends React.Component{
    render(){
        return (
            <div>
                {String(store.booleanVal)}

                <button onClick={store.setFalse}>setFalse</button>
            </div>
        )
    }
}

export default class TestMobx extends React.Component{
    componentWillUpdate(){
        console.log("will update")
    }

    render(){
        return (
            <section>
                <True/>
                <False/>
            </section>
        )

    }
}