export function isTelephoneNo(value: string | null | undefined) {
  if (value == null) {
    return false
  }

  if (!/^(\+[0-9]{1,3}(-| *))?(\([0-9]{1,6}\) *)?([0-9]-?){1,15}$/.test(value)) {
    return false
  }

  const nums = value.replace(/[^0-9]/g, "")
  if (nums.length > 15) {
    return false
  }

  return true
}
