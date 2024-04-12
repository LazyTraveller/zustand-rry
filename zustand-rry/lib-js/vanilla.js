// 生成store闭包，并返回API
const createStore = (fn) => {
  let state = {}
  const listeners = new Set()

  const setState = (partial, replace) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial
    const previousState = state
    state = replace ?? typeof nextState !== 'object' ? nextState : Object.assign({}, state, nextState)
    listeners.forEach((listener) => {
      listener(state, previousState)
    })
  }

  const subscribe = (fn) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }

  const destroy = () => {
    listeners.clear()
  }

  const getState = () => state

  const api = { setState, subscribe, getState, destroy }
  state = fn(setState, getState, api)
  return api
}

export default createStore