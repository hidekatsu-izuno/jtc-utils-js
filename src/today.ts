import { startOfDay } from "date-fns"
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz"
import now from "./now.js"

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function today() {
    const tz = timeZone
    const dt = now()
    if (tz === "Asia/Tokyo") {
        return startOfDay(dt)
    }
    return zonedTimeToUtc(startOfDay(utcToZonedTime(dt, "Asia/Tokyo")), "Asia/Tokyo")    
}
