import { useState, useEffect } from 'react'

export default function BookingModal({ open, time, dayIndex, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(()=>{ if (!open) { setName(''); setEmail('') } }, [open])

  if (!open) return null

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',padding:20,width:360,borderRadius:6}}>
        <h3>Reservar {time}</h3>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <label>Nombre</label>
          <input value={name} onChange={e=>setName(e.target.value)} />
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
            <button onClick={onClose}>Cancelar</button>
            <button onClick={()=> onSubmit({ name: name.trim(), email: email.trim() }) } disabled={!name || !email}>Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
