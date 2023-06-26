export function escapeRegExp(expr: string) {
  return expr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
