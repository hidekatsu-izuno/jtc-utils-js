import { getTimeZone } from "./getTimeZone"

export function getTimeZoneOffset(date: Date, tz: string) {
  const tzDate = relativeTime(date, tz)
  const zDate = relativeTime(date, getTimeZone())
  return zDate.getTime() - tzDate.getTime()
}

function relativeTime(date: Date, timeZone: string): Date {
  const parts: {
    year?: string
    month?: string
    day?: string
    hour?: string
    minute?: string
    second?: string
  } = {}

  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone,
    hourCycle: "h23",
  })
    .formatToParts(date)
    .forEach((part) => {
      parts[part.type as keyof typeof parts] = part.value
    })
  return new Date(
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`
  )
}
