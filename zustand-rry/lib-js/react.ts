import { useRef, useMemo, useEffect, useReducer } from 'react';
import createStore from './vanilla';

type Selector<S, V> = (state: S) => V;
type EqualityFn<V> = (a: V, b: V) => boolean;

interface StoreApi {
  subscribe: (listener: (newState: any) => void) => () => void;
  getState: () => any;
}

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