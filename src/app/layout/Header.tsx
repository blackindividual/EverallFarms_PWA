import { Link } from 'react-router-dom'
import { useState } from 'react'
import { exportAll, stringifyExport, defaultBackupFileName, downloadJson } from '../../data/io/export'
import { ImportDialog } from '../modals/ImportDialog'

export function Header() {
  const [showImport, setShowImport] = useState(false)

  async function onExport() {
    try {
      const payload = await exportAll()
      const json = stringifyExport(payload, false)
      downloadJson(defaultBackupFileName(), json)
    } catch (e) {
      console.error('Export failed', e)
      alert('Export failed. Check console for details.')
    }
  }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, background: '#000', color: '#fff',
        padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>EverallFarm_Lite</Link>
        <div style={{display:'flex', gap:8}}>
          <button onClick={onExport} style={{background:'#fff', color:'#000', borderRadius:8, padding:'10px 12px', minHeight:48}}>Export</button>
          <button onClick={()=>setShowImport(true)} style={{background:'#fff', color:'#000', borderRadius:8, padding:'10px 12px', minHeight:48}}>Import</button>
        </div>
      </header>
      {showImport && (
        <ImportDialog open onClose={()=>setShowImport(false)} />
      )}
    </>
  )
}
