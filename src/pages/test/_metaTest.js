import React from 'react';
import PropTypes from 'prop-types';

function TestTable(props){
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


export default class MetaTest extends React.Component{
    static propTypes = {
        defaultValues:PropTypes.object.isRequired,
        renderFields:PropTypes.array.isRequired,
        components:PropTypes.object.isRequired,
        fieldConfig:PropTypes.object.isRequired,
    }

    constructor(props){
        super(props);

        this.state = JSON.parse(JSON.stringify(this.props.defaultValues));
        
        const fields = Object.keys(this.state);

        fields.forEach((field)=>{
            this[`handle${field}Change`] = this.handleChange.bind(this,field);
        });

    }

    handleChange(field,value){
        this.setState({
            [field]:value,
        })
    }

    renderField(field){
        const value = this.state[field];
        const Component = this.props.components[field];
        return (
            <tr key={field}>
                <td>{field}</td>
                <td>{value} || {typeof value}</td>
                <td>
                    <Component
                        value={value}
                        onChange={this[`handle${field}Change`]}
                        {...(this.props.fieldConfig[field] || {})}
                    />
                </td>
            </tr>
        )
    }

    render(){
        return (
            <TestTable>
                <React.Fragment>
                    {this.props.renderFields.map((field)=>{
                        return this.renderField(field);
                    })}
                </React.Fragment>
            </TestTable>
        )
    }
}