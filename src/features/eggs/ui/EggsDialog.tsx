import { useEffect, useMemo, useState } from 'react'
import { createDailyEggsRepository } from '../data/DailyEggsRepositoryDexie'
import { recordDailyEggs } from '../model/useCases'

type Props = {
  open: boolean
  batchId: string
  onClose: () => void
}

export function EggsDialog({ open, batchId, onClose }: Props) {
  const repo = useMemo(() => createDailyEggsRepository(), [])
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    cratesCount: '0',
    looseEggs: '0',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!open) return
    setError(undefined)
    setForm({ date: new Date().toISOString().slice(0, 10), cratesCount: '0', looseEggs: '0' })
  }, [open])

  if (!open) return null

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(undefined)
    try {
      await recordDailyEggs(repo, {
        batchId,
        date: form.date,
        cratesCount: Number(form.cratesCount || 0),
        looseEggs: Number(form.looseEggs || 0),
      })
      onClose()
    } catch (e: any) {
      setError(String(e?.message ?? e))
    }
    setBusy(false)
  }

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div role="dialog" aria-modal="true" style={{background:'#fff', color:'#000', borderRadius:12, width:'min(600px, 96vw)'}}>
        <div style={{padding:16, borderBottom:'1px solid #000', fontWeight:600}}>Record Eggs</div>
        <form onSubmit={onSave} style={{padding:16}}>
          {error && <div style={{background:'#000', color:'#fff', padding:12, borderRadius:8, marginBottom:12}}>{error}</div>}
          <div style={{display:'grid', gap:12}}>
            <input type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}} />
            <input type="number" inputMode="numeric" min={0} placeholder="Crates count" value={form.cratesCount} onChange={(e)=>setForm({...form, cratesCount:e.target.value})} style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}} />
            <input type="number" inputMode="numeric" min={0} placeholder="Loose eggs" value={form.looseEggs} onChange={(e)=>setForm({...form, looseEggs:e.target.value})} style={{border:'1px solid #000', padding:'12px 14px', minHeight:72, borderRadius:8}} />
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

