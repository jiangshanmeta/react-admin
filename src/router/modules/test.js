export default{
    label:"测试",
    icon:"tool",
    name:"test",
    pages:[
        {
            path:"/test/test_basic",
            label:"基础editor",
            component:()=>import("@/pages/test/Test_basic"),
            meta:{
                title:"test_basic",
            },
        },
        {
            path:"/test/test_enum",
            label:"枚举editor",
            component:()=>import("@/pages/test/Test_enum"),
        },
        {
            path:"/test/test_tag",
            label:"tag editor",
            component:()=>import("@/pages/test/Test_tag"),
        },
        {
            path:"/test/test_filter",
            label:"filter",
            component:()=>import("@/pages/test/Test_filter"),
        },
        {
            path:"/test/test_mobx",
            label:"mobx",
            component:()=>import("@/pages/test/testMobx"),
        },

    ],

}