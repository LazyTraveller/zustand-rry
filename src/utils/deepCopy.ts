export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function deepCopy1<T>(obj: T) {
  if (!obj) return
  if (typeof obj !== 'object') return
  const target = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        target[key] = deepCopy1(obj[key])
      } else {
        target[key] = obj[key]
      }
    }
  }
  return target
}