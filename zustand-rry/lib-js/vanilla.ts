type SetStateFunction<T> = (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;
type GetStateFunction<T> = () => T;

interface StoreApi<T> {
  setState: SetStateFunction<T>;
  subscribe: (fn: (state: T, previousState: T) => void) => () => void;
  getState: GetStateFunction<T>;
  destroy: () => void;
}

const createStore = <T>(fn: (setState: SetStateFunction<T>, getState: GetStateFunction<T>, api: StoreApi<T>) => T): StoreApi<T> => {
  let state: T = {} as T;
  const listeners: Set<(state: T, previousState: T) => void> = new Set();

  const setState: SetStateFunction<T> = (partial, replace) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    const previousState = state;
    state = replace ?? typeof nextState !== 'object' ? nextState : Object.assign({}, state, nextState);
    listeners.forEach((listener) => {
      listener(state, previousState);
    });
  };

  const subscribe = (fn: (state: T, previousState: T) => void): (() => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  const destroy = (): void => {
    listeners.clear();
  };

  const getState: GetStateFunction<T> = (): T => state;

  const api: StoreApi<T> = { setState, subscribe, getState, destroy };
  state = fn(setState, getState, api);
  return api;
};

export default createStore;