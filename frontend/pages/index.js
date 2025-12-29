import dynamic from 'next/dynamic'
const Calendar = dynamic(()=>import('../components/Calendar'), { ssr:false })

export default function Home(){
  return (
    <main style={{padding:20,fontFamily:'Arial, sans-serif'}}>
      <header>
        <h1>Turnos - Prototipo</h1>
        <p>Prototipo mínimo conectado a Supabase</p>
      </header>

      <section style={{marginTop:20}}>
        <Calendar />
      </section>
    </main>
  )
}
