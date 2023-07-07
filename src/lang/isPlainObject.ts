/*
 * Derieved from jQuery.isPlainObject (https://github.com/jquery/jquery)
 * @license MIT License
 */

const BaseObj = {}
const hasOwnProperty = BaseObj.hasOwnProperty
const toString = hasOwnProperty.toString
const toStringObject = toString.call(Object)

export function isPlainObject(obj: any) {
  // Detect obvious negatives
  // Use toString instead of jQuery.type to catch host objects
  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }

  const proto = Object.getPrototypeOf(obj);
  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if (!proto) {
    return true;
  }

  // Objects with prototype are plain iff they were constructed by a global Object function
  if (hasOwnProperty.call(proto, "constructor")) {
    const cstr = proto.constructor
    if (typeof cstr === "function" && toString.call(cstr) === toStringObject) {
      return true
    }
  }

  return false
}
