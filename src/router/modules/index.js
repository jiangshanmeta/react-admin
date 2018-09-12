export default {
    label:"首页",
    icon:"setting",
    name:"index",
    pages:[
        {
            path:"/",
            label:"个人中心",
            component:()=>import("@/pages/index/index"),
        },
        {
            path:"/index/login",
            component:()=>import("@/pages/index/Login"),
            menuHide:true,
        }

    ],
}