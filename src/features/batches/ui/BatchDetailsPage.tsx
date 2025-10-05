import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { createBatchesRepository } from '../data/BatchesRepositoryDexie'
import type { BatchEntity } from '../../../data/entities/types'
import { MortalityDialog } from '../../mortality/ui/MortalityDialog'
import { EggsDialog } from '../../eggs/ui/EggsDialog'
import { ExpenseDialog } from '../../expenses/ui/ExpenseDialog'

export default function BatchDetailsPage() {
  const { id } = useParams()
  const repo = useMemo(() => createBatchesRepository(), [])
  const [batch, setBatch] = useState<BatchEntity | null>(null)
  const [openMortality, setOpenMortality] = useState(false)
  const [openEggs, setOpenEggs] = useState(false)
  const [openExpense, setOpenExpense] = useState(false)

  useEffect(() => {
    if (!id) return
    repo.getById(id).then((b) => setBatch(b ?? null))
  }, [id, repo])

  return (
    <div className="p-6">
      <h1 className="mb-2">Batch Details</h1>
      <p className="opacity-80">Batch ID: {id}</p>
      {batch && (
        <div className="mt-2" style={{border:'1px solid #000', borderRadius:8, padding:'12px 14px', maxWidth:640}}>
          <div style={{fontWeight:600}}>{batch.name}</div>
          <div className="opacity-80" style={{fontSize:14}}>{batch.birdType} • started {batch.startDate}</div>
          <div className="mt-2" style={{fontSize:14}}>Current birds: {batch.currentCount}</div>
          <div className="mt-3 flex gap-3 flex-wrap">
            <button onClick={()=>setOpenMortality(true)} style={{background:'#000', color:'#fff', borderRadius:8, padding:'12px 16px', minHeight:56}}>Record Mortality</button>
            <button onClick={()=>setOpenEggs(true)} style={{background:'#000', color:'#fff', borderRadius:8, padding:'12px 16px', minHeight:56}}>Record Eggs</button>
            <button onClick={()=>setOpenExpense(true)} style={{background:'#000', color:'#fff', borderRadius:8, padding:'12px 16px', minHeight:56}}>Record Expense</button>
            <Link to={`/batches/${id}/vaccination`} style={{textDecoration:'underline', alignSelf:'center'}}>Vaccination Guide</Link>
          </div>
        </div>
      )}
      <div className="mt-4 flex gap-3">
        <Link to={`/batches/${id}/weights`} style={{textDecoration:'underline'}}>Weights</Link>
        <Link to={`/batches/${id}/eggs`} style={{textDecoration:'underline'}}>Eggs</Link>
        <Link to={`/batches/${id}/expenses`} style={{textDecoration:'underline'}}>Expenses</Link>
        <Link to={`/batches/${id}/medications`} style={{textDecoration:'underline'}}>Medications</Link>
      </div>
      {id && openMortality && (<MortalityDialog open batchId={id} onClose={()=>setOpenMortality(false)} />)}
      {id && openEggs && (<EggsDialog open batchId={id} onClose={()=>setOpenEggs(false)} />)}
      {id && openExpense && (<ExpenseDialog open batchId={id} onClose={()=>setOpenExpense(false)} />)}
    </div>
  )
}
