import { useMemo, useState } from "react"
import "./calendar.css"
import {
  addDays,
  formatMonthYear,
  formatRange,
  getMonthGrid,
  getWeekDays,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toISODate,
} from "./dateUtils"

const WEEKDAYS_IT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]

function byTime(a, b) {
  const as = `${a.start ?? ""}`.padStart(5, "0")
  const bs = `${b.start ?? ""}`.padStart(5, "0")
  return as.localeCompare(bs)
}

export default function Calendar({ title = "Calendario turni", shifts = [] }) {
  const [mode, setMode] = useState("month") // 'month' | 'week'
  const [anchorDate, setAnchorDate] = useState(() => startOfDay(new Date()))

  const today = useMemo(() => startOfDay(new Date()), [])
  const weekStartsOn = 1

  const monthGrid = useMemo(() => getMonthGrid(anchorDate, weekStartsOn), [anchorDate])
  const weekGrid = useMemo(() => getWeekDays(anchorDate, weekStartsOn), [anchorDate])

  const rangeLabel = useMemo(() => {
    if (mode === "month") return formatMonthYear(anchorDate)
    return formatRange(weekGrid.start, weekGrid.end)
  }, [anchorDate, mode, weekGrid.end, weekGrid.start])

  const subtitle = useMemo(() => {
    if (mode === "month") return `Vista mese • ${formatRange(monthGrid.start, monthGrid.end)}`
    return `Vista settimana • Settimana di ${formatRange(weekGrid.start, weekGrid.end)}`
  }, [mode, monthGrid.end, monthGrid.start, weekGrid.end, weekGrid.start])

  function goToday() {
    setAnchorDate(startOfDay(new Date()))
  }

  function goPrev() {
    if (mode === "month") {
      const m = startOfMonth(anchorDate)
      m.setMonth(m.getMonth() - 1)
      setAnchorDate(m)
      return
    }
    setAnchorDate(addDays(startOfWeek(anchorDate, weekStartsOn), -7))
  }

  function goNext() {
    if (mode === "month") {
      const m = startOfMonth(anchorDate)
      m.setMonth(m.getMonth() + 1)
      setAnchorDate(m)
      return
    }
    setAnchorDate(addDays(startOfWeek(anchorDate, weekStartsOn), 7))
  }

  function onPrint() {
    window.print()
  }

  const shiftsByDay = useMemo(() => {
    const map = new Map()
    for (const s of shifts) {
      if (!s?.date) continue
      const key = s.date
      const arr = map.get(key) ?? []
      arr.push(s)
      map.set(key, arr)
    }
    for (const [k, arr] of map.entries()) {
      arr.sort(byTime)
      map.set(k, arr)
    }
    return map
  }, [shifts])

  const cells = mode === "month" ? monthGrid.days : weekGrid.days
  const monthIndex = anchorDate.getMonth()

  return (
    <div className="calWrap">
      <div className="printHeader">
        <h1>{title}</h1>
        <p>
          {mode === "month" ? "Mese" : "Settimana"} • {rangeLabel}
        </p>
      </div>

      <div className="toolbar">
        <div className="rangeTitle">
          <h2 style={{ textTransform: "capitalize" }}>{rangeLabel}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="controls">
          <div className="segmented" role="group" aria-label="Modalità visualizzazione">
            <button
              type="button"
              aria-pressed={mode === "month"}
              onClick={() => setMode("month")}
            >
              Mese
            </button>
            <button
              type="button"
              aria-pressed={mode === "week"}
              onClick={() => setMode("week")}
            >
              Settimana
            </button>
          </div>

          <button type="button" className="btn" onClick={goPrev} aria-label="Indietro">
            ←
          </button>
          <button type="button" className="btn" onClick={goToday}>
            Oggi
          </button>
          <button type="button" className="btn" onClick={goNext} aria-label="Avanti">
            →
          </button>

          <span className="badge" title="Suggerimento">
            Suggerimento: usa “Stampa” per PDF
          </span>

          <button type="button" className="btn btnPrimary" onClick={onPrint}>
            Stampa
          </button>
        </div>
      </div>

      <div className="grid" aria-label="Calendario">
        <div className="weekdays">
          {WEEKDAYS_IT.map((d) => (
            <div key={d} className="weekday">
              {d}
            </div>
          ))}
        </div>

        <div className={mode === "month" ? "cellsMonth" : "cellsWeek"}>
          {cells.map((d) => {
            const isToday = isSameDay(d, today)
            const isMuted = mode === "month" && d.getMonth() !== monthIndex
            const dayKey = toISODate(d)
            const dayShifts = shiftsByDay.get(dayKey) ?? []
            const className = ["cell", isMuted ? "cellMuted" : "", isToday ? "today" : ""]
              .filter(Boolean)
              .join(" ")

            return (
              <div key={d.toISOString()} className={className}>
                <div className="dayTop">
                  <div className="dayNum">{d.getDate()}</div>
                </div>

                {dayShifts.length > 0 ? (
                  <div className="shifts" aria-label={`Turni del ${dayKey}`}>
                    {dayShifts.slice(0, 4).map((s) => (
                      <div key={s.id} className="shiftItem">
                        <div className="shiftTime">
                          {(s.start && s.end) ? `${s.start}–${s.end}` : s.start ?? "—"}
                        </div>
                        <div className="shiftText">
                          <span className="shiftName">{s.name ?? "Turno"}</span>
                          {s.role ? <span className="shiftRole"> • {s.role}</span> : null}
                        </div>
                      </div>
                    ))}
                    {dayShifts.length > 4 ? (
                      <div className="shiftMore">+{dayShifts.length - 4} altri</div>
                    ) : null}
                  </div>
                ) : (
                  <div className="noShifts" aria-hidden="true">
                    &nbsp;
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

