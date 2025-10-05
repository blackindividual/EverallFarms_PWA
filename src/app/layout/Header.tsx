import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header style={{
      position: 'sticky', top: 0, background: '#000', color: '#fff',
      padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>EverallFarm_Lite</Link>
    </header>
  )
}

