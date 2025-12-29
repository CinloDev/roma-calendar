import { useEffect, useState } from 'react'
import { fetchBookingsRange, insertBooking, isMock } from '../lib/supabaseClient'
import BookingModal from './BookingModal'

const TIMES = [
  '08:00-09:00','09:00-10:00','10:00-11:00','11:00-12:00','14:00-15:00','15:00-16:00','16:00-17:00','17:00-18:00','18:00-19:00','19:00-20:00'
]

export default function Calendar() {
  function startOfWeekMonday(d) {
    const dt = new Date(d)
    const day = dt.getDay() // 0 (Sun) - 6 (Sat)
    const diff = (day + 6) % 7 // days since Monday
    dt.setDate(dt.getDate() - diff)
    dt.setHours(0,0,0,0)
    return dt
  }

  const [dateStart, setDateStart] = useState(() => startOfWeekMonday(new Date()))
  const [bookings, setBookings] = useState([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => { fetchBookings() }, [dateStart])

  useEffect(()=>{
    function check(){ setIsMobile(typeof window !== 'undefined' && window.matchMedia('(max-width:640px)').matches) }
    check()
    window.addEventListener('resize', check)
    return ()=> window.removeEventListener('resize', check)
  },[])

  async function fetchBookings() {
    const start = new Date(dateStart)
    const end = new Date(start)
    // exclusivo: tomar 5 días (lunes a viernes)
    end.setDate(start.getDate() + 5)
    const startISO = start.toISOString().slice(0,10)
    const endISO = end.toISOString().slice(0,10)
    const { data, error } = await fetchBookingsRange(startISO, endISO)
    if (error) console.error(error)
    else setBookings(data || [])
  }

  function nextWeek(delta) {
    const d = new Date(dateStart)
    // avanzar en bloques de 5 días (solo días laborales)
    d.setDate(d.getDate() + 5 * delta)
    setDateStart(startOfWeekMonday(d))
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [modalDay, setModalDay] = useState(0)
  const [modalTime, setModalTime] = useState('')

  function openModal(dayIndex, time) {
    setModalDay(dayIndex)
    setModalTime(time)
    setModalOpen(true)
  }

  async function handleSubmitBooking({ name, email }) {
    const day = new Date(dateStart)
    day.setDate(day.getDate() + modalDay)
    const iso = day.toISOString().slice(0,10)
    const payload = { name, email, slot: modalTime, date: iso }
    const { data, error } = await insertBooking(payload)
    if (error) alert('Error al reservar: '+error.message)
    else { setModalOpen(false); fetchBookings(); alert('Reserva creada' + (isMock ? ' (modo mock)' : '')) }
  }

  const days = Array.from({length:5}).map((_,i)=>{
    const d = new Date(dateStart)
    d.setDate(d.getDate()+i)
    return d
  })

  return (
    <div className="container">
      <div className="card">
        <h2>Turnos</h2>
        <div className="controls">
          <button className="btn" onClick={()=>nextWeek(-1)}>← Anterior</button>
          <button className="btn" onClick={()=>nextWeek(1)}>Siguiente →</button>
        </div>

        {isMobile ? (
          <div className="carousel" role="list">
            {days.map((d,di)=>{
              const iso = d.toISOString().slice(0,10)
              return (
                <div key={di} className="day-card" role="listitem">
                  <div className="card">
                    <h4>{d.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'})}</h4>
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      {TIMES.map(time=>{
                        const taken = bookings.find(b=>b.date===iso && b.slot===time)
                        return (
                          <div key={time} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <div style={{color:'var(--muted)'}}>{time}</div>
                            <div>
                              {taken ? <span className="badge">Reservado</span> : <button className="btn btn-primary" onClick={()=>openModal(di,time)}>Reservar</button>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <table className="table" aria-label="Tabla de turnos">
            <thead>
              <tr>
                <th>Hora</th>
                {days.map((d,i)=>(<th key={i}>{d.toLocaleDateString()}</th>))}
              </tr>
            </thead>
            <tbody>
              {TIMES.map(time=> (
                <tr key={time}>
                  <td className="time-cell">{time}</td>
                  {days.map((d,di)=>{
                    const iso = d.toISOString().slice(0,10)
                    const taken = bookings.find(b=>b.date===iso && b.slot===time)
                    return (
                      <td key={di} className="slot">
                        {taken ? (<span className="badge">Reservado</span>) : (<button className="btn btn-primary" onClick={()=>openModal(di,time)}>Reservar</button>)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <BookingModal open={modalOpen} time={modalTime} dayIndex={modalDay} onClose={()=>setModalOpen(false)} onSubmit={handleSubmitBooking} />
    </div>
  )
}
