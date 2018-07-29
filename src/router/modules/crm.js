export default{
    label:"客户",
    icon:'el-icon-share',
    name:"crm",
    pages:[
        {
            path:'/crm/index',
            component:()=>import('@/pages/common/ListPage'),
            label:'客户列表',
            meta:{
                model:"userModel",
            },
        },

    ]
}