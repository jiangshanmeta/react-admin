export default {
    label:"首页",
    icon:"el-icon-menu",
    name:"index",
    pages:[
        {
            path:"/",
            label:"个人中心",
            component:()=>import("@/pages/index/index"),
        }

    ],
}