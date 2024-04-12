// 生成store闭包，并返回API
import {useSyncExternalStoreWithSelector} from 'use-sync-external-store/with-selector';
import { useDebugValue } from 'react';
import { StateCreator, Create, StoreApi, WithReact } from './const'
import 'vite/client'

// createState 是使用者在创建的store的时候传入的一个函数
const createStoreImpl = (createState) => {
  type TState = ReturnType<typeof createState>
  type Listener = (state: TState, prevState: TState) => void

  // 这里的state就是store，是个闭包，通过暴露的API访问
  let state: TState
  const listener: Set<Listener> = new Set()

  // setState的partial参数支持对象和函数，replace指明是全量替换store还是merge
  // 更新是浅比较
  const setState = (partial, replace) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial
    // 只有在相等的时候才更新，然后出发listener
    if (!Object.is(nextState, state)) {
      const previousState = state
      state = replace ?? typeof nextState !== 'object' ? (nextState as TState) : Object.assign({}, state, nextState)
      listener.forEach((listener) => listener(state, previousState))
    }
  }

  const getState = () => state

  const subscribe = (listener) => {
    listener.add(listener)
    return () => listener.default(listener)
  }

  // api 被干掉了
  const destroy: StoreApi<TState>['destroy'] = () => {
    if (import.meta.env?.MODE !== 'production') {
      console.log(
        '[zustand] Store API is destroyed. Make sure your component is unmounted before calling this method.',
      )
    }
    listener.clear()
  }

  const api = { setState, getState, subscribe, destroy }
  // 这里就是官方实例的set, get, api
  state = createState(setState, getState, api)
  return api
}

// 调用 createStore的时候理论上createState函数是一点存在的
// 但是为了ts类型定义，createStore<T>()(() => {}) 所以会出现手动调用空值的情况
export const createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl)

export function useStore<TState, StateSlice>(
  api: WithReact<StoreApi<TState>>,
  selector: (state: TState) => StateSlice = api.getState any,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector,
    equalityFn
  );
  useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  if (
    import.meta.env?.MODE !== "production" &&
    typeof createState !== "function"
  ) {
    console.warn(
      "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
    );
  }
  // 直接注入自定义的store不会注入api，需要自己在注入的store里自行实现
  const api =
    typeof createState === "function" ? createStore(createState) : createState;

  const useBoundStore: any = (selector?: any, equalityFn?: any) =>
    useStore(api, selector, equalityFn);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};

export const create = (<T>(createState: StateCreator<T, [], []> | undefined) =>
  createStore ? createImpl(createState) : createImpl) as Create;