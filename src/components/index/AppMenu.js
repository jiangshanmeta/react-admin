import React from "react"
import {
    Menu,
    Icon,
} from "antd"

import menu from "@/router/menu"

export default class AppMenu extends React.Component{
    handleSelect = ({key:pathname})=>{
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
                    title={<span><Icon type={submenu.icon}/>{submenu.label}</span>}
                >
                    {this.renderSubmenu(submenu.pages)}
                </Menu.SubMenu>
            );
        })
    }

    renderSubmenu(submenu){
        return submenu.filter((item)=>!item.menuHide).map((item)=>{
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
                mode="inline"
                onSelect={this.handleSelect}
                id="app-menu"
            >
                {this.renderMenu(menu)}
            </Menu>
        )
    }
}