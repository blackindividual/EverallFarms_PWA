import { Link, useLocation, useParams } from 'react-router-dom'

function Segment({ children }: { children: React.ReactNode }) {
  return <span style={{ opacity: 0.8 }}>{children}</span>
}

export function Breadcrumbs() {
  const location = useLocation()
  const params = useParams()
  const parts = location.pathname.split('/').filter(Boolean)

  if (parts.length === 0) return null

  const crumbs: React.ReactNode[] = []

  // Home
  crumbs.push(<Link key="home" to="/" style={{ color: '#000' }}>Home</Link>)

  if (parts[0] === 'batches') {
    crumbs.push(<span key="sep1"> / </span>)
    crumbs.push(<Link key="batches" to="/" style={{ color: '#000' }}>Batches</Link>)

    if (parts[1]) {
      const id = params.id ?? parts[1]
      crumbs.push(<span key="sep2"> / </span>)
      crumbs.push(<Link key="batch" to={`/batches/${id}`} style={{ color: '#000' }}><Segment>Batch {String(id).slice(0, 6)}</Segment></Link>)

      if (parts[2]) {
        crumbs.push(<span key="sep3"> / </span>)
        const tail = parts[2]
        const label = tail.charAt(0).toUpperCase() + tail.slice(1)
        crumbs.push(<Segment key="tail">{label}</Segment>)
      }
    }
  }

  return (
    <nav aria-label="Breadcrumb" style={{ padding: '8px 16px', borderBottom: '1px solid #000' }}>
      {crumbs}
    </nav>
  )
}

