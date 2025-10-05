import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useWeightsViewModel } from '../vm/useWeightsViewModel'

type Form = {
  date: string
  sampleWeight: string
  birdsWeighed: string
}

const defaultForm: Form = {
  date: new Date().toISOString().slice(0, 10),
  sampleWeight: '',
  birdsWeighed: '1',
}

export default function WeightsPage() {
  const { id: batchId } = useParams()
  const { state, actions } = useWeightsViewModel(batchId || '')
  const [form, setForm] = useState<Form>(defaultForm)
  const [busy, setBusy] = useState(false)

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!batchId) return
    setBusy(true)
    try {
      await actions.create({
        batchId,
        date: form.date,
        sampleWeight: Number(form.sampleWeight || 0),
        birdsWeighed: Number(form.birdsWeighed || 1),
      })
      setForm(defaultForm)
    } catch {}
    setBusy(false)
  }

  return (
    <div className="p-6">
      <h1 className="mb-2">Daily Weights</h1>
      <p className="opacity-80 mb-4">Batch: {batchId} • <a href={batchId ? `/batches/${batchId}` : '/'} style={{textDecoration:'underline'}}>Back</a></p>

      {state.error && (
        <div className="mb-3" style={{background:'#000', color:'#fff', padding:12, borderRadius:8}}>
          {state.error}
        </div>
      )}

      <section className="mb-8">
        <h2 className="mb-2">Add Entry</h2>
        <form onSubmit={onCreate} className="grid gap-3" style={{maxWidth: 560}}>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}}
          />
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={form.sampleWeight}
            onChange={(e) => setForm({ ...form, sampleWeight: e.target.value })}
            placeholder="Average weight (kg)"
            style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}}
          />
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={form.birdsWeighed}
            onChange={(e) => setForm({ ...form, birdsWeighed: e.target.value })}
            placeholder="Birds weighed"
            style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}}
          />
          <button disabled={busy} type="submit" style={{background:'#000', color:'#fff', borderRadius:8, padding:'16px', minHeight:72}}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-2">Entries</h2>
        {state.loading ? (
          <p>Loading…</p>
        ) : state.items.length === 0 ? (
          <p className="opacity-80">No weight entries yet.</p>
        ) : (
          <ul className="grid gap-2" style={{maxWidth: 640}}>
            {state.items.slice().reverse().map((w) => (
              <li key={w.id} className="flex items-center justify-between" style={{border:'1px solid #000', borderRadius:8, padding:'12px 14px'}}>
                <div>
                  <div style={{fontWeight:600}}>{w.date}</div>
                  <div className="opacity-80" style={{fontSize:14}}>
                    {w.sampleWeight} kg • {w.birdsWeighed} birds
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => actions.remove(w.id)} style={{background:'#fff', color:'#000', border:'1px solid #000', borderRadius:8, padding:'10px 12px', minHeight:48}}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
