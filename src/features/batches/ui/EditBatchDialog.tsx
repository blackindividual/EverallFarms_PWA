import { useEffect, useMemo, useState } from 'react'
import type { BirdType } from '../../../core/birds'
import { BIRD_TYPES } from '../../../core/birds'
import { createBatchesRepository } from '../data/BatchesRepositoryDexie'
import { updateBatch } from '../model/useCases'
import type { BatchEntity } from '../../../data/entities/types'

type Props = {
  open: boolean
  batchId: string
  onClose: () => void
}

export function EditBatchDialog({ open, batchId, onClose }: Props) {
  const repo = useMemo(() => createBatchesRepository(), [])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [form, setForm] = useState({
    name: '',
    birdType: 'BROILER' as BirdType,
    initialCount: '',
    currentCount: '',
    costPerBird: '',
    startDate: new Date().toISOString().slice(0, 10),
  })

  useEffect(() => {
    if (!open) return
    setError(undefined)
    ;(async () => {
      const b = await repo.getById(batchId)
      if (b) {
        setForm({
          name: b.name,
          birdType: b.birdType,
          initialCount: String(b.initialCount),
          currentCount: String(b.currentCount),
          costPerBird: String(b.costPerBird),
          startDate: b.startDate,
        })
      }
    })()
  }, [open, batchId, repo])

  if (!open) return null

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(undefined)
    try {
      await updateBatch(repo, {
        id: batchId,
        name: form.name,
        birdType: form.birdType,
        initialCount: Number(form.initialCount || 0),
        currentCount: Number(form.currentCount || 0),
        costPerBird: Number(form.costPerBird || 0),
        startDate: form.startDate,
      } as unknown as Partial<BatchEntity> & { id: string })
      onClose()
    } catch (e: any) {
      setError(String(e?.message ?? e))
    }
    setBusy(false)
  }

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div role="dialog" aria-modal="true" style={{background:'#fff', color:'#000', borderRadius:12, width:'min(680px, 96vw)'}}>
        <div style={{padding:16, borderBottom:'1px solid #000', fontWeight:600}}>Edit Batch</div>
        <form onSubmit={onSave} style={{padding:16}}>
          {error && <div style={{background:'#000', color:'#fff', padding:12, borderRadius:8, marginBottom:12}}>{error}</div>}
          <div style={{display:'grid', gap:12}}>
            <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Name" required style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}} />
            <select value={form.birdType} onChange={(e)=>setForm({...form, birdType: e.target.value as BirdType})} style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8, background:'#fff'}}>
              {BIRD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr'}}>
              <input type="number" inputMode="numeric" min={0} value={form.initialCount} onChange={(e)=>setForm({...form, initialCount: e.target.value})} placeholder="Initial count" style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}} />
              <input type="number" inputMode="numeric" min={0} value={form.currentCount} onChange={(e)=>setForm({...form, currentCount: e.target.value})} placeholder="Current count" style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}} />
            </div>
            <input type="number" inputMode="decimal" min={0} step="0.01" value={form.costPerBird} onChange={(e)=>setForm({...form, costPerBird: e.target.value})} placeholder="Cost per bird" style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}} />
            <input type="date" value={form.startDate} onChange={(e)=>setForm({...form, startDate: e.target.value})} style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}} />
          </div>
          <div style={{display:'flex', gap:8, marginTop:16, justifyContent:'flex-end'}}>
            <button type="button" onClick={onClose} style={{background:'#fff', color:'#000', border:'1px solid #000', borderRadius:8, padding:'14px 16px', minHeight:56}}>Cancel</button>
            <button disabled={busy} type="submit" style={{background:'#000', color:'#fff', borderRadius:8, padding:'14px 16px', minHeight:56}}>{busy? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

