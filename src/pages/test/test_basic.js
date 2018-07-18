import React from 'react';

export default class Test_basic extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
        console.log(this.props)
    }

    render(){
        return (
            <section>
                测试基础editor页面
            </section>
        )
    }
}