import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { fetchBookingsRange } from '../lib/supabaseClient'

function formatDate(d){
  return d.toISOString().slice(0,10)
}

export default function Analytics(){
  const [stats, setStats] = useState(null)

  useEffect(()=>{
    (async ()=>{
      const end = new Date()
      const start = new Date(end); start.setDate(end.getDate() - 6)
      const startISO = formatDate(start)
      const endISO = formatDate(new Date(end.getFullYear(), end.getMonth(), end.getDate()+1))
      const { data = [] } = await fetchBookingsRange(startISO, endISO)

      const days = Math.max(1, Math.floor((new Date(endISO) - new Date(startISO)) / (1000*60*60*24)))
      const total = data.length
      const avgPerDay = +(total / days).toFixed(2)

      // group by slot (or service if available)
      const bySlot = {}
      data.forEach(b => { const key = b.slot || 'unknown'; bySlot[key] = (bySlot[key]||0) + 1 })

      setStats({ period:{ start: startISO, end: endISO, days }, total, avgPerDay, bySlot })
    })()
  },[])

  return (
    <Layout>
      <div className="card">
        <h2>Estadísticas recientes</h2>
        {!stats && <p style={{color:'var(--muted)'}}>Cargando…</p>}
        {stats && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
            <div className="card">
              <strong>Total reservas</strong>
              <div style={{fontSize:'1.6rem',marginTop:6}}>{stats.total}</div>
              <div style={{color:'var(--muted)',marginTop:6}}>Promedio por día: {stats.avgPerDay}</div>
            </div>

            <div className="card">
              <strong>Período</strong>
              <div style={{marginTop:6,color:'var(--muted)'}}>{stats.period.start} — {stats.period.end}</div>
              <div style={{marginTop:8}}>{stats.period.days} días</div>
            </div>

            <div className="card" style={{gridColumn:'1 / -1'}}>
              <strong>Reservas por franja</strong>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:8}}>
                {Object.entries(stats.bySlot).map(([k,v])=> (
                  <div key={k} className="badge">{k}: {v}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
