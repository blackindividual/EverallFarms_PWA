import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="p-6">
      <h1 className="mb-2">Page Not Found</h1>
      <p className="opacity-80">The page you’re looking for doesn’t exist.</p>
      <div className="mt-4">
        <Link to="/" style={{ textDecoration: 'underline' }}>Go back Home</Link>
      </div>
    </div>
  )
}

