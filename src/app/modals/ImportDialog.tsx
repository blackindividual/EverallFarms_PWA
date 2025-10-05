import { useState } from 'react'
import { dryRunImport, applyImport, type ImportStrategy } from '../../data/io/import'

type Props = {
  open: boolean
  onClose: () => void
}

export function ImportDialog({ open, onClose }: Props) {
  const [fileName, setFileName] = useState('')
  const [jsonText, setJsonText] = useState<string | null>(null)
  const [summary, setSummary] = useState<ReturnType<typeof dryRunImport> | null>(null)
  const [strategy, setStrategy] = useState<ImportStrategy>('overwrite')
  const [reassign, setReassign] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  if (!open) return null

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const text = await file.text()
    setJsonText(text)
    try {
      const s = dryRunImport(text)
      setSummary(s)
      setError(null)
    } catch (err: any) {
      setSummary(null)
      setError('Invalid JSON file')
    }
  }

  async function onApply() {
    if (!jsonText) return
    setBusy(true)
    setError(null)
    try {
      await applyImport(jsonText, { strategy, reassignReminderIds: reassign })
      setDone(true)
    } catch (e: any) {
      setError(String(e?.message ?? e))
    }
    setBusy(false)
  }

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div role="dialog" aria-modal="true" style={{background:'#fff', color:'#000', borderRadius:12, width:'min(760px, 96vw)'}}>
        <div style={{padding:16, borderBottom:'1px solid #000', fontWeight:600}}>Import Data</div>
        <div style={{padding:16}}>
          {error && <div style={{background:'#000', color:'#fff', padding:12, borderRadius:8, marginBottom:12}}>{error}</div>}

          {!done ? (
            <>
              <div className="grid" style={{display:'grid', gap:12}}>
                <input type="file" accept="application/json,.json" onChange={onPickFile} style={{border:'1px solid #000', padding:'12px 14px', minHeight:56, borderRadius:8, background:'#fff'}} />
                {fileName && <div style={{fontSize:14}}>Selected: {fileName}</div>}
                {summary && (
                  <div style={{border:'1px solid #000', borderRadius:8, padding:'12px 14px'}}>
                    <div style={{fontWeight:600, marginBottom:6}}>Preview</div>
                    <div style={{fontSize:14, lineHeight:1.6}}>
                      <div>Counts:</div>
                      <ul>
                        {Object.entries(summary.counts).map(([k,v]) => (
                          <li key={k}>{k}: {v as any}</li>
                        ))}
                      </ul>
                      {summary.unknownTables.length > 0 && (
                        <div>Unknown tables: {summary.unknownTables.join(', ')}</div>
                      )}
                      {summary.errors.length > 0 && (
                        <div style={{marginTop:8, color:'#b00020'}}>Errors: {summary.errors.length}</div>
                      )}
                    </div>
                  </div>
                )}
                <div style={{border:'1px solid #000', borderRadius:8, padding:'12px 14px'}}>
                  <div style={{fontWeight:600, marginBottom:6}}>Import options</div>
                  <div style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'center'}}>
                    <label><input type="radio" name="strategy" checked={strategy==='overwrite'} onChange={()=>setStrategy('overwrite')} /> Overwrite (default)</label>
                    <label><input type="radio" name="strategy" checked={strategy==='skip'} onChange={()=>setStrategy('skip')} /> Skip conflicts</label>
                    <label><input type="radio" name="strategy" checked={strategy==='clearAndReplace'} onChange={()=>setStrategy('clearAndReplace')} /> Clear and replace</label>
                  </div>
                  <div style={{marginTop:8}}>
                    <label><input type="checkbox" checked={reassign} onChange={(e)=>setReassign(e.target.checked)} /> Reassign IDs for vaccination reminders (recommended)</label>
                  </div>
                </div>
              </div>
              <div style={{display:'flex', gap:8, marginTop:16, justifyContent:'flex-end'}}>
                <button onClick={onClose} style={{background:'#fff', color:'#000', border:'1px solid #000', borderRadius:8, padding:'14px 16px', minHeight:56}}>Cancel</button>
                <button disabled={busy || !summary || summary.errors.length>0} onClick={onApply} style={{background:'#000', color:'#fff', borderRadius:8, padding:'14px 16px', minHeight:56}}>{busy? 'Importing…' : 'Apply Import'}</button>
              </div>
            </>
          ) : (
            <>
              <div style={{background:'#000', color:'#fff', padding:12, borderRadius:8}}>Import completed.</div>
              <div style={{display:'flex', gap:8, marginTop:16, justifyContent:'flex-end'}}>
                <button onClick={onClose} style={{background:'#000', color:'#fff', borderRadius:8, padding:'14px 16px', minHeight:56}}>Close</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

