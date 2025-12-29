import dynamic from 'next/dynamic'
import Layout from '../components/Layout'
const Calendar = dynamic(()=>import('../components/Calendar'), { ssr:false })

export default function Home(){
  return (
    <Layout>
      <section style={{marginTop:8}}>
        <div className="card">
          <h2>Turnos</h2>
          <p style={{color:'var(--muted)',marginTop:6}}>Selecciona un día y una franja horaria para reservar.</p>
          <div style={{marginTop:12}}>
            <Calendar />
          </div>
        </div>
      </section>
    </Layout>
  )
}
