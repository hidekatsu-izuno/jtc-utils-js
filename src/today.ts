import { startOfDay } from "date-fns"
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz"
import now from "./now.js"

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export function today() {
  let dt = now()
  if (timeZone === "Asia/Tokyo") {
    dt = startOfDay(dt)
  } else {
    dt = zonedTimeToUtc(startOfDay(utcToZonedTime(dt, "Asia/Tokyo")), "Asia/Tokyo")
  }
  return dt
}
