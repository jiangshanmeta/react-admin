export default{
    label:"客户",
    icon:'user',
    name:"crm",
    pages:[
        {
            path:'/crm/index',
            component:()=>import('@/pages/common/ListPage'),
            label:'客户列表',
            meta:{
                model:"userModel",
                privilege:[1]
            },
        },

    ]
}