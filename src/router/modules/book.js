export default{
    label:"订单",
    icon:"shopping-cart",
    name:"book",
    pages:[
        {
            path:"/book/index",
            label:"订单列表",
            component:()=>import('@/pages/common/ListPage'),
            meta:{
                model:"bookModel",
                title:"订单列表",
            }
        },

    ]
}