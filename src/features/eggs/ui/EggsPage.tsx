import { useParams, Link } from 'react-router-dom'

export default function EggsPage() {
  const { id } = useParams()
  return (
    <div className="p-6">
      <h1 className="mb-2">Daily Eggs</h1>
      <p className="opacity-80">Batch: {id} • <Link to={id ? `/batches/${id}` : '/'} style={{textDecoration:'underline'}}>Back</Link></p>
      <p>Placeholder. Will list and add eggs later.</p>
    </div>
  )
}
