import { useState, useEffect } from 'react'

export default function BookingModal({ open, time, dayIndex, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(()=>{ if (!open) { setName(''); setEmail('') } }, [open])

  if (!open) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>Reservar {time}</h3>
        <div className="form-field">
          <label>Nombre</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="row-right">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={()=> onSubmit({ name: name.trim(), email: email.trim() }) } disabled={!name || !email}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}
