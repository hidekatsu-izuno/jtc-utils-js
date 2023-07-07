import { isPlainObject } from "./isPlainObject.js"

export function isEmpty(obj: any) {
  if (obj == null) {
    return true
  }

  const type = typeof obj
  if (type === "string") {
    return obj.length === 0
  } else if (type === "number") {
    return Number.isNaN(obj)
  } else if (typeof(obj[Symbol.iterator]) === "function") {
    return obj.length === 0 || obj.size === 0
  } else if (isPlainObject(obj)) {
    for (const name in obj) {
			return false
		}
    return true
  }

  return false
}
