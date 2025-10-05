import { useEffect, useMemo, useState } from 'react'
import { MORTALITY_CAUSES, type MortalityCause } from '../../../core/mortalityCauses'
import { createDailyMortalityRepository } from '../../mortality/data/DailyMortalityRepositoryDexie'
import { createBatchesRepository } from '../../batches/data/BatchesRepositoryDexie'
import { recordDailyMortalityWithBatch } from '../model/useCases'

type Props = {
  open: boolean
  batchId: string
  onClose: () => void
}

export function MortalityDialog({ open, batchId, onClose }: Props) {
  const mortalityRepo = useMemo(() => createDailyMortalityRepository?.() || null, []) as any
  const batchesRepo = useMemo(() => createBatchesRepository(), [])
  const [currentCount, setCurrentCount] = useState<number | null>(null)
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    deathsCount: '',
    cause: '' as MortalityCause | '',
    notes: '',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!open) return
    setError(undefined)
    setForm({ date: new Date().toISOString().slice(0, 10), deathsCount: '', cause: '', notes: '' })
    ;(async () => {
      const b = await batchesRepo.getById(batchId)
      setCurrentCount(b?.currentCount ?? null)
    })()
  }, [open, batchId, batchesRepo])

  if (!open) return null

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(undefined)
    try {
      await recordDailyMortalityWithBatch(
        mortalityRepo,
        batchesRepo,
        {
          batchId,
          date: form.date,
          deathsCount: Number(form.deathsCount || 0),
          cause: (form.cause || undefined) as MortalityCause | undefined,
          notes: form.notes || undefined,
        },
      )
      onClose()
    } catch (e: any) {
      setError(String(e?.message ?? e))
    }
    setBusy(false)
  }

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div role="dialog" aria-modal="true" style={{background:'#fff', color:'#000', borderRadius:12, width:'min(600px, 96vw)'}}>
        <div style={{padding:16, borderBottom:'1px solid #000', fontWeight:600}}>Record Mortality</div>
        <form onSubmit={onSave} style={{padding:16}}>
          {error && <div style={{background:'#000', color:'#fff', padding:12, borderRadius:8, marginBottom:12}}>{error}</div>}
          <div style={{marginBottom:12}}>Current birds: {currentCount ?? '...'}</div>
          <div style={{display:'grid', gap:12}}>
            <input type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}} />
            <input type="number" inputMode="numeric" min={1} placeholder="Deaths count" value={form.deathsCount} onChange={(e)=>setForm({...form, deathsCount:e.target.value})} style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}} />
            <select value={form.cause} onChange={(e)=>setForm({...form, cause:e.target.value as MortalityCause | ''})} style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8, background:'#fff'}}>
              <option value="">No cause</option>
              {MORTALITY_CAUSES.map(c => <option key={c.value} value={c.value}>{c.display}</option>)}
            </select>
            <textarea rows={3} placeholder={form.cause==='OTHER' ? 'Notes (required for Other)' : 'Notes (optional)'} value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} style={{border:'1px solid #000', padding:'12px 14px', borderRadius:8}} />
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

