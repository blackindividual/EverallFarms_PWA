import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useBatchesViewModel } from '../vm/useBatchesViewModel'
import type { BirdType } from '../../../core/birds'
import { BIRD_TYPES } from '../../../core/birds'

type Form = {
  name: string
  birdType: BirdType
  initialCount: string
  costPerBird: string
  startDate: string
}

const defaultForm: Form = {
  name: '',
  birdType: 'BROILER',
  initialCount: '',
  costPerBird: '',
  startDate: new Date().toISOString().slice(0, 10),
}

export default function BatchesPage() {
  const { state, actions } = useBatchesViewModel()
  const [form, setForm] = useState<Form>(defaultForm)
  const [busy, setBusy] = useState(false)

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await actions.create({
        name: form.name,
        birdType: form.birdType,
        initialCount: Number(form.initialCount || 0),
        costPerBird: Number(form.costPerBird || 0),
        startDate: form.startDate,
      })
      setForm(defaultForm)
    } catch {}
    setBusy(false)
  }

  return (
    <div className="p-6">
      <h1 className="mb-4">Batches</h1>
      {state.error && (
        <div className="mb-3" style={{background:'#000', color:'#fff', padding:12, borderRadius:8}}>
          {state.error}
        </div>
      )}
      <section className="mb-8">
        <h2 className="mb-2">Create Batch</h2>
        <form onSubmit={onCreate} className="grid gap-3" style={{maxWidth: 560}}>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            required
            style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}}
          />
          <select
            value={form.birdType}
            onChange={(e) => setForm({ ...form, birdType: e.target.value as BirdType })}
            style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8, background:'#fff'}}
          >
            {BIRD_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={form.initialCount}
            onChange={(e) => setForm({ ...form, initialCount: e.target.value })}
            placeholder="Initial count"
            style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}}
          />
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={form.costPerBird}
            onChange={(e) => setForm({ ...form, costPerBird: e.target.value })}
            placeholder="Cost per bird"
            style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}}
          />
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}}
          />
          <button disabled={busy} type="submit" style={{background:'#000', color:'#fff', borderRadius:8, padding:'16px', minHeight:72}}>
            {busy ? 'Adding…' : 'Add Batch'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-2">Your Batches</h2>
        {state.loading ? (
          <p>Loading…</p>
        ) : state.items.length === 0 ? (
          <p className="opacity-80">No batches yet.</p>
        ) : (
          <ul className="grid gap-2" style={{maxWidth: 640}}>
            {state.items.map((b) => (
              <li key={b.id} className="flex items-center justify-between" style={{border:'1px solid #000', borderRadius:8, padding:'12px 14px'}}>
                <div>
                  <div style={{fontWeight:600}}>{b.name}</div>
                  <div className="opacity-80" style={{fontSize:14}}>{b.birdType} • {b.startDate} • {b.currentCount} birds</div>
                </div>
                <div className="flex items-center gap-3">
                  <Link to={`/batches/${b.id}`} style={{textDecoration:'underline'}}>Open</Link>
                  <button onClick={() => actions.remove(b.id)} style={{background:'#fff', color:'#000', border:'1px solid #000', borderRadius:8, padding:'10px 12px', minHeight:48}}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
