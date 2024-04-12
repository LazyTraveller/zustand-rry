import { useRef, useMemo, useEffect, useReducer } from 'react'
import createStore from './vanilla'

/**
 * zustand简单实现
 * zustand的核心是将外部store和组件view的交互
   先使用create函数基于注入的initStateCreateFunc创建一个闭包的store，
   并暴露对应的subscribe、setState、getState、~~destory~~(此 api 将被移除)这几个api

   借助于react官方提供的useSyncExternalStoreWithSelector可以将store和view层绑定起来，
   从而实现使用外部的store来控制页面的展示
 * @param {*} api 
 * @param {*} selector 
 * @param {*} equalityFn 
 * @returns 
 */
export const useStore = (api, selector, equalityFn) => {
  const { subscribe, getState } = api
  const state = getState()
  const value = useRef(useMemo(() => selector(state), []))
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  const listener = (newState) => {
    const newValue = selector(newState)
    if (equalityFn !== undefined) {
      if (!equalityFn(value.current, newValue)) value.current = newValue
    } else if (value.current !== newValue) {
      value.current = newValue
      forceUpdate()
    }
  }

  useEffect(() => {
    return subscribe(listener)
  }, [])

  console.log(value.current, 'current')
  return value.current
}
const create = (fn) => {
  const api = createStore(fn);
  const useBoundStore = (selector, equalityFn) =>
    useStore(api, selector || api.getState, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};

export default create