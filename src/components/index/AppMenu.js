import React from "react"

import {
    Menu,
} from "element-react"

import menu from "@/router/menu"

export default class AppMenu extends React.Component{
    handleSelect = (pathname)=>{
        this.props.history.push({
            pathname,
        })
    }

    renderMenu(menu){
        return menu.map((submenu)=>{
            return (
                <Menu.SubMenu
                    index={submenu.name}
                    key={submenu.name}
                    title={<span><i className={submenu.icon}></i>{submenu.label}</span>}
                >
                    {this.renderSubmenu(submenu.pages)}
                </Menu.SubMenu>
            );
        })
    }

    renderSubmenu(submenu){
        return submenu.map((item)=>{
            return (
                <Menu.Item
                    index={item.path}
                    key={item.path}
                >
                    {item.label}
                </Menu.Item>
            );
        })
    }

    render(){
        return (
            <Menu
                onSelect={this.handleSelect}
                id="app-menu"
            >
                {this.renderMenu(menu)}
            </Menu>
        )
    }
}