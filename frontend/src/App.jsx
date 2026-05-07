import { useEffect, useState } from "react"
import Calendar from "./components/Calendar/Calendar.jsx"
import Splash from "./components/Splash/Splash.jsx"

export default function App() {
  const [isBooting, setIsBooting] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setIsBooting(false), 2200)
    return () => clearTimeout(t)
  }, [])

  const shifts = [
    { id: "t1", date: "2026-05-04", start: "07:00", end: "13:00", name: "Rossi", role: "Mattina" },
    { id: "t2", date: "2026-05-04", start: "13:00", end: "19:00", name: "Bianchi", role: "Pomeriggio" },
    { id: "t3", date: "2026-05-05", start: "08:00", end: "14:00", name: "Verdi", role: "Mattina" },
    { id: "t4", date: "2026-05-05", start: "14:00", end: "20:00", name: "Neri", role: "Pomeriggio" },
    { id: "t5", date: "2026-05-07", start: "09:00", end: "17:00", name: "Gallo", role: "Giornaliero" },
    { id: "t6", date: "2026-05-10", start: "07:00", end: "13:00", name: "Conti", role: "Mattina" },
    { id: "t7", date: "2026-05-10", start: "13:00", end: "19:00", name: "Fontana", role: "Pomeriggio" },
    { id: "t8", date: "2026-05-10", start: "19:00", end: "23:00", name: "Costa", role: "Sera" },
  ]

  if (isBooting) return <Splash label="SmartShift" />

  return (
    <div className="app">
      <div className="card">
        <div className="cardHeader">
          <div className="title">
            <h1>SmartShift</h1>
            <p>Calendario turni (mese/settimana) • Stampa pulita da bacheca</p>
          </div>
        </div>

        <div className="cardBody">
          <Calendar title="SmartShift — Calendario turni" shifts={shifts} />
        </div>
      </div>
    </div>
  )
}
