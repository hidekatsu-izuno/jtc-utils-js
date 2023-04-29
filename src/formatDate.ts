import {
  format as _formatDate,
  parseISO,
  isValid,
} from "date-fns"

export function formatDate(date: number | Date | string | null | undefined, format: string) {
  if (!date) {
    return ""
  } else if (typeof date === "string") {
    try {
      const tmp = parseISO(date)
      if (isValid(tmp)) {
        date = tmp
      } else {
        return date as string
      }
    } catch (err) {
      return date as string
    }
  }

  try {
    return _formatDate(date, format)
  } catch (err) {
    if (err instanceof RangeError) {
      return date.toString()
    } else {
      throw err
    }
  }
}
