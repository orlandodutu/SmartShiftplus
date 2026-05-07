const MS_PER_DAY = 24 * 60 * 60 * 1000

export function toISODate(d) {
  const x = startOfDay(d)
  const y = x.getFullYear()
  const m = String(x.getMonth() + 1).padStart(2, "0")
  const day = String(x.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map((n) => Number(n))
  const x = new Date(y, (m ?? 1) - 1, d ?? 1)
  return startOfDay(x)
}

export function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function addDays(d, days) {
  const x = startOfDay(d)
  x.setTime(x.getTime() + days * MS_PER_DAY)
  return x
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// weekStartsOn: 1 => Monday (IT), 0 => Sunday
export function startOfWeek(d, weekStartsOn = 1) {
  const x = startOfDay(d)
  const day = x.getDay() // 0..6 (Sun..Sat)
  const diff = (day - weekStartsOn + 7) % 7
  return addDays(x, -diff)
}

export function endOfWeek(d, weekStartsOn = 1) {
  const s = startOfWeek(d, weekStartsOn)
  return addDays(s, 6)
}

export function startOfMonth(d) {
  const x = startOfDay(d)
  x.setDate(1)
  return x
}

export function endOfMonth(d) {
  const x = startOfDay(d)
  x.setMonth(x.getMonth() + 1, 0) // last day of month
  return x
}

export function getMonthGrid(anchorDate, weekStartsOn = 1) {
  const start = startOfWeek(startOfMonth(anchorDate), weekStartsOn)
  const end = endOfWeek(endOfMonth(anchorDate), weekStartsOn)
  const days = []
  for (let cur = start; cur <= end; cur = addDays(cur, 1)) {
    days.push(cur)
  }
  return { start, end, days }
}

export function getWeekDays(anchorDate, weekStartsOn = 1) {
  const start = startOfWeek(anchorDate, weekStartsOn)
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  return { start, end: addDays(start, 6), days }
}

export function formatMonthYear(d, locale = "it-IT") {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(d)
}

export function formatDateShort(d, locale = "it-IT") {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(d)
}

export function formatRange(start, end, locale = "it-IT") {
  if (isSameDay(start, end)) return formatDateShort(start, locale)
  return `${formatDateShort(start, locale)} — ${formatDateShort(end, locale)}`
}

