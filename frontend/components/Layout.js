import Link from 'next/link'

export default function Layout({ children }){
  return (
    <div>
      <header className="topnav">
        <div className="container">
          <div className="brand">
            <div style={{width:44,height:44,background:'var(--primary-green)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#fff'}}>RC</div>
            <div>
              <h1 style={{margin:0,fontSize:'1.05rem',color:'var(--secondary-gray)'}}>Roma Calendar</h1>
              <div style={{fontSize:'0.78rem',color:'var(--muted)'}}>Gestión de turnos</div>
            </div>
          </div>

          <nav className="nav-actions" aria-label="Navegación principal">
            <Link href="/" className="btn">Inicio</Link>
            <Link href="/" className="btn">Calendario</Link>
            <Link href="/analytics" className="btn">Estadísticas</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        {children}
      </main>
    </div>
  )
}
