import { useRef, useMemo, useEffect, useReducer } from 'react';
import createStore from './vanilla';

type Selector<S, V> = (state: S) => V;
type EqualityFn<V> = (a: V, b: V) => boolean;

interface StoreApi {
  subscribe: (listener: (newState: any) => void) => () => void;
  getState: () => any;
}

/**
 *  Zustand 的核心，实现了 reselect 缓存和注册事件的 listener 的功能，并且通过 forceUpdate 对组件进行重渲染
 *  React hooks 语法下，我们如何让当前组件刷新？
 *  需要利用 useState 或 useReducer 这类 hook 的原生能力即可，调用第二个返回值的 dispatch 函数，
 *  就可以让组件重新渲染，这里 zustand 选择的是 useReducer
 * 
 * 比较函数后判断值前后是否发生了改变，如果改变则调用 forceUpdate 进行一次强制刷新
 * zustand 实现状态共享的方式本质是将状态保存在一个对象里
 * @param api 
 * @param selector 
 * @param equalityFn 
 * @returns 
 */

const useStore = <S, V>(api: StoreApi, selector: Selector<S, V>, equalityFn?: EqualityFn<V>): V => {
  const { subscribe, getState } = api;
  const state = getState();
  const value = useRef(useMemo(() => selector(state), []));
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const listener = (newState: S) => {
    const newValue = selector(newState);
    if (equalityFn !== undefined) {
      if (!equalityFn(value.current, newValue)) value.current = newValue;
    } else if (value.current !== newValue) {
      value.current = newValue;
      forceUpdate();
    }
  };

  useEffect(() => {
    return subscribe(listener);
  }, []);

  console.log(value.current, 'current');
  return value.current;
};

interface Store<S> {
  (): S;
  setState: (partial: Partial<S>) => void;
  subscribe: (listener: (state: S) => void) => () => void;
}

const create = <S>(fn: () => S): Store<S> => {
  const api = createStore(fn);
  const useBoundStore = (selector: Selector<S, any> = api.getState, equalityFn?: EqualityFn<any>): any =>
    useStore(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};

export default create;