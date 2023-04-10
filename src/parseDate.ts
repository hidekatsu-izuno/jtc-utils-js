import {
  parse as _parseDate,
  parseISO,
  isValid,
} from "date-fns"

export default function parseDate(str: string | null | undefined, format?: string) {
  if (!str) {
    return null
  }

  try {
    const tmp = format ? _parseDate(str, format, new Date()) : parseISO(str)
    if (isValid(tmp)) {
      return tmp
    } else {
      return null
    }
  } catch (err) {
    if (err instanceof RangeError) {
      return null
    } else {
      throw err
    }
  }
}
