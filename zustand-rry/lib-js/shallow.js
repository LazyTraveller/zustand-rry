export function shallow(objA, objB) {
  if (Object.is(objA, objB)) return

  if (typeof objA !== 'object' || objA === null) return false
  if (typeof objB !== 'object' || objB === null) return false

  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false
    for (const [key, value] of objA) {
      if (!Object.is(value, objB.get(key))) {
        return false
      }
    }
    return true
  }

  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false
    for (const value of objA) {
      if (!objB.has(value)) {
        return false
      }
    }
    return true
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysB[i]) ||
      !Object.is(objA[keysA[i]], objB[keysB[i]])) {
      return false
    }
  }
  return true
}

export default (objA, objB) => shallow(objA, objB)