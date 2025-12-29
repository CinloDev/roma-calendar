import { useEffect, useState } from 'react'
import { fetchBookingsRange, insertBooking, isMock } from '../lib/supabaseClient'
import BookingModal from './BookingModal'

const TIMES = [
  '08:00-09:00','09:00-10:00','10:00-11:00','11:00-12:00','14:00-15:00','15:00-16:00','16:00-17:00','17:00-18:00','18:00-19:00','19:00-20:00'
]

export default function Calendar() {
  const [dateStart, setDateStart] = useState(new Date())
  const [bookings, setBookings] = useState([])

  useEffect(() => { fetchBookings() }, [dateStart])

  async function fetchBookings() {
    const start = new Date(dateStart)
    const end = new Date(start)
    end.setDate(start.getDate() + 7)
    const startISO = start.toISOString().slice(0,10)
    const endISO = end.toISOString().slice(0,10)
    const { data, error } = await fetchBookingsRange(startISO, endISO)
    if (error) console.error(error)
    else setBookings(data || [])
  }

  function nextWeek(delta) {
    const d = new Date(dateStart)
    d.setDate(d.getDate() + 7 * delta)
    setDateStart(d)
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

  const days = Array.from({length:7}).map((_,i)=>{
    const d = new Date(dateStart)
    d.setDate(d.getDate()+i)
    return d
  })

  return (
    <div>
      <h2>Turnos</h2>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <button onClick={()=>nextWeek(-1)}>← Anterior</button>
        <button onClick={()=>nextWeek(1)}>Siguiente →</button>
      </div>

      <table style={{width:'100%',marginTop:12,borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th>Hora</th>
            {days.map((d,i)=>(<th key={i}>{d.toLocaleDateString()}</th>))}
          </tr>
        </thead>
        <tbody>
          {TIMES.map(time=> (
            <tr key={time}>
              <td style={{padding:8,border:'1px solid #ddd'}}>{time}</td>
              {days.map((d,di)=>{
                const iso = d.toISOString().slice(0,10)
                const taken = bookings.find(b=>b.date===iso && b.slot===time)
                return (
                  <td key={di} style={{padding:8,border:'1px solid #ddd',textAlign:'center'}}>
                    {taken ? (<small>Reservado</small>) : (<button onClick={()=>openModal(di,time)}>Reservar</button>)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <BookingModal open={modalOpen} time={modalTime} dayIndex={modalDay} onClose={()=>setModalOpen(false)} onSubmit={handleSubmitBooking} />
    </div>
  )
}
