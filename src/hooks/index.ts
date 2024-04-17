/** 基于useState 的用法，我们尝试着自己实现一个useState */
let _state: any
function useState<T>(initialValue: T) {
  _state = _state || initialValue
  function setState(newState: T) {
    _state = newState
  }
  return [_state, setState]
}

// 问题点：我们没有存储 state，每次渲染 Counter 组件的时候，state 都是新重置的。


// useEffect 简单实现
// 有两个参数 callback 和 dependencies 数组
// 如果 dependencies 不存在，那么 callback 每次 render 都会执行
// 如果 dependencies 存在，只有当它发生了变化， callback 才会执行

/**
 * useEffect hook 的类型声明
 * @param callback effect 回调函数
 * @param depArray effect 依赖数组
 */
let _deps
function useEffect<TCallback extends (...args: any[]) => void>(
  callback: TCallback,
  depArray?: ReadonlyArray<any>
): void {
  const hasNoDependencies = !depArray
  /** 两次的 dependencies 是否完全相等 */
  const hasChangedDeps = Array.isArray(_deps) && _deps.length
    ? !depArray!.every((dep, i) => dep === _deps[i])
    : true

  if (hasNoDependencies || hasChangedDeps) {
    callback()
    _deps = depArray
  }
}

// Q：为什么第二个参数是空数组，相当于 componentDidMount ？
// A：因为依赖一直不变化，callback 不会二次执行。

// 我们需要可以存储多个 _state 和 _deps。代码关键在于：

// 初次渲染的时候，按照 useState，useEffect 的顺序，把 state，deps 等按顺序塞到 memoizedState 数组中。
// 更新的时候，按照顺序，从 memoizedState 中把上次记录的值拿出来。
// 如果还是不清楚，可以看下面的图。

// 代码实现
const memoizedState = [] // hooks 存放在这个数组
let cursor = 0 // 下标

function useState1(initialValue) {
  memoizedState[cursor] = memoizedState[cursor] || initialValue
  const currenrCursor = cursor
  function setState(newState) {
    memoizedState[currenrCursor] = newState
    // render()
  }
  return [memoizedState[cursor++], setState] // 返回当前 state，并把 cursor 加 1
}

function useEffect1(callback, depArray) {
  const hasNoDependencies = !depArray
  const hasChangedDeps = Array.isArray(_deps) && _deps.length
    ? !depArray!.every((dep, i) => dep === _deps[i])
    : true
  if (hasNoDependencies || hasChangedDeps) {
    callback()
    memoizedState[cursor] = depArray
  }
  cursor++
}

// 解决逻辑复用的问题，社区也诞生了ahook， react-use， umijs/hooks等库
// 如table
// 分页管理
// pageSize管理
// 分页变化，pageSize 变化时重新进行异步请求
// 筛选条件变化时，重置分页，并重新请求数据
// 异步请求的 loading 处理
// 异步请求的竞态处理
// 组件卸载时丢弃进行中的异步请求（很多人通常不处理，在某些情况会报警告）

// 搜索
// 防抖
// 异步请求的 loading 处理
// 异步请求的请求时序控制
// 组件卸载时取消防抖及异步请求等逻辑
export {
  useState,
  useState1,
  useEffect,
  useEffect1
}