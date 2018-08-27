# react-admin

基于react实现通用后台管理系统

这套系统是[基于vue的通用管理系统](https://github.com/jiangshanmeta/vue-admin)的react实现。主要目标是实现配置化开发后台页面。

## model

一个页面的配置集合称为model，放在*/src/model/* 目录下。一个model由以下几个要素构成：

* fieldList 字段的集合
* listConfig [列表的配置项](https://github.com/jiangshanmeta/react-admin/tree/master/src/components/common)
* operators 针对一条记录的操作集合
* staticOperators 类似于operators，但不针对与一条特定记录(比如新建功能)
* filters 筛选条件的配置项
* filterOperators 针对筛选的操作

## fieldList

fieldList是字段的集合，鍵是字段名，值是字段的描述。

关于栏位的描述可以自行扩展，针对于后台业务，目前实现了以下几种描述：

* label 栏位的展示名称
* labelComponent 用组件的形式展示栏位名称，示例如下：

```javascript
labelComponent:{
    default:{
        component:()=>import("@/components/user/labels/LabelRedStar").then(rst=>rst.default),
        exclude:['create']
    },
    info:{
        component:()=>import("@/components/user/labels/LabelRedStar").then(rst=>rst.default),
    }
},
```

* editorComponent 编辑用的组件，示例如下：

```javascript
editorComponent:{
    name:"FieldString",
    config:{
        placeholder:'请输入客户名',
    },
    createConfig:{
        placeholder:"测试createconfig"
    },
    editConfig:{
        placeholder:"测试editconfig"
    },
    default:'',
},
```

name属性表明使用内置的编辑组件，你也可以使用自定义的编辑组件，只需要向上面的labelComponent声明一个component属性即可。

config编辑框组件的配置项，createConfig和editConfig对应Create组件和Edit两种模式下特有的配置项。

default值是create时必须的，这个参数可以传function，Create组件会调用该函数，调用函数返回的值作为初始值。

* view

view参数是用来回答如何展示值的，目前在列表以及Info组件都用到了这个参数。

目前支持两种类型：

```javascript
view:{
    handler(data,config,record){
        return config.prefix + data;
    },
    config:{
        prefix:"用户名"
    }
},
view:{
    component:()=>import("@/components/common/views/viewEnum").then((rst)=>rst.default),
    config:{
        enums:genderEnum,
    },
},
```

第一种是对于简单的情况，声明一个handler即可，第二种是组件的形式，和上面的命名一致，需要component属性。

为了应对更复杂的需求，提供一个join参数，用来联合其他栏位。join参数有两种形式，一种是数组，一种是对象。对象形式意味着对于原始栏位要给个别名处理，key为原始栏位，value为别名后的栏位。

* colspan 目前用于Info Create Edit三个组件中，实际实在MetaTable这个基础组件中使用到的。示例如下：

```javascript
colspan:{
    create:3,
    edit:3,
    info:{
        label:2,
        field:2,
    },
}
```

一般而言一个栏位对应的label只需要站一位，所以value是数字的情况该值为field对应的colspan。当value为对象形式的时候，你可以更好的控制label和field佔用的colspan

* tableColumnConfig 在表格中table column的配置项

## filters

filters是一個數組，每一項示例如下：

```javascript
{
    label:"姓名",
    field:"username",
    editorComponent:{
        name:"FieldString",
        config:{
            placeholder:"请输入用户姓名",
        },
        default:"",
    },
    watch:true,
},
```

label是展示名，field是请求时的key，editorComponent是编辑框组件的配置，既可以声明name属性使用内置的编辑组件，也可以使用component属性注入一个自定义编辑组件。最后的watch属性是用来监听该组件值变化然后触发查询。


## operators staticOperators filterOperators

operators有两种声明方式：

```javascript
{
    handler(resolve,data){
        Message({
            message:`${data.name}不要总想着搞个大新闻`,
            type:"success",
            duration:2000,
        })

        setTimeout(()=>{
            resolve();
        },1000)
    },
    triggerConfig:{
        text:"搞个大新闻",
        type:"warning",
        size:"small",
    },
},
{
    name:"delete",
    component:()=>import("@/components/common/operators/Delete").then((rst)=>rst.default),
    config:{
        doDeleteRequest:delUser,
        triggerConfig:{
            text:"删除用户",
            type:"danger",
            size:"small",
        },
    }
},
```

第一种声明一个handler，渲染为按钮，triggerConfig是对这个按钮的配置项。当点击按钮时会调用handler，此时this指向operators组件，handle被传入的第一个参数是个函数，该函数被调用后会自动刷新列表内容。

第二种声明是组件式声明，name是唯一标示，一般而言推荐和组件名称保持一致。这种方式下要通知列表更新需要组件```this.props.onUpdate()```。同时这一模式下还会默认传入两个参数：data和fieldList，对应这条记录以及上面的fieldList。

对于staticOperators下的component，data传入的是当前列表内容，是一个数组。除此之外还有selectedData，如果列表有选中功能，则该属性对应选择的数据。formData对应筛选组件的值(对象形式，key是field属性)。

filterOperators极少会被用到。它的data是filters组件的值。还有一个特殊属性是filters，对应上面的filters配置项。