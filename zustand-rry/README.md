# zustand 源码学习

zustand是基于发布订阅模式实现的一个状态管理库

```js
// 在js项目中使用，不需要类型
import { create } from "zustand";

const initStateCreateFunc = (set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
});

const useBearStore = create(initStateCreateFunc);
```

## 源码主体流程

- zustand的核心是将外部store和组件view的交互
先使用create函数基于注入的initStateCreateFunc创建一个闭包的store，并暴露对应的subscribe、setState、getState、~~destory~~(此 api 将被移除)这几个api

- 借助于react官方提供的useSyncExternalStoreWithSelector可以将store和view层绑定起来，从而实现使用外部的store来控制页面的展示。

- zustand还支持了middleware的能力，采用create(middleware(...args))的形式即可使用对应的middleware

### 核心代码

- 最核心的create和useSyncExternalStoreWithSelector函数

#### 重点思想

- create函数生成的store是一个闭包，通过暴露api的方式实现对store的访问。

- 核心代码在vanilla.ts和react.ts这两个文件中，vanilla.ts里实现了一个完整的有pub-sub能力的store, 不需要依赖于react即可使用。

- react.ts里基于useSyncExternalStoreWithSelector实现了一个useStore的 hook，在组件里调用create返回的函数时会将store和组件绑定起来，而这个绑定就是useStore实现的