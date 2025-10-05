import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { createBatchesRepository } from '../../batches/data/BatchesRepositoryDexie'
import { getVaccinationSchedule } from '../model/schedule'
import { createVaccinationRemindersRepository } from '../data/VaccinationRemindersRepositoryDexie'
import { requestNotificationPermission, subscribeToPush, getSavedSubscription, showLocalTestNotification } from '../../../app/push/pushClient'

export default function VaccinationGuidePage() {
  const { id } = useParams()
  const batchesRepo = useMemo(() => createBatchesRepository(), [])
  const remindersRepo = useMemo(() => createVaccinationRemindersRepository(), [])
  const [batch, setBatch] = useState<any>(null)
  const [schedule, setSchedule] = useState<any>(null)
  const [enabledCount, setEnabledCount] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [pushJson, setPushJson] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const b = await batchesRepo.getById(id)
      setBatch(b)
      if (b) {
        setSchedule(getVaccinationSchedule(b.birdType, b.startDate))
        const c = await remindersRepo.getActiveCount(id)
        setEnabledCount(c)
      }
      setPushJson(getSavedSubscription())
    })()
  }, [id, batchesRepo, remindersRepo])

  async function enableReminders() {
    if (!id || !schedule) return
    setBusy(true); setError(undefined)
    try {
      const reminders = schedule.items.flatMap((item: any) => {
        // evening before (19:00) and morning of (06:30) — store date only, like Lite
        const morning = { batchId: id, vaccinationDay: item.day, vaccinationDate: item.date, vaccinationName: item.vaccinationName, eveningRequestCode: 0, morningRequestCode: 0, isEveningScheduled: false, isMorningScheduled: false, isEnabled: true }
        const eveningDate = new Date(item.date + 'T00:00:00'); eveningDate.setDate(eveningDate.getDate() - 1)
        const evening = { batchId: id, vaccinationDay: item.day, vaccinationDate: eveningDate.toISOString().slice(0,10), vaccinationName: item.vaccinationName + ' (Eve)', eveningRequestCode: 0, morningRequestCode: 0, isEveningScheduled: false, isMorningScheduled: false, isEnabled: true }
        return [evening, morning]
      })
      await remindersRepo.addMany(reminders)
      const c = await remindersRepo.getActiveCount(id)
      setEnabledCount(c)
    } catch (e: any) {
      setError(String(e?.message ?? e))
    }
    setBusy(false)
  }

  async function disableReminders() {
    if (!id) return
    setBusy(true); setError(undefined)
    try {
      await remindersRepo.deleteByBatch(id)
      setEnabledCount(0)
    } catch (e: any) {
      setError(String(e?.message ?? e))
    }
    setBusy(false)
  }

  if (!id) return null
  return (
    <div className="p-6">
      <h1 className="mb-2">Vaccination Guide</h1>
      <p className="opacity-80 mb-4">Batch: {id} • <Link to={`/batches/${id}`} style={{textDecoration:'underline'}}>Back</Link></p>
      {error && <div style={{background:'#000', color:'#fff', padding:12, borderRadius:8, marginBottom:12}}>{error}</div>}

      {batch && schedule ? (
        <div>
          <div style={{border:'1px solid #000', borderRadius:8, padding:'12px 14px', marginBottom:16, maxWidth:800}}>
            <div style={{fontWeight:600}}>{batch.name}</div>
            <div className="opacity-80" style={{fontSize:14}}>{batch.birdType} • started {batch.startDate}</div>
            <div className="mt-3 flex gap-8 items-center">
              <div>Reminders: {enabledCount}</div>
              {enabledCount > 0 ? (
                <button disabled={busy} onClick={disableReminders} style={{background:'#000', color:'#fff', borderRadius:8, padding:'12px 16px', minHeight:56}}>{busy? 'Working…' : 'Disable Reminders'}</button>
              ) : (
                <button disabled={busy} onClick={enableReminders} style={{background:'#000', color:'#fff', borderRadius:8, padding:'12px 16px', minHeight:56}}>{busy? 'Working…' : 'Enable Reminders'}</button>
              )}
            </div>
          </div>

          <div style={{border:'1px solid #000', borderRadius:8, padding:'12px 14px', marginBottom:16, maxWidth:800}}>
            <div style={{fontWeight:600, marginBottom:8}}>Notifications (iOS 16.4+ PWAs)</div>
            <div className="opacity-80" style={{fontSize:14, marginBottom:8}}>Install the app to your Home Screen first. Then enable permission and subscribe. Save the subscription on your server later.</div>
            <div className="flex" style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              <button onClick={async ()=>{ const ok = await requestNotificationPermission(); if(!ok) setError('Permission denied'); }} style={{background:'#000', color:'#fff', borderRadius:8, padding:'12px 16px', minHeight:56}}>Allow Permission</button>
              <button onClick={async ()=>{ const sub = await subscribeToPush(); setPushJson(sub? JSON.stringify(sub) : null) }} style={{background:'#000', color:'#fff', borderRadius:8, padding:'12px 16px', minHeight:56}}>Subscribe to Push</button>
              <button onClick={()=>showLocalTestNotification()} style={{background:'#000', color:'#fff', borderRadius:8, padding:'12px 16px', minHeight:56}}>Local Test</button>
            </div>
            {pushJson && (
              <div style={{marginTop:12}}>
                <div style={{fontWeight:600, marginBottom:4}}>Your subscription (copy to server):</div>
                <textarea readOnly value={pushJson} style={{width:'100%', minHeight:140, border:'1px solid #000', borderRadius:8, padding:'8px'}}/>
              </div>
            )}
          </div>

          <div style={{overflowX:'auto'}}>
            <table style={{borderCollapse:'collapse', minWidth:680}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left', borderBottom:'1px solid #000', padding:'8px 12px'}}>Day</th>
                  <th style={{textAlign:'left', borderBottom:'1px solid #000', padding:'8px 12px'}}>Date</th>
                  <th style={{textAlign:'left', borderBottom:'1px solid #000', padding:'8px 12px'}}>Vaccination</th>
                  <th style={{textAlign:'left', borderBottom:'1px solid #000', padding:'8px 12px'}}>Route</th>
                  <th style={{textAlign:'left', borderBottom:'1px solid #000', padding:'8px 12px'}}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {schedule.items.map((it: any) => (
                  <tr key={it.day}>
                    <td style={{borderBottom:'1px solid #000', padding:'8px 12px'}}>{it.day}</td>
                    <td style={{borderBottom:'1px solid #000', padding:'8px 12px'}}>{it.date}</td>
                    <td style={{borderBottom:'1px solid #000', padding:'8px 12px'}}>{it.vaccinationName}</td>
                    <td style={{borderBottom:'1px solid #000', padding:'8px 12px'}}>{it.route ?? '-'}</td>
                    <td style={{borderBottom:'1px solid #000', padding:'8px 12px'}}>{it.notes ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  )
}
