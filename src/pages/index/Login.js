import React from "react";
import {
    Form,
    Input,    
    Button,
} from "antd"

import {
    observer
} from "mobx-react"

import {
    Redirect
} from "react-router-dom"

import LoginStore from "@/store/LoginStore"

@observer
export default class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            phone:"",
            pwd:"",
        };

        this.handlePhoneChange = this.handleInputChange.bind(this,'phone');
        this.handlePwdChange = this.handleInputChange.bind(this,'pwd');
    }

    handleInputChange(field,e){
        this.setState({
            [field]:e.target.value,
        });
    }

    doLogin = ()=>{
        const data = {
            phone:this.state.phone,
            pwd:this.state.pwd,
        }
        LoginStore.doLogin(data);
    }

    render(){
        if(LoginStore.isLogin){
            let redirectPath = "/";
            const state = this.props.location.state;
            if(state && state.from){
                redirectPath = state.from
            }
            return (
                <Redirect to={redirectPath}/>
            )
        }

        return (
            <Form>
                <Form.Item>
                    <Input
                        value={this.state.phone}
                        onChange={this.handlePhoneChange}
                        placeholder={"假装是用户名，随便输点就好"}
                    />
                </Form.Item>
                <Form.Item>
                    <Input
                        value={this.state.pwd}
                        onChange={this.handlePwdChange}
                        placeholder={"假装是密码，随便输点就好"}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        onClick={this.doLogin}
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}