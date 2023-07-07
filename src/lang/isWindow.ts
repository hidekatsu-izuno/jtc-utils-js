/*
 * Derieved from jQuery.isWindow (https://github.com/jquery/jquery)
 * @license MIT License
 */
export function isWindow(obj: any) {
  return obj != null && obj === obj.window
}
