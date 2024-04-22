export function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

/**
 * 防抖，最后一次执行
 */
export function debounce(fun, wait) {
  let timer 
  return function () {
    const context = this
    const args = arguments

    clearTimeout(timer)
    timer = setTimeout(() => {
      fun.apply(context, args)
    }, wait)
  }
}
/**
 * 节流，只执行一次
 */
export function throttle(func, wait) {
  let timer = null
  return function(...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args)
        timer = null
      }, wait)
    }
  }
}